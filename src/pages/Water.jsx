import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Icon from '../components/Icons.jsx'
import ZoneBars from '../components/ZoneBars.jsx'
import { WATER, ZONE_HEX } from '../data/mock.js'

const ACCENT = { blue: '#3aa0ff', rose: '#e0574d' }
const tip = { background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }

export default function Water() {
  return (
    <>
      <Breadcrumb trail={[{ label: 'Home', to: '/dashboard' }, { label: 'Water' }]} />

      {WATER.map((w) => {
        const c = ACCENT[w.accent] || ACCENT.blue
        return (
          <div className="water-row" key={w.key}>
            <div className="panel water-info">
              <div className="water-title">
                <span className="water-icon" style={{ color: c }}>
                  <Icon name={w.icon} size={40} />
                </span>
                <h3>{w.title}</h3>
              </div>
              {w.stats.map((s) => (
                <div className="water-stat" key={s.label}>
                  <div className="ws-val">
                    {s.val} <span>{s.unit}</span>
                  </div>
                  <div className="ws-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3 style={{ fontSize: 18 }}>{w.trendTitle}</h3>
                <span className="pill">m³</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={w.series} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
                  <defs>
                    <linearGradient id={`wg-${w.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="short" tickLine={false} axisLine={{ stroke: 'var(--border)' }} minTickGap={40} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={tip} />
                  <Area type="monotone" dataKey="value" stroke={c} strokeWidth={2} fill={`url(#wg-${w.key})`} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="panel water-split">
              <div className="panel-head">
                <h3 style={{ fontSize: 16 }}>ZONE SPLIT</h3>
              </div>
              <div className="chart-inset">
                <ZoneBars data={w.split} height={160} />
              </div>
              <div className="water-legend">
                {w.split.map((s) => (
                  <span key={s.zone} style={{ color: ZONE_HEX[s.zone] }}>
                    <span className="swatch-sm" style={{ background: ZONE_HEX[s.zone] }} />
                    {s.zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
