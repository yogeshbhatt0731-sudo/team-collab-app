import { DialogComponent } from '@syncfusion/ej2-react-popups'

/**
 * Thin wrapper over Syncfusion DialogComponent so every simple form modal in the
 * app shares one API: { open, onClose, title, children, footer, width }.
 * The task-slice task-detail dialog can use DialogComponent directly with more config.
 */
function Modal({ open, onClose, title, children, footer, width = 560 }) {
  if (!open) return null
  return (
    <DialogComponent
      width={`${width}px`}
      visible={open}
      header={title}
      isModal={true}
      showCloseIcon={true}
      close={onClose}
      target={document.body}
      footerTemplate={footer ? () => <div className="tc-dialog-footer">{footer}</div> : undefined}
    >
      {children}
    </DialogComponent>
  )
}

export default Modal
