import toast from 'react-hot-toast';
import './Confirm.css';

const Confirm = (message, onConfirm) => {
  const toastId = toast(
    (t) => (
      <div className="confirm-toast">
        <div className="confirm-message">{message}</div>
        <div className="confirm-buttons">
          <button
            className="confirm-btn confirm-btn-cancel"
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            Annuler
          </button>
          <button
            className="confirm-btn confirm-btn-confirm"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    )
  )
  return (
    <div>Confirm</div>
  )
}

export default Confirm