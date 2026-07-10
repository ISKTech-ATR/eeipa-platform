import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Icon from '../components/Icons.jsx'
import { ENERGY_CATEGORIES } from '../data/mock.js'

const SHADES = ['#d7e9a0', '#8ec63f', '#5aa832', '#2b7fff']

function MiniSplit({ data }) {
  return (
    <div className="chart-inset" style={{ width: 130 }}>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ top: 18, right: 10, bottom: 0, left: 10 }} barCategoryGap="24%">
          <XAxis dataKey="zone" hide />
          <YAxis hide domain={[0, 'dataMax + 10']} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={d.zone} fill={SHADES[i % SHADES.length]} />
            ))}
            <LabelList
              dataKey="value"
              content={({ x, width, value, index }) => (
                <g>
                  <rect x={x + width / 2 - 15} y={124} width={30} height={20} rx={3} fill={SHADES[index % SHADES.length]} />
                  <text x={x + width / 2} y={138} textAnchor="middle" fill="#0b0f18" fontWeight="800" fontSize={12}>
                    {value}
                  </text>
                </g>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function EnergyLanding() {
  const navigate = useNavigate()
  return (
    <>
      <Breadcrumb trail={[{ label: 'Home', to: '/dashboard' }, { label: 'Energy' }]} />

      <div className="energy-cards">
        {ENERGY_CATEGORIES.map((c) => (
          <div className="energy-card" key={c.key} onClick={() => navigate(c.path)}>
            <div className="energy-icon">
              <Icon name={c.icon} size={60} />
            </div>
            <div className="energy-mid">
              <h2>{c.title}</h2>
              <div className="energy-stat">
                <span className="val">{c.primary.val}</span>
                <span className="unit">{c.primary.unit}</span>
                <div className="lbl">{c.primary.label}</div>
              </div>
              <div className="energy-stat">
                <span className="val">{c.co2}</span>
                <span className="unit">tCO2</span>
                <div className="lbl">Generated This Year</div>
              </div>
            </div>
            <div className="energy-legend">
              <div className="legend-title">Legend</div>
              {c.split.map((s, i) => (
                <div className="legend-row" key={s.zone}>
                  <span className="swatch" style={{ background: SHADES[i % SHADES.length] }} />
                  {s.zone}
                </div>
              ))}
            </div>
            <MiniSplit data={c.split} />
          </div>
        ))}
      </div>
    </>
  )
}
