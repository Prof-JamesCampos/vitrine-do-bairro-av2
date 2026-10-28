import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { colors, spacing } from '../theme/colors';
import { storageService } from '../services/storage';
import { Product } from '../types';

interface ProductListScreenProps {
  navigation: any;
  route: any;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation, route }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await storageService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const togglePurchased = async (id: string) => {
    const productsList = await storageService.getProducts();
    const product = productsList.find(p => p.id === id);
    if (product) {
      await storageService.updateProduct(id, { isPurchased: !product.isPurchased });
      loadProducts();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Lista de Compras" />
      
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar um produto
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('ProductForm', { productId: item.id })
                }
                onTogglePurchased={() => togglePurchased(item.id)}
              />
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProductForm', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md },
  loadingText: { textAlign: 'center', marginTop: 50, color: colors.textLight },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
  },
});