import { useState } from "react";
import type { Item } from "../types/Item";
import styles from "./styles/table.module.css";

interface Props {
  items: Item[];
  deleteItems: (ids: string[]) => void;
  deleteItem: (id: string) => void;
  updateItem: (item: Item) => void;
}

export default function ItemTable({ items, deleteItems, deleteItem, updateItem }: Props) {
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Item | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Item>>({});

  const handleSort = (key: keyof Item) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedItems.slice(startIdx, startIdx + itemsPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIDs((prev) =>
      prev.includes(id) ? prev.filter((itemID) => itemID !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIDs(currentItems.map((item) => item.id));
    } else {
      setSelectedIDs([]);
    }
  };

  const handleDeleteSelected = () => {
    if (confirm("Apakah kamu yakin ingin menghapus item yang dipilih?")) {
      deleteItems(selectedIDs);
      setSelectedIDs([]);
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_barang.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEdit = (item: Item) => {
    setEditingItemId(item.id);
    setEditedItem({ ...item });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditedItem({});
  };

  const saveEdit = () => {
    if (
      editingItemId && 
      editedItem.name && 
      editedItem.price !== undefined && 
      editedItem.stock !== undefined && 
      editedItem.category
    ) {
      const updated = { 
        ...editedItem, 
        id: editingItemId 
      } as Item;

      updateItem(updated);
      cancelEdit();
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableActions}>
        <input type="text" placeholder="Search..." value={searchQuery} 
        onChange={(e) => {
          setSearchQuery(e.target.value); 
          setCurrentPage(1);
        }}
        />
        <label> Item per halaman:
          <select value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <button onClick={handleDownload}> Download </button>

        {selectedIDs.length > 0 && (
          <button onClick={handleDeleteSelected} className={styles.deleteButton}> Hapus Terpilih ({selectedIDs.length}) </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th className={styles.colCheckBox}>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedIDs.length === currentItems.length && currentItems.length > 0} />
            </th>
            <th className={styles.colName} onClick={() => handleSort("name")}> Nama Barang {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th className={styles.colPrice} onClick={() => handleSort("price")}> Harga (IDR){sortKey === "price" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th className={styles.colStock} onClick={() => handleSort("stock")}> Stok {sortKey === "stock" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th className={styles.colCategory} onClick={() => handleSort("category")}> Kategori {sortKey === "category" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}> Data tidak tersedia </td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.id} className={styles.row}>
                {editingItemId === item.id ? (
                  <>
                    <td className={styles.colCheckBox}><input type="checkbox" checked={selectedIDs.includes(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                    <td className={styles.colName}><input value={editedItem.name || ""} onChange={(e) => setEditedItem((prev) => ({ ...prev, name: e.target.value }))} /></td>
                    <td className={styles.colPrice}><input type="number" value={editedItem.price || 0} onChange={(e) => setEditedItem((prev) => ({ ...prev, price: +e.target.value }))} /></td>
                    <td className={styles.colStock}><input type="number" value={editedItem.stock || 0} onChange={(e) => setEditedItem((prev) => ({ ...prev, stock: +e.target.value }))} /></td>
                    <td className={styles.colCategory}><input value={editedItem.category || ""} onChange={(e) => setEditedItem((prev) => ({ ...prev, category: e.target.value }))} />
                      <div className={styles.rowActions}>
                        <button onClick={saveEdit} className={styles.rowActionBtn}>💾</button>
                        <button onClick={cancelEdit} className={styles.rowActionBtn}>❌</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={styles.colCheckBox}><input type="checkbox" checked={selectedIDs.includes(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                    <td className={styles.colName}>{item.name}</td>
                    <td className={styles.colPrice}>{item.price.toLocaleString("id-ID")}</td>
                    <td className={styles.colStock}>{item.stock}</td>
                    <td className={styles.colCategory}>{item.category}
                      <div className={styles.rowActions}>
                        <button onClick={() => confirm("Yakin hapus item ini?") && deleteItem(item.id)} className={styles.rowActionBtn}>🗑️</button>
                        <button onClick={() => startEdit(item)} className={styles.rowActionBtn}>✏️</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ⬅ Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
