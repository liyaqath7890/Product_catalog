import * as Yup from 'yup';

const isAllowedImageValue = (value) => {
  if (!value) return true;
  return /^data:image\//.test(value) || Yup.string().url().isValidSync(value);
};

export const PRODUCT_STATUS_OPTIONS = ['Live', 'Draft', 'Archived', 'Action Needed'];

export const PRODUCT_BRAND_OPTIONS = [
  'Nike',
  'Adidas',
  'Puma',
  'Zara',
  'H&M',
  'Coach',
  'Rare Beauty',
  'The Ordinary',
  'Laneige',
];

export const createDefaultVariant = (overrides = {}) => ({
  id: overrides.id ?? Date.now() + Math.floor(Math.random() * 1000),
  size: overrides.size ?? '',
  color: overrides.color ?? '',
  price: overrides.price ?? '',
  available: overrides.available ?? true,
  onHand: overrides.onHand ?? '',
});

export const createProductInitialValues = (product = {}) => ({
  id: product.id ?? undefined,
  name: product.name ?? '',
  sku: product.sku ?? '',
  barcode: product.barcode ?? '',
  description: product.description ?? '',
  price: product.price ?? '',
  stock: product.stock ?? product.qty ?? '',
  category: product.category ?? '',
  subcategory: product.subcategory ?? '',
  brand: product.brand ?? '',
  status: product.status ?? 'Live',
  featured: Boolean(product.featured),
  tags: Array.isArray(product.tags) ? product.tags : [],
  image: product.image ?? '',
  imageGallery:
    Array.isArray(product.imageGallery) && product.imageGallery.length > 0
      ? product.imageGallery
      : product.image
        ? [product.image]
        : [],
  variants:
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants.map((variant) => createDefaultVariant(variant))
      : [],
  rating: product.rating ?? 0,
});

export const productValidationSchema = Yup.object({
  name: Yup.string().trim().required('Product name is required'),
  sku: Yup.string().trim().required('SKU is required'),
  barcode: Yup.string().trim().max(64, 'Barcode is too long'),
  description: Yup.string().trim().required('Product description is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  stock: Yup.number()
    .typeError('Stock must be a number')
    .min(0, 'Stock cannot be negative')
    .required('Stock quantity is required'),
  category: Yup.string().trim().required('Category is required'),
  subcategory: Yup.string().trim(),
  brand: Yup.string().trim().required('Brand is required'),
  status: Yup.string().trim().required('Status is required'),
  image: Yup.string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .notRequired()
    .test('valid-image-source', 'Image must be a valid image URL', isAllowedImageValue),
  variants: Yup.array().of(
    Yup.object({
      size: Yup.string().trim().required('Size is required'),
      color: Yup.string().trim().required('Color is required'),
      price: Yup.number().typeError('Variant price must be a number').positive('Variant price must be greater than 0').required('Variant price is required'),
      onHand: Yup.number().typeError('On hand must be a number').min(0, 'On hand cannot be negative').required('On hand is required'),
    }),
  ),
});
