import styles from "./AIButton.module.css";

interface AIButtonProps {
  isPremium: boolean;
  onLocked: () => void;
}

export default function AIButton({ isPremium, onLocked }: AIButtonProps) {
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
