import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Satellite, 
  Settings, 
  Thermometer, 
  Zap,
  Radio,
  FileText
} from 'lucide-react';
import { StepsDataPoint, DataStatus, SystemHealth, AnalysisResult } from './types';
import { analyzeSolarData } from './services/geminiService';
import { LiveIndicator } from './components/LiveIndicator';
import { MetricCard } from './components/MetricCard';
import { StepsChart } from './components/StepsChart';

// Simulation Constants
const MAX_DATA_POINTS = 60;
const SIMULATION_INTERVAL = 1000;

const App: React.FC = () => {
  const [data, setData] = useState<StepsDataPoint[]>([]);
  const [status, setStatus] = useState<DataStatus>(DataStatus.CONNECTING);
  const [health, setHealth] = useState<SystemHealth>({
    instrumentTemp: -12.4,
    voltage: 28.1,
    integrationTime: 1000,
    status: 'NOMINAL'
  });
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'ARCHIVE'>('DASHBOARD');

  // Refs for simulation values to keep them continuous
  const protonLowRef = useRef(1500);
  const protonHighRef = useRef(400);
  const alphaRef = useRef(50);
  
  // Initialize Mock Data
  useEffect(() => {
    const initialData: StepsDataPoint[] = [];
    const now = Date.now();
    for (let i = MAX_DATA_POINTS; i > 0; i--) {
      initialData.push(generateDataPoint(now - i * 1000));
    }
    setData(initialData);
    setStatus(DataStatus.LIVE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data Generator Function
  const generateDataPoint = (timestamp: number): StepsDataPoint => {
    // Random walk simulation
    protonLowRef.current += (Math.random() - 0.5) * 50;
    protonHighRef.current += (Math.random() - 0.5) * 20;
    alphaRef.current += (Math.random() - 0.5) * 5;

    // Bounds checking
    protonLowRef.current = Math.max(1000, Math.min(2000, protonLowRef.current));
    protonHighRef.current = Math.max(200, Math.min(800, protonHighRef.current));
    alphaRef.current = Math.max(10, Math.min(100, alphaRef.current));

    const date = new Date(timestamp);
    return {
      timestamp,
      displayTime: date.toLocaleTimeString('en-GB', { hour12: false }),
      protonFluxLow: protonLowRef.current,
      protonFluxHigh: protonHighRef.current,
      alphaParticles: alphaRef.current,
      electronFlux: protonLowRef.current * 1.5 // Correlation
    };
  };

  // Live Data Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = generateDataPoint(Date.now());
        const updatedData = [...prevData, newDataPoint];
        if (updatedData.length > MAX_DATA_POINTS) {
          updatedData.shift();
        }
        return updatedData;
      });

      // Fluctuate health metrics slightly
      setHealth(prev => ({
        ...prev,
        instrumentTemp: -12.4 + (Math.random() - 0.5),
        voltage: 28.1 + (Math.random() - 0.5) * 0.1
      }));

    }, SIMULATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // AI Analysis Loop (Every 10 seconds to save API calls)
  useEffect(() => {
    const analysisInterval = setInterval(async () => {
      if (data.length > 0 && !isAnalyzing) {
        setIsAnalyzing(true);
        const result = await analyzeSolarData(data.slice(-20)); // Analyze last 20 seconds
        setAiAnalysis({
            ...result,
            lastUpdated: new Date().toLocaleTimeString()
        });
        setIsAnalyzing(false);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(analysisInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]); // Re-bind if data buffer changes significantly (though interval handles this)

  return (
    <div className="min-h-screen bg-space-900 text-gray-200 font-sans selection:bg-isro-orange selection:text-white">
      {/* Header */}
      <header className="border-b border-space-700 bg-space-900/90 backdrop-blur fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
               {/* ISRO Logo Placeholder representation */}
               <Satellite className="text-isro-orange" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">ADITYA-L1 <span className="text-gray-500 mx-2">|</span> ASPEX-STEPS</h1>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Supra Thermal Energetic Particle Spectrometer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <button 
                onClick={() => setViewMode('DASHBOARD')}
                className={`${viewMode === 'DASHBOARD' ? 'text-isro-orange' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                Live Telemetry
              </button>
              <button 
                onClick={() => setViewMode('ARCHIVE')}
                className={`${viewMode === 'ARCHIVE' ? 'text-isro-orange' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                Archive (FITS/NetCDF)
              </button>
            </nav>
            <div className="h-6 w-px bg-space-700"></div>
            <LiveIndicator status={status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        
        {/* Top Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-space-800 border border-space-700 rounded-lg p-3 flex items-center space-x-3">
            <div className="p-2 bg-space-700 rounded-md text-blue-400">
              <Thermometer size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Detector Temp</p>
              <p className="font-mono font-bold">{health.instrumentTemp.toFixed(2)} °C</p>
            </div>
          </div>
          <div className="bg-space-800 border border-space-700 rounded-lg p-3 flex items-center space-x-3">
            <div className="p-2 bg-space-700 rounded-md text-yellow-400">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Input Voltage</p>
              <p className="font-mono font-bold">{health.voltage.toFixed(2)} V</p>
            </div>
          </div>
          <div className="bg-space-800 border border-space-700 rounded-lg p-3 flex items-center space-x-3">
            <div className="p-2 bg-space-700 rounded-md text-green-400">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Integration Time</p>
              <p className="font-mono font-bold">{health.integrationTime} ms</p>
            </div>
          </div>
           <div className="bg-space-800 border border-space-700 rounded-lg p-3 flex items-center space-x-3">
            <div className="p-2 bg-space-700 rounded-md text-purple-400">
              <Database size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Backend Format</p>
              <p className="font-mono font-bold text-xs">FITS / NetCDF4</p>
            </div>
          </div>
        </div>

        {viewMode === 'DASHBOARD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Metrics & AI */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* AI Insight Card */}
              <div className="bg-gradient-to-b from-space-800 to-space-900 border border-space-700 rounded-lg p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Cpu size={64} />
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-400 animate-ping' : 'bg-blue-400'}`}></div>
                  <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs">Gemini Mission Analyst</h3>
                </div>
                
                <div className="min-h-[100px]">
                    {aiAnalysis ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-300 leading-relaxed italic">"{aiAnalysis.summary}"</p>
                            <div className="flex items-center justify-between pt-2 border-t border-space-700">
                                <span className="text-xs text-gray-500">Hazard Assessment</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    aiAnalysis.hazardLevel === 'HIGH' ? 'bg-red-900 text-red-200' :
                                    aiAnalysis.hazardLevel === 'MODERATE' ? 'bg-yellow-900 text-yellow-200' :
                                    aiAnalysis.hazardLevel === 'LOW' ? 'bg-green-900 text-green-200' :
                                    'bg-gray-700 text-gray-300'
                                }`}>{aiAnalysis.hazardLevel}</span>
                            </div>
                            <p className="text-[10px] text-gray-600 text-right">Updated: {aiAnalysis.lastUpdated}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-2 py-4">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-gray-500">Analyzing Telemetry...</span>
                        </div>
                    )}
                </div>
              </div>

              {/* Real-time Metrics */}
              <div className="grid grid-cols-1 gap-4">
                 {data.length > 0 && (
                  <>
                     <MetricCard 
                        title="Low Energy H+" 
                        value={data[data.length-1].protonFluxLow.toFixed(0)} 
                        unit="cnts/s"
                        icon={<Radio size={16} />}
                        trend={data[data.length-1].protonFluxLow > data[data.length-5]?.protonFluxLow ? 'up' : 'down'}
                        colorClass="text-blue-400"
                     />
                     <MetricCard 
                        title="Supra Thermal H+" 
                        value={data[data.length-1].protonFluxHigh.toFixed(0)} 
                        unit="cnts/s"
                        icon={<Zap size={16} />}
                        trend="stable"
                        colorClass="text-red-400"
                     />
                     <MetricCard 
                        title="Alpha Particle Flux" 
                        value={data[data.length-1].alphaParticles.toFixed(1)} 
                        unit="cnts/s"
                        icon={<Activity size={16} />}
                        colorClass="text-green-400"
                     />
                  </>
                 )}
              </div>
            </div>

            {/* Right Column: Charts */}
            <div className="lg:col-span-2 space-y-6">
                <StepsChart data={data} />

                {/* Additional Info / Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-space-800 border border-space-700 rounded-lg p-5">
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Payload Status</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1 border-b border-space-700">
                                <span className="text-gray-400">Mode</span>
                                <span className="text-white">Fine-Res Survey</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-space-700">
                                <span className="text-gray-400">Direction</span>
                                <span className="text-white">Sun-Pointing (L1)</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-space-700">
                                <span className="text-gray-400">Bias Lvl</span>
                                <span className="text-white">Nominal</span>
                            </div>
                        </div>
                    </div>

                     <div className="bg-space-800 border border-space-700 rounded-lg p-5">
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Data Dictionary</h4>
                        <ul className="text-xs text-gray-400 space-y-2">
                            <li className="flex items-start">
                                <span className="text-isro-orange mr-2">•</span>
                                <span><strong>FITS:</strong> Primary format for Level-1 science data products. Header contains WCS coordinates.</span>
                            </li>
                             <li className="flex items-start">
                                <span className="text-isro-orange mr-2">•</span>
                                <span><strong>NetCDF:</strong> Used for time-averaged Level-2 data distribution.</span>
                            </li>
                             <li className="flex items-start">
                                <span className="text-isro-orange mr-2">•</span>
                                <span><strong>JSON:</strong> Websocket stream format for this dashboard.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          /* Archive View Mockup */
          <div className="bg-space-800 border border-space-700 rounded-lg p-10 text-center">
            <FileText className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Data Archive Access</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Access historical FITS and NetCDF4 files from the ISRO Science Data Archive (ISDA). 
              <br/><span className="text-sm italic opacity-70">(Simulation: No actual backend connection)</span>
            </p>
            <button 
                onClick={() => setViewMode('DASHBOARD')}
                className="px-4 py-2 bg-isro-orange text-white rounded hover:bg-orange-600 transition-colors text-sm font-semibold"
            >
                Return to Live Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;