import ItemTable from "../components/ItemTable";
import useItemStore from "../data/useItemStore"
import styles from "../components/styles/table.module.css";

export default function TablePage() {
  const { items, deleteItems, deleteItem, updateItem } = useItemStore();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBox}>
        <h2 className={styles.pageTitle}>📦 Daftar Barang</h2>
      </div>
      <ItemTable items={items} deleteItems={deleteItems} deleteItem={deleteItem} updateItem={updateItem}/>
    </div>
  );
}