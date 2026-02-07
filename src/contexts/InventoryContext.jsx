import React, { createContext, useContext, useState, useEffect } from 'react';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([
    { id: 'I001', name: 'Zirconia Block (A2)', category: 'CAD/CAM', stock: 12, minStock: 5, unit: 'block', batch: 'ZB-2025001' },
    { id: 'I002', name: 'Zirconia Block (A3)', category: 'CAD/CAM', stock: 3, minStock: 5, unit: 'block', batch: 'ZB-2025002' },
    { id: 'I003', name: 'Implant Post (Straumann)', category: 'Implant', stock: 8, minStock: 2, unit: 'piece', batch: 'IMP-ST-992' },
    { id: 'I004', name: 'Lidocaine', category: 'Anesthetics', stock: 45, minStock: 20, unit: 'ampule', batch: 'LIDO-009' },
    { id: 'I005', name: 'Nitrile Gloves (M)', category: 'Consumables', stock: 1500, minStock: 500, unit: 'pair', batch: 'GLV-M-88' },
  ]);

  const [alerts, setAlerts] = useState([]);

  // Check for low stock on mount and update
  useEffect(() => {
    const lowStockItems = items.filter(i => i.stock <= i.minStock);
    if (lowStockItems.length > 0) {
       setAlerts(lowStockItems.map(i => ({ type: 'low_stock', itemId: i.id, message: `${i.name} is low on stock (${i.stock}).` })));
    } else {
       setAlerts([]);
    }
  }, [items]);

  const useItem = (id, amount = 1) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
          const newStock = Math.max(0, item.stock - amount);
          return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  const restockItem = (id, amount) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock: item.stock + amount } : item));
  };

  const addItem = (item) => {
     setItems(prev => [...prev, { ...item, id: `I${Date.now()}` }]);
  };

  return (
    <InventoryContext.Provider value={{ items, alerts, useItem, restockItem, addItem }}>
      {children}
    </InventoryContext.Provider>
  );
};
