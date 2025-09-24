import React, { useState, useMemo, useCallback } from 'react';
import { Product, CartItem, DocumentTotals, Invoice } from '../types';
import { VAT_RATE } from '../constants';
import PrintableDocument from './PrintableDocument';
import DailySalesReport from './DailySalesReport';


type DocumentType = 'Cotización' | 'Factura';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
};

// --- Helper Components ---

const ProductSelectorItem: React.FC<{ product: Product; onAdd: (product: Product) => void; }> = ({ product, onAdd }) => (
    <div 
        className="flex justify-between items-center p-3 bg-white hover:bg-sky-50 rounded-lg cursor-pointer transition-colors duration-200"
        onClick={() => onAdd(product)}
    >
        <div>
            <p className="font-semibold text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock} | {formatCurrency(product.unitPrice)}</p>
        </div>
        <button className="text-blue-500 hover:text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
    </div>
);


const CartDisplayItem: React.FC<{ item: CartItem; onUpdateQuantity: (id: string, q: number) => void; onRemove: (id: string) => void; maxStock: number; }> = ({ item, onUpdateQuantity, onRemove, maxStock }) => (
    <div className="flex justify-between items-center py-3 border-b">
        <div>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} c/u</p>
        </div>
        <div className="flex items-center gap-3">
            <input 
                type="number" 
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, Math.max(1, Math.min(maxStock, parseInt(e.target.value, 10) || 1)))}
                className="w-16 p-1 border rounded-md text-center"
                min="1"
                max={maxStock}
            />
            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
            </button>
        </div>
    </div>
);


const InvoiceHistory: React.FC<{invoices: Invoice[], onReprint: (invoice: Invoice) => void, onVoid: (id: string) => void}> = ({invoices, onReprint, onVoid}) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Historial de Facturas</h2>
        {invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay ventas registradas.</p>
        ) : (
            <div className="space-y-3 h-[30vh] overflow-y-auto pr-2">
                {invoices.map(inv => (
                    <div key={inv.id} className={`p-3 rounded-lg ${inv.status === 'Voided' ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{inv.customerName}</p>
                                <p className="text-sm text-gray-500">{inv.id} - {new Date(inv.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${inv.status === 'Voided' ? 'text-red-500' : 'text-green-600'}`}>{formatCurrency(inv.totals.total)}</p>
                                {inv.status === 'Voided' && <p className="text-xs font-bold text-red-500">ANULADA</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                             <button onClick={() => onReprint(inv)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-full">Reimprimir</button>
                            {inv.status === 'Completed' && (
                                <button onClick={() => {if(window.confirm('¿Estás seguro de que deseas anular esta factura? Esta acción no se puede deshacer.')) onVoid(inv.id)}} className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-full">Anular</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);


// --- Main SalesView Component ---
interface SalesViewProps {
  products: Product[];
  salesHistory: Invoice[];
  onRecordSale: (saleData: { customerName: string; items: CartItem[]; totals: DocumentTotals }) => void;
  onVoidInvoice: (invoiceId: string) => void;
}

const SalesView: React.FC<SalesViewProps> = ({ products, salesHistory, onRecordSale, onVoidInvoice }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [documentToPrint, setDocumentToPrint] = useState<{type: DocumentType, items: CartItem[], totals: DocumentTotals, customer: string, isReprint: boolean, status?: Invoice['status']} | null>(null);
    const [showDailyReport, setShowDailyReport] = useState(false);

    const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                const newQuantity = Math.min(product.stock, existingItem.quantity + 1);
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevCart, { id: product.id, name: product.name, unitPrice: product.unitPrice, quantity: 1 }];
        });
    }, []);

    const updateCartQuantity = useCallback((productId: string, newQuantity: number) => {
        setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);

    const totals = useMemo<DocumentTotals>(() => {
        const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
        const tax = subtotal * VAT_RATE;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [cart]);

    const handleGenerateDocument = (type: DocumentType) => {
        if(type === 'Factura' && !customerName.trim()){
            alert('Por favor, ingrese el nombre del cliente para generar una factura.');
            return;
        }
        setDocumentToPrint({ type, items: cart, totals, customer: customerName, isReprint: false, status: 'Completed' });
    };

    const handleReprintInvoice = (invoice: Invoice) => {
        setDocumentToPrint({ type: 'Factura', items: invoice.items, totals: invoice.totals, customer: invoice.customerName, isReprint: true, status: invoice.status });
    };

    const handleClosePrintView = () => {
        if (documentToPrint?.type === 'Factura' && !documentToPrint.isReprint) {
            onRecordSale({
                customerName: documentToPrint.customer,
                items: documentToPrint.items,
                totals: documentToPrint.totals,
            });
            setCart([]);
            setCustomerName('');
        }
        setDocumentToPrint(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Seleccionar Productos</h2>
                <div className="space-y-2 h-[80vh] overflow-y-auto pr-2">
                    {products.filter(p => p.stock > 0).map(product => (
                       <ProductSelectorItem key={product.id} product={product} onAdd={addToCart} />
                    ))}
                </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Detalle de Venta</h2>
                     {cart.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aún no has agregado productos.</p>
                            <p className="text-sm">Haz clic en un producto de la lista para comenzar.</p>
                        </div>
                     ) : (
                        <>
                        <div className="max-h-[25vh] overflow-y-auto pr-2">
                            {cart.map(item => (
                                 <CartDisplayItem 
                                    key={item.id} 
                                    item={item}
                                    onUpdateQuantity={updateCartQuantity}
                                    onRemove={removeFromCart}
                                    maxStock={productMap.get(item.id)?.stock || 0}
                                />
                            ))}
                        </div>
                         <div className="mt-4 border-t pt-4 space-y-3">
                            <div className="flex justify-between text-lg"><span className="text-gray-600">Subtotal:</span> <span className="font-semibold">{formatCurrency(totals.subtotal)}</span></div>
                            <div className="flex justify-between text-lg"><span className="text-gray-600">IVA (19%):</span> <span className="font-semibold">{formatCurrency(totals.tax)}</span></div>
                            <div className="flex justify-between text-2xl font-bold text-blue-600"><span >Total:</span> <span>{formatCurrency(totals.total)}</span></div>
                        </div>
                        <div className="mt-4 border-t pt-4 space-y-4">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nombre del Cliente (para factura)</label>
                                <input
                                    type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={() => handleGenerateDocument('Cotización')} disabled={cart.length === 0} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300">Generar Cotización</button>
                                <button onClick={() => handleGenerateDocument('Factura')} disabled={cart.length === 0} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">Generar Factura</button>
                            </div>
                        </div>
                        </>
                     )}
                </div>
                <InvoiceHistory invoices={salesHistory} onReprint={handleReprintInvoice} onVoid={onVoidInvoice} />
                 <div className="bg-white p-4 rounded-xl shadow-lg">
                    <button onClick={() => setShowDailyReport(true)} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                        Imprimir Reporte de Venta Diaria
                    </button>
                </div>
            </div>

            {documentToPrint && (
                <PrintableDocument 
                    type={documentToPrint.type}
                    items={documentToPrint.items}
                    totals={documentToPrint.totals}
                    customerName={documentToPrint.customer}
                    status={documentToPrint.status}
                    isFinalizing={documentToPrint.type === 'Factura' && !documentToPrint.isReprint}
                    onClose={handleClosePrintView}
                />
            )}
            {showDailyReport && (
                <DailySalesReport invoices={salesHistory} onClose={() => setShowDailyReport(false)} />
            )}
        </div>
    );
};

export default SalesView;
