export const SITE = {
  name: 'Arcadia Planitia', subtitle: 'Northern plains / terrain study area',
  lat: 40.525, lng: -166.642, height: 4700,
  source: 'https://www.uahirise.org/dtm/ESP_035651_2210',
  description: 'Investigate patterned ground and crater morphology while assessing a proposed habitat excursion.',
};
export const INITIAL_ROUTE = [
  { id: 'hab', name: 'Proposed habitat', lat: 40.519, lng: -166.646, kind: 'habitat', minutes: 0, objective: 'Complete suit checks and establish the return point. Habitat placement is a design assumption.' },
  { id: 'survey', name: 'Ground survey', lat: 40.523, lng: -166.653, kind: 'science', minutes: 15, objective: 'Document surface texture and assess candidate sampling ground. Verify conditions with reconnaissance before EVA.' },
  { id: 'crater', name: 'Crater observation', lat: 40.529, lng: -166.649, kind: 'science', minutes: 20, objective: 'Compare crater morphology with the orbital terrain model. Treat the approach as unvalidated.' },
  { id: 'sample', name: 'Resource reconnaissance', lat: 40.526, lng: -166.631, kind: 'science', minutes: 20, objective: 'Plan subsurface sounding to test the regional ice hypothesis. Ice has not been confirmed at this stop.' },
];
export const SOURCES = [
  { name: 'HiRISE optical', type: 'Optical', resolution: '1.00 m source · ~3.3 m preview', status: 'Bundled', url: SITE.source, text: 'Orthorectified red-band image ESP_035651_2210_RED_C_01_ORTHO. Grayscale reflectance context. NASA/JPL-Caltech/UArizona.' },
  { name: 'HiRISE stereo DTM', type: 'Topographic', resolution: '1.00 m source · ~20 m preview', status: 'Bundled', url: SITE.source, text: 'DTEEC_035651_2210_036917_2210_A01. Heights reference the Mars 2000 equipotential surface. Nodata remains unknown.' },
  { name: 'THEMIS daytime IR', type: 'Thermal', resolution: '100 m source · ~81 m tile sampling', status: 'Bundled', url: 'https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars', text: 'THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018, NASA Trek WMTS level 9. Image contrast is not a live temperature measurement.' },
  { name: 'Regional ice evidence', type: 'Research', resolution: 'Regional interpretation', status: 'Reference', url: 'https://www.usgs.gov/publications/availability-subsurface-water-ice-resources-northern-mid-latitudes-mars', text: 'SWIM research motivates Arcadia exploration. It does not verify ice beneath the proposed habitat or individual stops.' },
];
