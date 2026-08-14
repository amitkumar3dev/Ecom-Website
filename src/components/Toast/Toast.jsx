import './Toast.css';

export default function Toast({ message, type = 'success', isVisible }) {
  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
