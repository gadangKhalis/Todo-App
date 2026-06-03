import styles from "./AIButton.module.css";

export default function AIButton({ isPremium, onLocked }) {
  if (isPremium) {
    return (
      <button
        className={styles.btn}
        onClick={() => alert("AI feature coming soon!")}
      >
        ✨ AI Suggest
      </button>
    );
  }
  return (
    <button className={`${styles.btn} ${styles.btnLocked}`} onClick={onLocked}>
      🔒 AI Suggest
    </button>
  );
}
