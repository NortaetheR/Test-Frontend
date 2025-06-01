import { useState } from "react";
import type { Item } from "../types/Item";
import styles from "./styles/form.module.css";

interface Props {
    addItem: (item: Omit<Item, "id">) => void;
}

function formatThousands(value: string): string {
  const number = value.replace(/\D/g, ""); // Hanya angka
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


export default function ItemForm({ addItem }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<number>();
    const [category, setCategory] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const showErrorMessage = (value: string) => {
      setErrorMessage(value);
      setTimeout(() => {
        setErrorMessage("")
      }, 2000);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatThousands(e.target.value)
      setPrice(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name && price === undefined && stock === undefined && !category) {
            showErrorMessage("Form tidak boleh kosong");
            return;
        }
        if (!name) {
            showErrorMessage("Nama barang tidak boleh kosong");
            return;
        }
        if (price === undefined) {
            showErrorMessage("Harga barang tidak boleh kosong");
            return;
        }
        if (stock === undefined) {
            showErrorMessage("Stok barang harus diisi");
            return;
        }
        if (!category) {
            showErrorMessage("Kategori tidak boleh kosong");
            return;
        }
        const numericPrice = Number(price.replace(/\./g, ""));

        addItem({ name, price: numericPrice, stock, category });
    
        setName("");
        setStock(undefined);
        setPrice("");
        setCategory("");
        setErrorMessage("");

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      };

    return (
      <div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.labelGroup}>
            <label htmlFor="name">Nama Barang</label>
            <input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
    
          <div className={styles.labelGroup}>
            <label htmlFor="price">Harga</label>
            <div className={styles.inputWithPrefix}>
              <span className={styles.prefix}>Rp</span>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
          </div>
    
          <div className={styles.labelGroup}>
            <label htmlFor="stock">Stok</label>
            <input
              id="stock"
              type="number"
              value={stock ?? ""}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>
    
          <div className={styles.labelGroup}>
            <label htmlFor="category">Kategori</label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
    
          <button type="submit">Tambah Barang</button>
        </form>
        
        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        {showSuccess && (
            <div className={styles.successMessage}>
            Barang berhasil ditambahkan!
            </div>
        )}
      </div>
      );
    }