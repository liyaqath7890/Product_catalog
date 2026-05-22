import React, { createContext, useContext, useState } from 'react';
import { generateProductBarcode, generateProductSku } from '../features/product/utils/productCodeUtils';
import { useToast } from '../components/feedback/ToastProvider';

const ProductContext = createContext();

const createVariant = (id, size, color, price, onHand) => ({
  id,
  size,
  color,
  price,
  available: onHand > 0,
  onHand,
});

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Urban Motion Runner',
    sku: 'SHO-UMR-001',
    barcode: '890120240001',
    category: 'Shoes',
    brand: 'Nike',
    price: 6499,
    stock: 82,
    status: 'Live',
    rating: 4.8,
    featured: true,
    date: '12 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Lightweight street-to-gym runner with breathable knit upper, cloud-soft sole, and all-day comfort.',
    color: 'White',
    tags: ['Running', 'Limited Edition'],
    features: ['Breathable knit upper', 'Foam midsole', 'Slip-resistant grip', 'Lightweight design'],
    variants: [
      createVariant(11, 'EU 39', 'White', 6499, 18),
      createVariant(12, 'EU 40', 'White', 6499, 24),
      createVariant(13, 'EU 42', 'Black', 6499, 12),
      createVariant(14, 'EU 44', 'Red', 6499, 27)
    ]
  },
  {
    id: 2,
    name: 'Velvet Bloom Lip Kit',
    sku: 'BEA-VBL-210',
    barcode: '890120240002',
    category: 'Beauty',
    brand: 'Rare Beauty',
    price: 2299,
    stock: 56,
    status: 'Live',
    rating: 4.7,
    featured: true,
    date: '10 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A long-wear lip kit with velvet matte finish, rich pigment, and nourishing formula for daily glam.',
    color: 'Rosewood',
    tags: ['Makeup', 'Best Seller'],
    features: ['Matte finish', 'Hydrating formula', 'Transfer resistant', 'Three-piece set'],
    variants: [
      createVariant(21, 'Classic Rose', 'Rosewood', 2299, 14),
      createVariant(22, 'Soft Nude', 'Beige', 2299, 9),
      createVariant(23, 'Berry Muse', 'Berry', 2399, 11)
    ]
  },
  {
    id: 3,
    name: 'Luna Layered Satin Dress',
    sku: 'FAS-LLD-320',
    barcode: '890120240003',
    category: 'Fashion',
    brand: 'Zara',
    price: 4199,
    stock: 34,
    status: 'Live',
    rating: 4.9,
    featured: false,
    date: '08 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Elegant satin midi dress with soft drape, fitted waist, and day-to-evening silhouette.',
    color: 'Champagne',
    tags: ['New Arrival', 'Occasion Wear'],
    features: ['Satin finish', 'Back zip closure', 'Midi length', 'Soft lining'],
    variants: [
      createVariant(31, 'S', 'Champagne', 4199, 6),
      createVariant(32, 'M', 'Champagne', 4199, 10),
      createVariant(33, 'L', 'Black', 4299, 8)
    ]
  },
  {
    id: 4,
    name: 'Contour Luxe Handbag',
    sku: 'ACC-CLH-410',
    barcode: '890120240004',
    category: 'Bags',
    brand: 'Coach',
    price: 5899,
    stock: 21,
    status: 'Action Needed',
    rating: 4.6,
    featured: true,
    date: '05 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Structured premium handbag with polished hardware, top handle, and detachable shoulder strap.',
    color: 'Tan',
    tags: ['Luxury', 'Workwear'],
    features: ['Premium leather finish', 'Detachable strap', 'Inner zip pocket', 'Gold-tone hardware'],
    variants: [
      createVariant(41, 'Standard', 'Tan', 5899, 7),
      createVariant(42, 'Standard', 'Black', 5899, 8),
      createVariant(43, 'Mini', 'Tan', 5299, 6)
    ]
  },
  {
    id: 5,
    name: 'Glow Veil Skincare Set',
    sku: 'BEA-GVS-515',
    barcode: '890120240005',
    category: 'Beauty',
    brand: 'The Ordinary',
    price: 3199,
    stock: 47,
    status: 'Live',
    rating: 4.8,
    featured: false,
    date: '01 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1556228578-dd6f3f5f63d9?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1556228578-dd6f3f5f63d9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Daily glow routine with cleanser, serum, toner, and moisturizer for hydrated radiant skin.',
    color: 'Clear',
    tags: ['Skincare', 'Routine Kit'],
    features: ['Gentle cleanser', 'Brightening serum', 'Hydration boost', 'Sensitive skin friendly'],
    variants: [
      createVariant(51, '4 Step Kit', 'Clear', 3199, 18),
      createVariant(52, 'Travel Kit', 'Clear', 1899, 12)
    ]
  },
  {
    id: 6,
    name: 'Stride Street High Tops',
    sku: 'SHO-SSH-620',
    barcode: '890120240006',
    category: 'Shoes',
    brand: 'Adidas',
    price: 5599,
    stock: 28,
    status: 'Draft',
    rating: 4.5,
    featured: false,
    date: '28 Sep, 2025',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Classic high-top profile with padded ankle support and bold streetwear styling.',
    color: 'Black',
    tags: ['Streetwear', 'High Tops'],
    features: ['Padded collar', 'Cushioned sole', 'Rubber outsole', 'High-top silhouette'],
    variants: [
      createVariant(61, 'EU 40', 'Black', 5599, 10),
      createVariant(62, 'EU 41', 'Black', 5599, 9),
      createVariant(63, 'EU 43', 'Green', 5799, 9)
    ]
  },
  {
    id: 7,
    name: 'Silk Ease Night Serum',
    sku: 'BEA-SNS-710',
    barcode: '890120240007',
    category: 'Beauty',
    brand: 'Laneige',
    price: 2749,
    stock: 39,
    status: 'Live',
    rating: 4.9,
    featured: true,
    date: '25 Sep, 2025',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0f?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Overnight renewal serum with peptides and ceramides for smoother texture and soft glow by morning.',
    color: 'Lavender',
    tags: ['Night Care', 'Hydrating'],
    features: ['Peptide complex', 'Lightweight texture', 'Dermat tested', 'Overnight hydration'],
    variants: [
      createVariant(71, '30ml', 'Lavender', 2749, 14),
      createVariant(72, '50ml', 'Lavender', 3499, 13)
    ]
  },
  {
    id: 8,
    name: 'Harbor Tailored Blazer',
    sku: 'FAS-HTB-805',
    barcode: '890120240008',
    category: 'Fashion',
    brand: 'H&M',
    price: 4899,
    stock: 19,
    status: 'Archived',
    rating: 4.4,
    featured: false,
    date: '20 Sep, 2025',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Sharp tailored blazer with clean lines and soft structured fabric for modern smart-casual looks.',
    color: 'Navy',
    tags: ['Formal', 'Layering'],
    features: ['Slim fit', 'Lined interior', 'Two-button closure', 'Wrinkle resistant'],
    variants: [
      createVariant(81, 'S', 'Navy', 4899, 5),
      createVariant(82, 'M', 'Navy', 4899, 8),
      createVariant(83, 'L', 'Grey', 4999, 6)
    ]
  }
];

