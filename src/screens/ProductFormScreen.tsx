import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { colors, spacing, borderRadius } from '../theme/colors';
import { storageService } from '../services/storage';
import { Product } from '../types';

interface ProductFormScreenProps {
  navigation: any;
  route: any;
}

export const ProductFormScreen: React.FC<ProductFormScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params || {};
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    const products = await storageService.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setCategory(product.category);
      setDescription(product.description || '');
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Preço inválido';
    }

    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Erro', 'Corrija os campos destacados');
      return;
    }

    setLoading(true);

    try {
      const productData: Product = {
        id: productId || Date.now().toString(),
        name: name.trim(),
        price: parseFloat(price),
        category: category.trim(),
        description: description.trim(),
        quantity: 1,
        isPurchased: false,
      };

      if (productId) {
        await storageService.updateProduct(productId, productData);
      } else {
        await storageService.addProduct(productData);
      }

      Alert.alert(
        'Sucesso',
        `Produto ${productId ? 'atualizado' : 'cadastrado'} com sucesso!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={productId ? 'Editar Produto' : 'Novo Produto'} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : undefined]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Pão Francês"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Preço (R$) *</Text>
          <TextInput
            style={[styles.input, errors.price ? styles.inputError : undefined]}
            value={price}
            onChangeText={setPrice}
            placeholder="Ex: 0.75"
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

          <Text style={styles.label}>Categoria *</Text>
          <TextInput
            style={[styles.input, errors.category ? styles.inputError : undefined]}
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Padaria, Hortifruti, etc."
          />
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição opcional do produto"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : productId ? 'Atualizar' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  form: { paddingBottom: spacing.xl },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
