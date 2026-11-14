import React, { useState, useMemo, useRef } from 'react';
import { Globe, Droplets } from 'lucide-react';
import { GLOBAL_COLONIZATION_SITES, WATER_ICE_SURFACE_ROUTES } from './data/sites.js';
import GlobalMarsGlobeViewport from './components/GlobalMarsGlobeViewport.jsx';
import ControllableMarsSurfaceViewport from './components/ControllableMarsSurfaceViewport.jsx';

export default function App() {
  const [viewMode, setViewMode] = useState('GLOBAL');
  const [selectedSiteId, setSelectedSiteId] = useState('arcadia');
  const [selectedRouteId, setSelectedRouteId] = useState('ICE-RT-01');
  const [autoSimRunning, setAutoSimRunning] = useState(true);
  const [roverTelemetry, setRoverTelemetry] = useState({
    x: '-44.0',
    z: '42.0',
    heading: 45,
    iceKg: 207.5,
    battery: '98.4'
  });

  const controlInputRef = useRef({ forward: false, backward: false, left: false, right: false });
  const [toastBanner, setToastBanner] = useState(null);

  const activeSite = useMemo(
    () => GLOBAL_COLONIZATION_SITES.find((s) => s.id === selectedSiteId) || GLOBAL_COLONIZATION_SITES[2],
    [selectedSiteId]
  );

  const activeSurfaceRoute = useMemo(
    () => WATER_ICE_SURFACE_ROUTES.find((r) => r.id === selectedRouteId) || WATER_ICE_SURFACE_ROUTES[0],
    [selectedRouteId]
  );

  const triggerBanner = (msg, type = 'info') => {
    setToastBanner({ msg, type });
    setTimeout(() => {
      setToastBanner((current) => (current?.msg === msg ? null : current));
    }, 4500);
  };

  const handleDropToWaterIceSimulation = (targetSiteId) => {
    const chosen = GLOBAL_COLONIZATION_SITES.find((s) => s.id === targetSiteId) || GLOBAL_COLONIZATION_SITES[2];
    setSelectedSiteId(chosen.id);
    setAutoSimRunning(true);
    setViewMode('SURFACE_SIM');
    triggerBanner(
      `TOUCHDOWN CONFIRMED AT ${chosen.name} (${chosen.waterIceRating}). Water/Ice Routes loaded — use WASD or Arrow Keys to drive!`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {toastBanner && (
        <div className="bg-sky-950/95 border-b border-sky-500/50 px-5 py-3 text-xs font-mono text-sky-200 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastBanner.msg}</span>
          </div>
          <button onClick={() => setToastBanner(null)} className="text-[10px] underline opacity-85 hover:opacity-100 cursor-pointer">
            DISMISS
          </button>
        </div>
      )}

      <header className="border-b border-slate-800/90 bg-[#0B1120]/95 backdrop-blur-md px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <Globe className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-sky-400">
                ARES-SPHERE // MARS COLONIZATION &amp; TACTICAL SIMULATOR
              </span>
              <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                TOURNAMENT READY v4.2
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-semibold tracking-tight text-white">
              {viewMode === 'GLOBAL' && 'GLOBAL PLANETARY RECON & WATER-ICE TARGETING'}
              {viewMode === 'SURFACE_SIM' && `SURFACE ISRU SIMULATION // ${activeSite.name}`}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {[
            { id: 'GLOBAL', label: 'MARS GLOBE' },
            { id: 'SURFACE_SIM', label: 'SURFACE SIM' }
            // TODO: SITES / ROUTES / JUDGE_MODE views (rest of original App was cut off)
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer font-bold ${
                viewMode === mode.id
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      {viewMode === 'GLOBAL' && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#0C1322] border border-slate-800/90 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  MARS WATER &amp; ICE ZONES (8 SITES)
                </h2>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">ICE RADAR ON</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px]">
                {GLOBAL_COLONIZATION_SITES.map((site) => {
                  const isSelected = selectedSiteId === site.id;
                  const hasHighIce = site.waterIceRating.includes('EXCEPTIONAL') || site.waterIceRating.includes('HIGH');
                  return (
                    <div
                      key={site.id}
                      onClick={() => setSelectedSiteId(site.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-sky-950/40 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-300">{site.code}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono border font-semibold ${
                            hasHighIce
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {hasHighIce ? 'RICH WATER ICE' : `${site.suitabilityScore}% SUITABLE`}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1.5">{site.name}</div>
                      <div className="text-[11px] font-mono text-cyan-300 mt-1">{site.waterIceRating}</div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{site.description}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleDropToWaterIceSimulation(activeSite.id)}
                className="mt-5 w-full py-4 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] cursor-pointer"
              >
                DROP TO {activeSite.code} SURFACE
              </button>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <GlobalMarsGlobeViewport
              selectedSiteId={selectedSiteId}
              onSelectSite={setSelectedSiteId}
              onDiveToSurface={handleDropToWaterIceSimulation}
            />
          </section>
        </main>
      )}

      {viewMode === 'SURFACE_SIM' && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-[#0C1322] border border-slate-800/90 rounded-3xl p-5 shadow-2xl font-mono text-xs space-y-3">
              <h2 className="font-bold text-sky-400 uppercase tracking-wider">Rover Telemetry</h2>
              <div>POS: {roverTelemetry.x}, {roverTelemetry.z}</div>
              <div>HDG: {roverTelemetry.heading}°</div>
              <div>ICE: {roverTelemetry.iceKg} kg</div>
              <div>BAT: {roverTelemetry.battery}%</div>

              <h2 className="font-bold text-sky-400 uppercase tracking-wider pt-2">Ice Route</h2>
              {WATER_ICE_SURFACE_ROUTES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`w-full text-left p-3 rounded-2xl border cursor-pointer ${
                    selectedRouteId === r.id ? 'border-sky-400/80 bg-sky-950/40' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="font-bold text-white">{r.name}</div>
                  <div className="text-cyan-300">{r.iceConcentration}</div>
                  <div className="text-slate-400">{r.distanceM} m</div>
                </button>
              ))}

              <button
                onClick={() => setAutoSimRunning((v) => !v)}
                className="w-full py-3 rounded-2xl bg-sky-500 text-slate-950 font-bold cursor-pointer"
              >
                {autoSimRunning ? 'PAUSE AUTOPILOT' : 'RESUME AUTOPILOT'}
              </button>
            </div>
          </aside>

          <section className="lg:col-span-9">
            <ControllableMarsSurfaceViewport
              activeSite={activeSite}
              activeRoute={activeSurfaceRoute}
              autoSimRunning={autoSimRunning}
              controlInputRef={controlInputRef}
              onTelemetryUpdate={setRoverTelemetry}
              onHarvestIce={(label, kg) => triggerBanner(`ICE HARVESTED: ${label} — total ${kg} kg`, 'success')}
            />
          </section>
        </main>
      )}
    </div>
  );
}
