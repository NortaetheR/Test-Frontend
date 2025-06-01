import { useEffect, useState } from "react";
import type { Item } from "../types/Item";

const STORAGE_KEY = "items";

const useItemStore = () => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) as Item[] : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<Item, "id">) => {
        const newItem: Item = {
            id: `${Date.now()}-${item.name}`,
            ...item,
        };
        setItems((prev) => [...prev, newItem]);
    };

    const deleteItems = (ids: string[]) => {
        setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateItem = (updatedItem: Item) => {
        setItems((prevItems) => 
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
            )
        );
      };

    return { items, addItem, deleteItems, deleteItem, updateItem };
};

export default useItemStore;