import toast from 'react-hot-toast';
import './Confirm.css';

export const confirmDelete = (message, onConfirm) => {
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
    ),
    {
      duration: Infinity,
      style: {
        background: 'rgba(26, 26, 46, 0.95)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem',
        borderRadius: '12px',
        minWidth: '350px',
        backdropFilter: 'blur(20px)',
      },
      position: 'top-center',
    }
  );
};