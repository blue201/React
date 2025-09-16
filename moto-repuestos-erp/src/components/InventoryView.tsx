import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductForm from './ProductForm';
import { VAT_RATE } from '../constants';

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
);

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

const EditIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);


interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit  }) => {
    const priceWithVat = product.unitPrice * (1 + VAT_RATE);
    const locationColor = product.location === 'Bodega' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';

    return (
      <div 
          className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
          onClick={() => onEdit(product)}
          role="button"
          aria-label={`Editar ${product.name}`}
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(product)}>
            
          <div className="p-5 relative">
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                  <EditIcon className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 truncate pr-8">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">ID: {product.id}</p>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">Existencia:</span>
                      <span className="font-bold text-blue-600">{product.stock} unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Ubicación:</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${locationColor}`}>{product.location}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-semibold text-gray-600">Precio sin IVA:</span>
                      <span className="text-gray-800">{formatCurrency(product.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">Precio con IVA:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(priceWithVat)}</span>
                  </div>
              </div>
          </div>
      </div>
  );
};


interface InventoryViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, onAddProduct, onUpdateProduct }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);


  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const handleOpenAddForm = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleOpenEditForm = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  };
  
  const handleFormSubmit = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      onUpdateProduct(productData as Product);
    } else {
      onAddProduct(productData);
    }
    handleCloseForm();
  };


  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onEdit={handleOpenEditForm}/>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No se encontraron productos</h3>
            <p className="text-gray-500 mt-2">Intenta con otro término de búsqueda o agrega un nuevo producto.</p>
        </div>
      )}


      {isFormOpen && (
        // <ProductForm
        //   onClose={() => setIsFormOpen(false)}
        //   onAddProduct={onAddProduct}
        // />
        <ProductForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          productToEdit={productToEdit}
        />

      )}
    </div>
  );
};

export default InventoryView;