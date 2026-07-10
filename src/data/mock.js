// Central mock dataset for the Enterprise Energy Intelligence & Performance
// Assurance Platform (EEIPA) — AIX (AI Xplod). Values mirror the proposal
// screenshots (Zones A/B/C).

export const ZONE_COLORS = {
  'Zone A': 'var(--zone-a)',
  'Zone B': 'var(--zone-b)',
  'Zone C': 'var(--zone-c)',
}
export const ZONE_HEX = {
  'Zone A': '#d7e9a0',
  'Zone B': '#8ec63f',
  'Zone C': '#2b7fff',
}

// Seeded RNG so noisy data stays stable across re-renders.
function makeRng(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Realistic time series: rising baseline + mean-reverting noise + spikes.
function ramp(peak, points = 30) {
  const out = []
  const base = new Date(2026, 6, 8, 14, 6, 0).getTime()
  const rnd = makeRng(Math.round(peak * 1000) + points + 7)
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5
  let level = peak * (0.3 + rnd() * 0.15)
  for (let i = 0; i < points; i++) {
    const t = new Date(base + i * 30 * 1000)
    const p = i / (points - 1)
    const baseline = peak * (0.28 + p * 0.5)
    level += (baseline - level) * 0.35 + gauss() * peak * 0.13
    if (rnd() < 0.09) level += gauss() * peak * 0.28
    level = Math.max(peak * 0.04, Math.min(peak * 1.18, level))
    out.push({
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      short: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(level),
    })
  }
  return out
}

// ---------- Detail metrics (Electricity / Fuel / Thermal) ----------
export const METRICS = {
  // --- Electricity ---
  'building-consumption': {
    key: 'building-consumption', group: 'Energy', parent: 'Electricity', parentPath: '/energy/electricity',
    title: 'Building Consumption', zoneTitle: 'ZONE A - BUILDING', icon: 'building', accent: 'green',
    summary: { primary: { val: 67, unit: 'kWh', label: 'Total Consumed This Year' }, secondary: { val: 13, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '6', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '11', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '28', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)', split: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 29 }, { zone: 'Zone C', value: 38 }],
    miniBars: [{ zone: 'Zone A', value: 32 }, { zone: 'Zone B', value: 32 }, { zone: 'Zone C', value: 36 }],
    series: ramp(28), seriesUnit: 'kWh',
  },
  'ev-charge': {
    key: 'ev-charge', group: 'Energy', parent: 'Electricity', parentPath: '/energy/electricity',
    title: 'EV Charge', zoneTitle: 'ZONE A - EV CHARGE', icon: 'ev', accent: 'green',
    summary: { primary: { val: 70, unit: 'kWh', label: 'Total Consumed This Year' }, secondary: { val: 14, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '5', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '12', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '30', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)', split: [{ zone: 'Zone A', value: 25 }, { zone: 'Zone B', value: 39 }, { zone: 'Zone C', value: 36 }],
    miniBars: [{ zone: 'Zone A', value: 25 }, { zone: 'Zone B', value: 39 }, { zone: 'Zone C', value: 36 }],
    series: ramp(30), seriesUnit: 'kWh',
  },
  'solar-generation': {
    key: 'solar-generation', group: 'Energy', parent: 'Electricity', parentPath: '/energy/electricity',
    title: 'Solar Generation', zoneTitle: 'ZONE A - SOLAR', icon: 'solar', accent: 'amber',
    summary: { primary: { val: 71, unit: 'kWh', label: 'Produced This Year' }, secondary: { val: 36, unit: 'tCO2', label: 'Saved This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '36', unit: 'Tonnes', sub: 'Saved This Year' },
      { icon: 'wallet', label: 'Estimated Savings', val: '44', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Generated', val: '71', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'GENERATION SPLIT (kWh)', split: [{ zone: 'Zone A', value: 25 }, { zone: 'Zone B', value: 39 }, { zone: 'Zone C', value: 36 }],
    miniBars: [{ zone: 'Zone A', value: 25 }, { zone: 'Zone B', value: 39 }, { zone: 'Zone C', value: 36 }],
    series: ramp(40), seriesUnit: 'kWh',
  },
  // --- Fuel ---
  'natural-gas': {
    key: 'natural-gas', group: 'Energy', parent: 'Fuel', parentPath: '/energy/fuel',
    title: 'Natural Gas', zoneTitle: 'ZONE A - NATURAL GAS', icon: 'flame', accent: 'amber',
    summary: { primary: { val: 136, unit: 'Liter', label: 'Total Consumed This Year' }, secondary: { val: 27, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '27', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '52', unit: 'MYR', sub: 'This Year' },
      { icon: 'drop', label: 'Total Liter', val: '136', unit: 'Liter', sub: 'This Year' },
    ],
    splitTitle: 'GAS SPLIT (kWh)', split: [{ zone: 'Zone A', value: 34 }, { zone: 'Zone B', value: 28 }, { zone: 'Zone C', value: 38 }],
    miniBars: [{ zone: 'Zone A', value: 34 }, { zone: 'Zone B', value: 28 }, { zone: 'Zone C', value: 38 }],
    series: ramp(44), seriesUnit: 'Liter',
  },
  'automotive-fuels': {
    key: 'automotive-fuels', group: 'Energy', parent: 'Fuel', parentPath: '/energy/fuel',
    title: 'Automotive Fuels', zoneTitle: 'ZONE A - AUTOMOTIVE FUELS', icon: 'fuelpump', accent: 'amber',
    summary: { primary: { val: 138, unit: 'Liter', label: 'Total Consumed This Year' }, secondary: { val: 27, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '27', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '55', unit: 'MYR', sub: 'This Year' },
      { icon: 'drop', label: 'Total Liter', val: '138', unit: 'Liter', sub: 'This Year' },
    ],
    splitTitle: 'FUEL SPLIT (kWh)', split: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 31 }, { zone: 'Zone C', value: 36 }],
    miniBars: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 31 }, { zone: 'Zone C', value: 36 }],
    series: ramp(45), seriesUnit: 'Liter',
  },
  // --- Thermal ---
  ahu: {
    key: 'ahu', group: 'Energy', parent: 'Thermal', parentPath: '/energy/thermal',
    title: 'AHU', zoneTitle: 'AHU - ZONE A', icon: 'wind', accent: 'cyan',
    summary: { primary: { val: 58, unit: 'kWh', label: 'Total Consumed This Year' }, secondary: { val: 12, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '12', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '23', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '58', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)', split: [{ zone: 'Zone A', value: 29 }, { zone: 'Zone B', value: 36 }, { zone: 'Zone C', value: 35 }],
    miniBars: [{ zone: 'Zone A', value: 29 }, { zone: 'Zone B', value: 36 }, { zone: 'Zone C', value: 35 }],
    series: ramp(58), seriesUnit: 'kWh',
  },
  chiller: {
    key: 'chiller', group: 'Energy', parent: 'Thermal', parentPath: '/energy/thermal',
    title: 'Chiller', zoneTitle: 'CHILLER - ZONE A', icon: 'snow', accent: 'cyan',
    summary: { primary: { val: 64, unit: 'kWh', label: 'Total Consumed This Year' }, secondary: { val: 15, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '15', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '26', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '64', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)', split: [{ zone: 'Zone A', value: 35 }, { zone: 'Zone B', value: 33 }, { zone: 'Zone C', value: 32 }],
    miniBars: [{ zone: 'Zone A', value: 35 }, { zone: 'Zone B', value: 33 }, { zone: 'Zone C', value: 32 }],
    series: ramp(64), seriesUnit: 'kWh',
  },
  'cooling-tower': {
    key: 'cooling-tower', group: 'Energy', parent: 'Thermal', parentPath: '/energy/thermal',
    title: 'Cooling Tower', zoneTitle: 'COOLING TOWER - ZONE A', icon: 'tower', accent: 'cyan',
    summary: { primary: { val: 60, unit: 'kWh', label: 'Total Consumed This Year' }, secondary: { val: 11, unit: 'tCO2', label: 'Generated This Year' } },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '11', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '24', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '60', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)', split: [{ zone: 'Zone A', value: 30 }, { zone: 'Zone B', value: 34 }, { zone: 'Zone C', value: 36 }],
    miniBars: [{ zone: 'Zone A', value: 30 }, { zone: 'Zone B', value: 34 }, { zone: 'Zone C', value: 36 }],
    series: ramp(60), seriesUnit: 'kWh',
  },
}

// ---------- Enriched data for detail-heavy views ----------
const STATUS_POOL = ['Normal', 'Optimal', 'Normal', 'Warning', 'Normal']
const ZONES = ['Zone A', 'Zone B', 'Zone C']

function hourly(peak) {
  const rnd = makeRng(Math.round(peak * 777) + 13)
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5
  return Array.from({ length: 24 }, (_, h) => {
    const morning = Math.exp(-((h - 9) ** 2) / 7)
    const evening = Math.exp(-((h - 19) ** 2) / 5)
    let f = 0.12 + morning * 0.72 + evening * 0.9
    f *= 0.85 + gauss() * 0.22
    if (rnd() < 0.06) f *= 1.3
    return { hour: `${String(h).padStart(2, '0')}h`, value: Math.max(1, Math.round(peak * f)) }
  })
}
function readings(peak, unit) {
  const rows = []
  const base = new Date(2026, 6, 8, 14, 0, 0).getTime()
  const rnd = makeRng(Math.round(peak * 311) + 29)
  for (let i = 0; i < 8; i++) {
    const t = new Date(base - i * 15 * 60 * 1000)
    rows.push({
      time: t.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      zone: ZONES[i % 3], value: Math.max(1, Math.round(peak * (0.28 + rnd() * 0.95))), unit,
      status: STATUS_POOL[(i * 3) % STATUS_POOL.length],
    })
  }
  return rows
}

Object.values(METRICS).forEach((m) => {
  const peak = m.series[m.series.length - 1]?.value || 12
  const pre = m.key.replace(/[^a-z]/g, '').slice(0, 3).toUpperCase()
  m.hourly = hourly(peak)
  m.readings = readings(peak, m.seriesUnit)
  m.stats = [
    { label: 'Peak Demand', val: peak, unit: m.seriesUnit },
    { label: 'Average Load', val: Math.round(peak * 0.42), unit: m.seriesUnit },
    { label: 'Load Factor', val: 68, unit: '%' },
    { label: 'System Efficiency', val: 91, unit: '%' },
    { label: 'vs Target', val: '-6', unit: '%', good: true },
  ]
  m.devices = [
    { id: `MTR-${pre}-A1`, zone: 'Zone A', type: 'Smart Meter', status: 'Online' },
    { id: `MTR-${pre}-B2`, zone: 'Zone B', type: 'Smart Meter', status: 'Online' },
    { id: `SNS-${pre}-C3`, zone: 'Zone C', type: 'IoT Sensor', status: m.key === 'ev-charge' ? 'Offline' : 'Online' },
  ]
})

// Landing card groupings
export const ELECTRICITY_CARDS = ['building-consumption', 'ev-charge', 'solar-generation']
export const FUEL_CARDS = ['natural-gas', 'automotive-fuels']
export const THERMAL_CARDS = ['ahu', 'chiller', 'cooling-tower']

// Energy landing category summary cards (Electricity / Fuel / Thermal)
export const ENERGY_CATEGORIES = [
  { key: 'electricity', title: 'Electricity', icon: 'bolt', path: '/energy/electricity', primary: { val: 115, unit: 'kWh', label: 'Total Consumed This Year' }, co2: 23, split: [{ zone: 'Building', value: 48 }, { zone: 'EV Charge', value: 52 }] },
  { key: 'fuel', title: 'Fuel', icon: 'fuelpump', path: '/energy/fuel', primary: { val: 116, unit: 'Liter', label: 'Produced This Year' }, co2: 23, split: [{ zone: 'Natural gas', value: 50 }, { zone: 'Automotive', value: 50 }] },
  { key: 'thermal', title: 'Thermal', icon: 'thermal', path: '/energy/thermal', primary: { val: 182, unit: 'kWh', label: 'Total Consumed This Year' }, co2: 38, split: [{ zone: 'AHU', value: 28 }, { zone: 'Chiller', value: 35 }, { zone: 'Cooling Tower', value: 37 }] },
]

// ---------- Water ----------
export const WATER = [
  {
    key: 'main-water', title: 'MAIN WATER', icon: 'water', trendTitle: 'MAIN WATER TREND', accent: 'blue',
    stats: [{ val: 231, unit: 'm³', label: 'Consumed This Year' }, { val: 92, unit: 'MYR', label: 'Estimated Cost This Year' }],
    split: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 37 }, { zone: 'Zone C', value: 30 }],
    series: ramp(220),
  },
  {
    key: 'discharge-water', title: 'DISCHARGE WATER', icon: 'pipe', trendTitle: 'DISCHARGE WATER TREND', accent: 'rose',
    stats: [{ val: 226, unit: 'm³', label: 'Discharged This Year' }, { val: 7, unit: 'pH', label: 'Avg pH This Year' }],
    split: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 32 }, { zone: 'Zone C', value: 35 }],
    series: ramp(215),
  },
]

