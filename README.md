# Aditya-L1 ASPEX-STEPS Monitor

A real-time telemetry visualization dashboard for the **ASPEX-STEPS** (Supra Thermal Energetic Particle Spectrometer) payload on ISRO's **Aditya-L1** mission.

This application monitors solar wind particle flux (Protons, Alpha particles) and uses **Google Gemini AI** to provide automated space weather hazard analysis based on the live data stream.

## Features

- **Real-time Visualization**: Live time-series charts of high/low energy protons and alpha particles.
- **AI Mission Analyst**: Integrated Google Gemini 3 Flash model that analyzes telemetry snapshots to detect potential Solar Energetic Particle (SEP) events or CMEs.
- **System Health Monitoring**: Live status of instrument voltage, temperature, and integration times.
- **Interactive Dashboard**: Switch between Live Dashboard and Data Archive views.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Visualization**: Recharts
- **AI/ML**: Google GenAI SDK (Gemini 3 Flash)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js (v18 or higher)
- A Google Cloud API Key with access to Gemini API.

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd aditya-l1-steps-monitor
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Google API Key:
    ```env
    API_KEY=your_google_api_key_here
    ```
    *Note: The application requires `API_KEY` to be available via `process.env`. The build configuration handles this injection.*

## Running the Application

### Development Mode
To start the local development server with hot-reloading:

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
To create a production-ready build:

```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## Project Structure

- `/src`: Source code
  - `/components`: UI components (Charts, Cards, Indicators)
  - `/services`: API integrations (Google Gemini)
  - `/types`: TypeScript definitions
- `index.html`: Entry HTML
- `vite.config.ts`: Build configuration