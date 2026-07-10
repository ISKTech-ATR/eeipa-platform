import Breadcrumb from '../components/Breadcrumb.jsx'
import Icon from '../components/Icons.jsx'
import ZoneBars from '../components/ZoneBars.jsx'
import { WASTE, ZONE_HEX } from '../data/mock.js'

export default function Waste() {
  return (
    <>
      <Breadcrumb trail={[{ label: 'Home', to: '/dashboard' }, { label: 'Waste' }]} />

      <div className="waste-cards">
        {WASTE.map((w) => (
          <div className="waste-card" key={w.key}>
            <div className="waste-head">
              <span className="waste-icon">
                <Icon name={w.icon} size={54} />
              </span>
              <h2>{w.title}</h2>
            </div>
            <div className="waste-stats">
              <div className="waste-stat">
                <span className="val">{w.primary.val.toLocaleString()}</span>
                <span className="unit">{w.primary.unit}</span>
                <div className="lbl">{w.primary.label}</div>
              </div>
              {w.secondary && (
                <div className="waste-stat">
                  <span className="val">{w.secondary.val.toLocaleString()}</span>
                  <span className="unit">{w.secondary.unit}</span>
                  <div className="lbl">{w.secondary.label}</div>
                </div>
              )}
            </div>
            <div className="waste-legend">
              <div className="legend-title">Legend</div>
              {w.split.map((s) => (
                <div className="legend-row" key={s.zone}>
                  <span className="swatch" style={{ background: ZONE_HEX[s.zone] }} />
                  {s.zone}
                </div>
              ))}
            </div>
            <div className="chart-inset" style={{ width: 150 }}>
              <ZoneBars data={w.split} height={150} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
