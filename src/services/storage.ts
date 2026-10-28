import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const PRODUCTS_KEY = '@vitrine:products';
const SHOPPING_LIST_KEY = '@vitrine:shopping_list';

export const storageService = {
  async getProducts(): Promise<Product[]> {
    try {
      const json = await AsyncStorage.getItem(PRODUCTS_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      return [];
    }
  },

  async saveProducts(products: Product[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    }
  },

  async addProduct(product: Product): Promise<void> {
    const products = await storageService.getProducts();
    products.push(product);
    await storageService.saveProducts(products);
  },

  async updateProduct(id: string, updatedProduct: Partial<Product>): Promise<void> {
    const products = await storageService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      await storageService.saveProducts(products);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await storageService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await storageService.saveProducts(filtered);
  },

  async getShoppingList(): Promise<string[]> {
    try {
      const json = await AsyncStorage.getItem(SHOPPING_LIST_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      return [];
    }
  },

  async saveShoppingList(productIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  },
};