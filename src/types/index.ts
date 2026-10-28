export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  quantity: number;
  isPurchased: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  address?: string;
  phone?: string;
}

export type RootStackParamList = {
  Home: undefined;
  ProductList: { businessId?: string };
  ProductForm: { productId?: string; businessId?: string };
};