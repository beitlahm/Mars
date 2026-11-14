import React, { useEffect, useMemo, useState } from 'react';
import MarsGlobe from './components/MarsGlobe.jsx';
import RoutePanel from './components/RoutePanel.jsx';
import SourcePanel from './components/SourcePanel.jsx';
import { SITE, INITIAL_ROUTE } from './data/mission.js';
import { routeSummary, exportRoute, parseRoute } from './lib/mission.js';
import { sampleElevation } from './lib/terrain.js';
import './App.css';

function initialRoute() {
  try { const saved = localStorage.getItem('martian-map-arcadia-v1'); return saved ? parseRoute(saved) : INITIAL_ROUTE; }
  catch { return INITIAL_ROUTE; }
}
export default function App() {
  const [route,setRoute] = useState(initialRoute);
  const [selected,setSelected] = useState('hab');
  const [terrain,setTerrain] = useState(null);
  const [error,setError] = useState('');
  const [tab,setTab] = useState('plan');
  const [layer,setLayer] = useState('optical');
  const [opacity,setOpacity] = useState(1);
  const [exaggeration,setExaggeration] = useState(1);
  const [focus,setFocus] = useState(null);
  const [addMode,setAddMode] = useState(false);
  const [showRoute,setShowRoute] = useState(true);
  const [crewView,setCrewView] = useState(false);
  const [settings,setSettings] = useState({speed:2,budget:4,reserve:25});
  const [saveStatus,setSaveStatus] = useState('Saved on this device');
  const summary = useMemo(()=>routeSummary(route,settings.speed,settings.reserve,terrain),[route,settings,terrain]);
  useEffect(()=>{const controller=new AbortController();fetch('/mars-assets/arcadia-terrain.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Terrain asset missing');return r.json();}).then(setTerrain).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>controller.abort();},[]);
  useEffect(()=>{try{localStorage.setItem('martian-map-arcadia-v1',JSON.stringify(exportRoute(route,settings)));setSaveStatus('Saved on this device');}catch{setSaveStatus('Local saving unavailable · export your route');}},[route,settings]);
  function select(point){setSelected(point.id);setFocus({...point,height:1500,pitch:-85});}
  function move(index,direction){setRoute(current=>{const copy=[...current];[copy[index],copy[index+direction]]=[copy[index+direction],copy[index]];return copy;});}
  function remove(id){setRoute(current=>current.filter(p=>p.id!==id));if(selected===id)setSelected(route[0].id);}
  function update(id,values){setRoute(current=>current.map(p=>p.id===id?{...p,...values}:p));}
  function add(lng,lat){
    if(route.length>=30){setError('This demo supports up to 30 stops.');return;}
    if(!terrain||sampleElevation(terrain,lng,lat)===null){setError('Choose a point inside valid terrain coverage.');return;}
    const point={id:crypto.randomUUID(),lng,lat,name:'Science stop '+route.length,kind:'science',minutes:15,objective:'Define a science objective and verify this location.'};
    setRoute(current=>[...current,point]);setSelected(point.id);setAddMode(false);setError('');
  }
  function download(){
    const url=URL.createObjectURL(new Blob([JSON.stringify(exportRoute(route,settings),null,2)],{type:'application/geo+json'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='arcadia-mission.geojson';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function importFile(event){
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>1000000)throw Error('Route file must be smaller than 1 MB.');const imported=parseRoute(await file.text());setRoute(imported);setSelected(imported[0].id);setFocus({...imported[0],height:3000});setError('');}catch(e){setError(e.message);}
    event.target.value='';
  }
  const point=route.find(p=>p.id===selected)||route[0];
  return <main className={'mission-app '+(crewView?'crew-view':'')}>
    <section className="map-pane" aria-label="Cesium Mars mission map">
      <MarsGlobe route={route} selected={selected} onSelect={id=>{const p=route.find(p=>p.id===id);if(p)select(p);}} onAdd={add} addMode={addMode} layer={layer} opacity={opacity} exaggeration={exaggeration} focus={focus} terrain={terrain} showRoute={showRoute}/>
      <header className="brand"><span className="mark">M<span>↗</span></span><div><strong>MARTIAN MAP</strong><small>INTERPLANETARY SURVIVAL GUIDE</small></div></header>
      <div className="map-title"><span>ARCADIA FIELD STATION / CONCEPT 01</span><h1>Arcadia Planitia.</h1><p>40.525° N &nbsp; 193.358° E<br/>A habitat mission in the northern plains.</p></div>
      <div className="map-badges"><span><i/> MEASURED TERRAIN</span><span>PROPOSED MISSION</span></div>
      <div className="camera-tools" aria-label="Camera controls">
        <button title="View planet" onClick={()=>setFocus({lng:SITE.lng,lat:SITE.lat,height:8500000,pitch:-90})}>◎<span>Planet</span></button>
        <button title="View field area" onClick={()=>setFocus({...SITE,lat:SITE.lat-.025,pitch:-62})}>⌖<span>Field</span></button>
        <button title="Overhead view" onClick={()=>setFocus({...SITE,height:5500,pitch:-90})}>⊞<span>Overhead</span></button>
        <button title="Simulated eye-level view" onClick={()=>setFocus({...point,height:3,pitch:0,heading:35})}>↗<span>Surface</span></button>
      </div>
      <div className="layer-dock"><div className="layer-tabs">{[['optical','Optical'],['elevation','Elevation'],['thermal','Thermal IR']].map(([id,label])=><button key={id} className={layer===id?'active':''} aria-pressed={layer===id} onClick={()=>setLayer(id)}>{label}</button>)}</div>
        <div className="layer-options"><label>Opacity<input aria-label="Layer opacity" type="range" min="0" max="1" step=".05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/></label><label>Relief<select aria-label="Vertical exaggeration" value={exaggeration} onChange={e=>setExaggeration(Number(e.target.value))}><option value="1">1× true scale</option><option value="3">3× exaggerated</option><option value="5">5× exaggerated</option></select></label><label><input type="checkbox" checked={showRoute} onChange={e=>setShowRoute(e.target.checked)}/> Route</label></div>
        <p>{layer==='optical'?'HiRISE orthophoto · ~3.3 m preview':layer==='elevation'?'Low −3962 m ▰▰▰ High −3928 m · Mars datum':'THEMIS daytime IR · relative image brightness'}{exaggeration>1?' · HEIGHT EXAGGERATED':''}</p>
      </div>
      <div className="map-note">Surface view is an orbital-derived simulation. Drag to pan · wheel to zoom · Ctrl + drag to tilt.</div>
      <button className="crew-toggle" onClick={()=>setCrewView(!crewView)}>{crewView?'Open mission planner':'Focus on terrain'}</button>
    </section>
    <aside className="mission-panel">
      <div className="panel-heading"><span>MISSION WORKSPACE</span><span className="badge">PROTOTYPE</span></div>
      <nav className="panel-tabs"><button className={tab==='plan'?'active':''} onClick={()=>setTab('plan')}>Plan excursion</button><button className={tab==='data'?'active':''} onClick={()=>setTab('data')}>Data & sources</button></nav>
      {error&&<div className="notice warning" role="alert">{error}<button aria-label="Dismiss message" onClick={()=>setError('')}>×</button></div>}
      {tab==='plan'?<RoutePanel route={route} selected={selected} select={select} move={move} remove={remove} update={update} settings={settings} setSettings={setSettings} summary={summary} onExport={download} onImport={importFile} onReset={()=>{setRoute(INITIAL_ROUTE);setSelected('hab');setFocus({...SITE});}} addMode={addMode} setAddMode={setAddMode}/>:<SourcePanel/>}
      <footer>{saveStatus}<br/>Research prototype · route requires ground validation</footer>
    </aside>
  </main>;
}
