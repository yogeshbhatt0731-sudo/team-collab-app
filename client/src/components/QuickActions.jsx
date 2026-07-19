import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

const actions = [
  { title: 'Create New Workspace', symbol: '+', button: 'Create Workspace' },
  { title: 'Join Existing Workspace', symbol: 'Link', button: 'Join Workspace' },
]

function QuickActions() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
      }}
    >
      {actions.map((action) => (
        <div
          key={action.title}
          className="card"
          style={{
            minHeight: 174,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              color: 'var(--blue)',
              background: 'var(--blue-light)',
              fontWeight: 800,
              fontSize: action.symbol === '+' ? 26 : 13,
            }}
          >
            {action.symbol}
          </div>
          <h6 style={{ fontSize: 18 }}>{action.title}</h6>
          <ButtonComponent cssClass="e-primary">{action.button}</ButtonComponent>
        </div>
      ))}
    </div>
  )
}

export default QuickActions
