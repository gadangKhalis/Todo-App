import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (filter: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
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