const normalizeProduct = (product) => {
  const imageGallery = Array.isArray(product.imageGallery) && product.imageGallery.length > 0
    ? product.imageGallery
    : product.image
      ? [product.image]
      : [];

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const stock = Number(product.stock ?? product.qty ?? variants.reduce((sum, variant) => sum + Number(variant.onHand || 0), 0));

  return {
    ...product,
    image: product.image || imageGallery[0] || '',
    imageGallery,
    subcategory: product.subcategory || '',
    tags: Array.isArray(product.tags) ? product.tags : [],
    features: Array.isArray(product.features) ? product.features : [],
    variants,
    stock,
    qty: stock,
  };
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS.map(normalizeProduct));
  const { success } = useToast();

  const addProduct = (product) => {
    const normalizedProduct = normalizeProduct({
      ...product,
      sku:
        product.sku ||
        generateProductSku({
          name: product.name,
          category: product.category,
          existingProducts: products,
          currentProductId: product.id,
        }),
      barcode:
        product.barcode ||
        generateProductBarcode({
          existingProducts: products,
          currentProductId: product.id,
        }),
      id: product.id || Date.now(),
      rating: product.rating || 4.5,
      date:
        product.date ||
        new Date()
          .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          .replace(/\//g, ' '),
    });

    setProducts((prev) => [normalizedProduct, ...prev]);
    success('Product added', `${normalizedProduct.name} was added to the catalog.`);
  };

  const updateProduct = (updatedProduct) => {
    const updated = products.find((product) => product.id === updatedProduct.id);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? normalizeProduct({ ...product, ...updatedProduct }) : product,
      ),
    );
    success('Product updated', `${updated?.name || 'Product'} details were saved.`);
  };

  const deleteProduct = (id) => {
    const removed = products.find((product) => product.id === id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    success('Product deleted', `${removed?.name || 'Product'} was removed from the catalog.`);
  };

  const deleteProducts = (ids) => {
    const removedCount = products.filter((product) => ids.includes(product.id)).length;
    setProducts((prev) => prev.filter((product) => !ids.includes(product.id)));
    success('Products deleted', `${removedCount} product${removedCount === 1 ? '' : 's'} were removed.`);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, deleteProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