// ---------- Waste ----------
export const WASTE = [
  { key: 'non-hazardous', title: 'Non Hazardous', icon: 'trash', accent: 'green', primary: { val: 1992, unit: 'kg', label: 'Waste This Year' }, secondary: { val: 1318, unit: 'kg', label: 'Recycle This Year' }, split: [{ zone: 'Zone A', value: 33 }, { zone: 'Zone B', value: 34 }, { zone: 'Zone C', value: 33 }] },
  { key: 'hazardous', title: 'Hazardous', icon: 'hazard', accent: 'amber', primary: { val: 2061, unit: 'kg', label: 'Waste This Year' }, secondary: null, split: [{ zone: 'Zone A', value: 32 }, { zone: 'Zone B', value: 32 }, { zone: 'Zone C', value: 37 }] },
  { key: 'scrap-metal', title: 'Scrap Metal', icon: 'scrap', accent: 'cyan', primary: { val: 2522, unit: 'kg', label: 'Waste This Year' }, secondary: { val: 438, unit: 'kg', label: 'Recycle This Year' }, split: [{ zone: 'Zone A', value: 44 }, { zone: 'Zone B', value: 30 }, { zone: 'Zone C', value: 26 }] },
]

// ---------- Main Dashboard ----------
export const MAIN_DASHBOARD = {
  categories: [
    { title: 'Electricity', icon: 'bolt', accent: '#2b7fff', path: '/energy/electricity', items: [{ label: 'Building Consumption', val: 22, unit: 'kWh' }, { label: 'EV Charge', val: 15, unit: 'kWh' }, { label: 'Solar Generation', val: 16, unit: 'kWh' }], footVal: 8, footUnit: 'tCO2', footLabel: 'Total This Year' },
    { title: 'Fuel', icon: 'fuelpump', accent: '#e0a458', path: '/energy/fuel', items: [{ label: 'Natural Gas', val: 15, unit: 'kWh' }, { label: 'Automotive Fuels', val: 15, unit: 'kWh' }], footVal: 6, footUnit: 'tCO2', footLabel: 'Total This Year' },
    { title: 'Thermal', icon: 'thermal', accent: '#3fc8d6', path: '/energy/thermal', items: [{ label: 'Chiller', val: 26, unit: 'kWh' }, { label: 'Cooling Tower', val: 27, unit: 'kWh' }, { label: 'AHU', val: 18, unit: 'kWh' }], footVal: 15, footUnit: 'tCO2', footLabel: 'Total This Year' },
    { title: 'Waste', icon: 'trash', accent: '#8ec63f', path: '/waste', items: [{ label: 'Non-Hazardous', val: 177, unit: 'kg' }, { label: 'Hazardous', val: 180, unit: 'kg' }, { label: 'Scrap Metal', val: 207, unit: 'kg' }], footVal: 150, footUnit: 'kg', footLabel: 'Total Recycle This Year' },
    { title: 'Water', icon: 'water', accent: '#5ac8ff', path: '/water', items: [{ label: 'Main Water', val: 6, unit: 'Liter' }, { label: 'Water Discharge', val: 18, unit: 'Liter' }], footVal: 7, footUnit: 'pH', footLabel: 'Latest pH Level This Year' },
  ],
  co2Breakdown: [
    { name: 'Electricity', value: 2, color: '#d7e9a0' },
    { name: 'Fuel', value: 1, color: '#8ec63f' },
    { name: 'Thermal', value: 4, color: '#5aa832' },
    { name: 'Waste', value: 93, color: '#2f7d1e' },
  ],
}

