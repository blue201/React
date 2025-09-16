import React from 'react';
import { CartItem, DocumentTotals, Invoice } from '../types';

interface PrintableDocumentProps {
  type: 'Cotización' | 'Factura';
  items: CartItem[];
  totals: DocumentTotals;
  customerName: string;
  onClose: () => void;
  status?: Invoice['status'];
  isFinalizing?: boolean;
  documentDate?: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
};

const MotorcycleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);


const PrintableDocument: React.FC<PrintableDocumentProps> = ({ type, items, totals, customerName, onClose, status, isFinalizing, documentDate }) => {

  const handlePrint = () => {
    window.print();
    onClose();
  };

  const isVoided = status === 'Voided';
  const displayDate = documentDate ? new Date(documentDate).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 overflow-y-auto">
      <div className="bg-gray-200 p-4 sm:p-8 w-full max-w-4xl print:p-0">
          <div className="bg-white shadow-lg p-6 sm:p-10 relative" id="printable-area">
              {isVoided && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <p className="text-red-200 text-8xl md:text-9xl font-bold transform -rotate-45 select-none" style={{ opacity: 0.5 }}>
                        ANULADO
                    </p>
                </div>
              )}
              <div className="relative z-10">
                <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                    <div>
                        <div className="flex items-center gap-3">
                            <MotorcycleIcon className="w-10 h-10 text-blue-600"/>
                            <h1 className="text-3xl font-bold text-gray-800">Motorepuestos STARCV</h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Calle Falsa 123, Bogotá, Colombia</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase text-blue-600">{type}</h2>
                        <p className="text-sm text-gray-600">Fecha: {displayDate}</p>
                    </div>
                </header>

                <section className="my-8">
                    <h3 className="text-md font-semibold text-gray-500 uppercase mb-2">Cliente</h3>
                    <p className="text-lg font-bold text-gray-800">{customerName || 'Cliente General'}</p>
                </section>

                <section>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 text-sm font-semibold text-gray-600 uppercase">
                                <th className="p-3">Descripción</th>
                                <th className="p-3 text-center">Cantidad</th>
                                <th className="p-3 text-right">Precio Unitario</th>
                                <th className="p-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                                    <td className="p-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                    <td className="p-3 text-right font-semibold text-gray-800">{formatCurrency(item.unitPrice * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mt-8 flex justify-end">
                    <div className="w-full sm:w-1/2 lg:w-1/3 space-y-2">
                        <div className="flex justify-between text-md">
                            <span className="font-semibold text-gray-600">Subtotal:</span>
                            <span className="text-gray-800">{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-md">
                            <span className="font-semibold text-gray-600">IVA (19%):</span>
                            <span className="text-gray-800">{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2 mt-2">
                            <span className="text-gray-900">Total a Pagar:</span>
                            <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                </section>
                <footer className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
                    <p>Gracias por su compra. Este documento fue generado por el sistema de Motorepuestos STARCV.</p>
                </footer>
              </div>
          </div>
          <div className="mt-6 flex justify-end gap-4 print:hidden">
              <button onClick={onClose} className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors">Cerrar</button>
              <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
                {isFinalizing ? 'Imprimir y Finalizar' : 'Imprimir'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default PrintableDocument;
