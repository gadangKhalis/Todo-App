import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        placeholder="Search todo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}
