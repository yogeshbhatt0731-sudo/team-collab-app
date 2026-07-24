
function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
      <div className="muted" style={{ fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 32, marginTop: 8 }}>{value}</div>
    </div>
  )
}

export default StatCard;