import React, { useState, useEffect } from 'react';
import { Product, ProductLocation } from '../types';

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'> | Product) => void;
  productToEdit?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSubmit, productToEdit }) => {
  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [location, setLocation] = useState<ProductLocation>(ProductLocation.Bodega);
  const [unitPrice, setUnitPrice] = useState(0);
  const [error, setError] = useState('');

  const isEditing = !!productToEdit;

  useEffect(() => {
    if (isEditing) {
      setName(productToEdit.name);
      setStock(productToEdit.stock);
      setLocation(productToEdit.location);
      setUnitPrice(productToEdit.unitPrice);
    }
  }, [productToEdit, isEditing]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || stock < 0 || unitPrice < 0) {
      setError('El nombre es obligatorio y los valores numéricos no pueden ser negativos.');
      return;
    }
    
    const productData = { name, stock, location, unitPrice };
    
    if (isEditing) {
      onSubmit({ ...productData, id: productToEdit.id });
    } else {
      onSubmit(productData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Existencia (Cantidad)</label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Precio Unitario (sin IVA)</label>
              <input
                id="unitPrice"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value as ProductLocation)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={ProductLocation.Bodega}>Bodega</option>
              <option value={ProductLocation.Exhibidor}>Exhibidor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;