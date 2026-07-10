import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Icon from '../components/Icons.jsx'
import { KpiSpark, Donut, Gauge, InsightsPanel } from '../components/Analytics.jsx'
import { AlertsPanel, ZoneTablePanel, TopConsumers, DeviceSummaryPanel } from '../components/Panels.jsx'
import { MAIN_DASHBOARD, ALERTS, ZONE_TABLE, TOP_CONSUMERS, DEVICE_SUMMARY } from '../data/mock.js'
import { KPI_TILES, TREND_BY_PERIOD, SOURCE_MIX, GAUGES, INSIGHTS } from '../data/analytics.js'

const ZONE_HEX = { 'Zone A': '#d7e9a0', 'Zone B': '#8ec63f', 'Zone C': '#2b7fff' }
const tip = { background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }

export default function MainDashboard() {
  const navigate = useNavigate()
  const trend = TREND_BY_PERIOD.Month

  return (
    <>
      <Breadcrumb trail={[{ label: 'Home', to: '/dashboard' }, { label: 'Main Dashboard' }]} />

      {/* --- Category overview (matches reference screenshot) --- */}
      <div className="md-grid">
        {MAIN_DASHBOARD.categories.map((c) => (
          <div className="md-card" key={c.title} onClick={() => c.path && navigate(c.path)} style={{ cursor: c.path ? 'pointer' : 'default' }}>
            <div className="md-head" style={{ borderColor: c.accent }}>
              <h3>{c.title}</h3>
              <span style={{ color: c.accent }}>
                <Icon name={c.icon} size={22} />
              </span>
            </div>
            {c.items.map((it) => (
              <div className="md-item" key={it.label}>
                <span className="md-item-label">{it.label}</span>
                <span className="md-item-val">
                  {it.val}
                  <em>{it.unit}</em>
                </span>
              </div>
            ))}
            <div className="md-foot">
              <span className="md-foot-val">{c.footVal}</span>
              <span className="md-foot-unit">{c.footUnit}</span>
              <div className="md-foot-lbl">{c.footLabel}</div>
            </div>
          </div>
        ))}

        {/* CO2 breakdown */}
        <div className="md-card md-co2">
          <div className="md-head" style={{ borderColor: '#8ec63f' }}>
            <h3>CO₂ Breakdown</h3>
            <span style={{ color: '#8ec63f' }}>
              <Icon name="co2" size={22} />
            </span>
          </div>
          <div className="chart-inset" style={{ marginTop: 10 }}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={MAIN_DASHBOARD.co2Breakdown} margin={{ top: 16, right: 10, bottom: 0, left: -14 }}>
                <XAxis dataKey="name" tick={{ fill: '#9fb0c7', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tip} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                  {MAIN_DASHBOARD.co2Breakdown.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-divider">
        <span>Detailed Analytics</span>
      </div>

      {/* KPI sparklines */}
      <div className="kpi-spark-grid">
        {KPI_TILES.map((t) => {
          const scaled = t.unit === '%' || t.unit === 'kWh/m²' || t.unit === 'kW' ? t.base : t.base
          return <KpiSpark key={t.key} tile={t} value={scaled} />
        })}
      </div>

      {/* trend + source mix */}
      <div className="grid-2-1">
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>PORTFOLIO CONSUMPTION TREND</h3>
            <span className="pill">Stacked · kWh</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
              <defs>
                {Object.entries(ZONE_HEX).map(([z, col]) => (
                  <linearGradient key={z} id={`mz-${z.replace(' ', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={col} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={col} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {Object.keys(ZONE_HEX).map((z) => (
                <Area key={z} type="monotone" dataKey={z} stackId="1" stroke={ZONE_HEX[z]} fill={`url(#mz-${z.replace(' ', '')})`} strokeWidth={1.6} isAnimationActive={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Donut data={SOURCE_MIX} title="ENERGY SOURCE MIX" />
      </div>

      {/* zone table + alerts */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <ZoneTablePanel rows={ZONE_TABLE} />
        <AlertsPanel alerts={ALERTS} />
      </div>

      {/* efficiency gauges */}
      <div className="panel" style={{ marginTop: 22 }}>
        <div className="panel-head">
          <h3 style={{ fontSize: 18 }}>OPERATIONAL EFFICIENCY</h3>
        </div>
        <div className="gauge-row">
          {GAUGES.map((g) => (
            <Gauge key={g.label} {...g} />
          ))}
        </div>
      </div>

      {/* consumers + system status + insights */}
      <div className="dash-triple">
        <TopConsumers rows={TOP_CONSUMERS} />
        <DeviceSummaryPanel summary={DEVICE_SUMMARY} />
        <InsightsPanel items={INSIGHTS.slice(0, 3)} />
      </div>
    </>
  )
}
