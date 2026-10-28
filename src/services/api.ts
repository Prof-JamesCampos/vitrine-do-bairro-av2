import { Business } from '../types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export const apiService = {
  async getBusinesses(): Promise<Business[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      return data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        category: 'Comércio Local',
        address: item.address?.street || 'Endereço não disponível',
        phone: item.phone || 'Telefone não disponível',
      }));
    } catch (error) {
      console.error('Erro ao buscar comerciantes:', error);
      throw new Error('Não foi possível carregar os comerciantes. Verifique sua conexão.');
    }
  },

  async getBusinessById(id: string): Promise<Business | null> {
    const businesses = await apiService.getBusinesses();
    return businesses.find(b => b.id === id) || null;
  },
};