import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onTogglePurchased?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onTogglePurchased,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, product.isPurchased && styles.cardPurchased]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, product.isPurchased && styles.textPurchased]}>
            {product.name}
          </Text>
          {onTogglePurchased && (
            <TouchableOpacity onPress={onTogglePurchased} style={styles.checkbox}>
              <Text style={styles.checkboxIcon}>
                {product.isPurchased ? '✅' : '⬜'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </Text>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardPurchased: {
    opacity: 0.6,
    backgroundColor: '#E8F5E9',
  },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  textPurchased: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  checkbox: {
    padding: spacing.sm,
  },
  checkboxIcon: {
    fontSize: 20,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});