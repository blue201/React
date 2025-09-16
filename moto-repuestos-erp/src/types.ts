export enum ProductLocation {
    Bodega = 'Bodega',
    Exhibidor = 'Exhibidor',
  }
  
  export interface Product {
    id: string;
    name: string;
    stock: number;
    location: ProductLocation;
    unitPrice: number;
  }
  
  export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }
  
  export interface DocumentTotals {
      subtotal: number;
      tax: number;
      total: number;
  }
  
  export interface Invoice {
    id: string;
    date: string;
    customerName: string;
    items: CartItem[];
    totals: DocumentTotals;
    status: 'Completed' | 'Voided';
  }
  