import ItemForm from "../components/ItemForm";
import type { Item } from "../types/Item";
import styles from "../components/styles/table.module.css";

interface Props {
  addItem: (item: Omit<Item, "id">) => void;
}

export default function FormPage({ addItem }: Props) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBox}>
        <h2 className={styles.pageTitle}>📝 Input Barang</h2>
      </div>
      <div className={styles.formBox}>
        <ItemForm addItem={addItem} />
      </div>
    </div>
  );
};