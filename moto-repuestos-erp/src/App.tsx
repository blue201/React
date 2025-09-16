import React, { useState } from 'react';
import { Product, ProductLocation, Invoice, CartItem, DocumentTotals } from './types';
import Header from './components/Header';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';

const initialProducts: Product[] = [
  { id: 'prod-001', name: 'Aceite Motul 5100 10W40', stock: 15, location: ProductLocation.Exhibidor, unitPrice: 35000 },
  { id: 'prod-002', name: 'Filtro de Aire K&N', stock: 8, location: ProductLocation.Exhibidor, unitPrice: 120000 },
  { id: 'prod-003', name: 'Pastillas de Freno EBC', stock: 25, location: ProductLocation.Bodega, unitPrice: 85000 },
  { id: 'prod-004', name: 'Bujía NGK Iridium', stock: 50, location: ProductLocation.Bodega, unitPrice: 45000 },
  { id: 'prod-005', name: 'Llanta Michelin Pilot Street 140/70-17', stock: 12, location: ProductLocation.Exhibidor, unitPrice: 320000 },
  { id: 'prod-006', name: 'Kit de Arrastre DID', stock: 10, location: ProductLocation.Bodega, unitPrice: 250000 },
];

type View = 'inventory' | 'sales';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [salesHistory, setSalesHistory] = useState<Invoice[]>([]);
  const [currentView, setCurrentView] = useState<View>('sales');

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const recordSale = (saleData: { customerName: string; items: CartItem[]; totals: DocumentTotals }) => {
    const newInvoice: Invoice = {
        id: `fact-${Date.now()}`,
        date: new Date().toISOString(),
        customerName: saleData.customerName,
        items: saleData.items,
        totals: saleData.totals,
        status: 'Completed',
    };
    setSalesHistory(prev => [newInvoice, ...prev]);

    setProducts(prevProducts =>
        prevProducts.map(p => {
            const itemInCart = saleData.items.find(item => item.id === p.id);
            if (itemInCart) {
                return { ...p, stock: p.stock - itemInCart.quantity };
            }
            return p;
        })
    );
  };

  const voidInvoice = (invoiceId: string) => {
    const invoiceToVoid = salesHistory.find(inv => inv.id === invoiceId);
    if (!invoiceToVoid || invoiceToVoid.status === 'Voided') return;

    // Return stock to inventory
    setProducts(currentProducts => {
        const updatedProducts = [...currentProducts];
        invoiceToVoid.items.forEach(itemToReadd => {
            const productIndex = updatedProducts.findIndex(p => p.id === itemToReadd.id);
            if (productIndex !== -1) {
                updatedProducts[productIndex].stock += itemToReadd.quantity;
            }
        });
        return updatedProducts;
    });

    // Update invoice status
    setSalesHistory(prevHistory =>
      prevHistory.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'Voided' } : inv
      )
    );
  };


  return (
    <div className="min-h-screen font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 md:p-8">
        {currentView === 'inventory' && <InventoryView products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} />}
        {currentView === 'sales' && <SalesView products={products} salesHistory={salesHistory} onRecordSale={recordSale} onVoidInvoice={voidInvoice} />}
      </main>
    </div>
  );
};

export default App;