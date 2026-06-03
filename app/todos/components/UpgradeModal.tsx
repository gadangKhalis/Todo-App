import styles from "./UpgradeModal.module.css";

export default function UpgradeModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <h2>⭐ Upgrade to Premium</h2>
        <p>Get unlimited AI suggestions and more!</p>
        <div className={styles.actions}>
          <button className={styles.btnUpgrade}>Upgrade Now</button>
          <button className={styles.btnCancel} onClick={onClose}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
