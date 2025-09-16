import React, { useMemo } from 'react';
import { Invoice } from '../types';

interface DailySalesReportProps {
  invoices: Invoice[];
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
};

const DailySalesReport: React.FC<DailySalesReportProps> = ({ invoices, onClose }) => {

  const completedInvoices = useMemo(() => invoices.filter(inv => inv.status === 'Completed'), [invoices]);

  const reportTotals = useMemo(() => {
    return completedInvoices.reduce((acc, inv) => {
        acc.subtotal += inv.totals.subtotal;
        acc.tax += inv.totals.tax;
        acc.total += inv.totals.total;
        return acc;
    }, { subtotal: 0, tax: 0, total: 0 });
  }, [completedInvoices]);

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 overflow-y-auto">
      <div className="bg-gray-200 p-4 sm:p-8 w-full max-w-4xl print:p-0">
          <div className="bg-white shadow-lg p-6 sm:p-10" id="printable-area">
              <header className="text-center pb-6 border-b-2 border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-800">Reporte de Ventas Diario</h1>
                  <p className="text-sm text-gray-500 mt-1">Fecha de generación: {new Date().toLocaleString('es-CO')}</p>
              </header>

              <section className="my-8">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumen de Ventas</h2>
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-gray-100 text-sm font-semibold text-gray-600 uppercase">
                              <th className="p-3">ID Factura</th>
                              <th className="p-3">Cliente</th>
                              <th className="p-3 text-right">Subtotal</th>
                              <th className="p-3 text-right">IVA</th>
                              <th className="p-3 text-right">Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {completedInvoices.map(inv => (
                              <tr key={inv.id} className="border-b border-gray-100">
                                  <td className="p-3 font-mono text-xs text-gray-600">{inv.id}</td>
                                  <td className="p-3 font-medium text-gray-800">{inv.customerName}</td>
                                  <td className="p-3 text-right text-gray-600">{formatCurrency(inv.totals.subtotal)}</td>
                                  <td className="p-3 text-right text-gray-600">{formatCurrency(inv.totals.tax)}</td>
                                  <td className="p-3 text-right font-semibold text-gray-800">{formatCurrency(inv.totals.total)}</td>
                              </tr>
                          ))}
                           {completedInvoices.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-500">No hay ventas completadas para mostrar.</td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </section>

              {completedInvoices.length > 0 && (
                <section className="mt-8 flex justify-end">
                    <div className="w-full sm:w-1/2 lg:w-2/5 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Totales del Día</h3>
                        <div className="flex justify-between text-md">
                            <span className="font-semibold text-gray-600">Subtotal General:</span>
                            <span className="text-gray-800">{formatCurrency(reportTotals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-md">
                            <span className="font-semibold text-gray-600">IVA General:</span>
                            <span className="text-gray-800">{formatCurrency(reportTotals.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2 mt-2">
                            <span className="text-gray-900">Total Ventas:</span>
                            <span className="text-blue-600">{formatCurrency(reportTotals.total)}</span>
                        </div>
                    </div>
                </section>
              )}
          </div>
          <div className="mt-6 flex justify-end gap-4 print:hidden">
              <button onClick={onClose} className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors">Cerrar</button>
              <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">Imprimir Reporte</button>
          </div>
      </div>
    </div>
  );
};

export default DailySalesReport;