export const MAP_PINS = [
  { zone: 'Zone A', x: 30, y: 30, color: '#8ec63f' },
  { zone: 'Zone C', x: 66, y: 40, color: '#e0574d' },
  { zone: 'Zone B', x: 44, y: 62, color: '#e0574d' },
]

// ---------- Shared operational data (alerts, zones, devices) ----------
export const ALERTS = [
  { id: 1, severity: 'critical', title: 'Zone C EV charger offline', detail: 'SNS-EV-C3 stopped reporting data', time: '2 min ago' },
  { id: 2, severity: 'warning', title: 'Chiller efficiency below baseline', detail: 'Zone A chiller kW/RT +9% vs target', time: '18 min ago' },
  { id: 3, severity: 'warning', title: 'Hazardous waste threshold approaching', detail: 'Zone C at 92% of monthly limit', time: '46 min ago' },
  { id: 4, severity: 'info', title: 'Discharge water pH nominal', detail: 'Avg pH 7.0 — within compliance', time: '2 hr ago' },
  { id: 5, severity: 'info', title: 'ESG monthly report generated', detail: 'June carbon & compliance report ready', time: '5 hr ago' },
]

export const ZONE_TABLE = [
  { zone: 'Zone A', consumption: 33, cost: 11, co2: 6, efficiency: 92, status: 'Optimal', trend: '+3%' },
  { zone: 'Zone B', consumption: 36, cost: 12, co2: 5, efficiency: 88, status: 'Normal', trend: '+5%' },
  { zone: 'Zone C', consumption: 38, cost: 13, co2: 6, efficiency: 79, status: 'Warning', trend: '+9%' },
]

export const DEVICE_SUMMARY = { online: 58, offline: 2, warning: 4, total: 64 }

export const TOP_CONSUMERS = [
  { name: 'Chiller — Zone A', value: 64, unit: 'kWh', pct: 100 },
  { name: 'Cooling Tower — Zone C', value: 60, unit: 'kWh', pct: 94 },
  { name: 'AHU — Zone B', value: 58, unit: 'kWh', pct: 90 },
  { name: 'EV Charging — Zone A', value: 30, unit: 'kWh', pct: 47 },
  { name: 'Building Loads', value: 28, unit: 'kWh', pct: 44 },
]

export const SUSTAINABILITY = {
  carbonIntensity: 0.42,
  renewableShare: 34,
  target: 50,
  savedTrees: 142,
}
