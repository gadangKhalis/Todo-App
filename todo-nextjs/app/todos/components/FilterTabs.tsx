import styles from "./FilterTabs.module.css";

interface FilterTabsProps {
  active: string;
  onChange: (filter: string) => void;
}

const FILTERS = [
  { value: "all", label: "ALL" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className={styles.tabs}>
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`${styles.tab} ${active === f.value ? styles.tabActive : ""}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
