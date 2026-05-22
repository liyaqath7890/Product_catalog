import React, { createContext, useContext, useState } from 'react';
import { useToast } from '../components/feedback/ToastProvider';

const CategoryContext = createContext();

const CATEGORY_ICON_STYLES = {
  LayoutGrid: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Gem: { color: 'text-sky-600', bg: 'bg-sky-50' },
  Shirt: { color: 'text-violet-600', bg: 'bg-violet-50' },
  Sparkles: { color: 'text-pink-600', bg: 'bg-pink-50' },
  ShoppingBag: { color: 'text-amber-600', bg: 'bg-amber-50' },
  Handbag: { color: 'text-amber-600', bg: 'bg-amber-50' },
  Heart: { color: 'text-rose-600', bg: 'bg-rose-50' },
  Laptop: { color: 'text-slate-600', bg: 'bg-slate-100' },
  Smartphone: { color: 'text-cyan-600', bg: 'bg-cyan-50' },
  Speaker: { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Watch: { color: 'text-lime-600', bg: 'bg-lime-50' },
  Tablet: { color: 'text-blue-600', bg: 'bg-blue-50' },
  Headphones: { color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
};

const getCategoryVisuals = (iconName) =>
  CATEGORY_ICON_STYLES[iconName] || { color: 'text-gray-600', bg: 'bg-gray-50' };

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Shoes', count: 124, iconName: 'Gem', color: 'text-sky-600', bg: 'bg-sky-50', status: 'Active', description: 'Sneakers, heels, sandals, and all-day comfort styles.', slug: 'shoes', image: '' },
  { id: 2, name: 'Fashion', count: 85, iconName: 'Shirt', color: 'text-violet-600', bg: 'bg-violet-50', status: 'Active', description: 'Dresses, tops, blazers, and statement wardrobe pieces.', slug: 'fashion', image: '' },
  { id: 3, name: 'Beauty', count: 42, iconName: 'Sparkles', color: 'text-pink-600', bg: 'bg-pink-50', status: 'Active', description: 'Skincare, makeup, and self-care essentials.', slug: 'beauty', image: '' },
  { id: 4, name: 'Bags', count: 31, iconName: 'Handbag', color: 'text-amber-600', bg: 'bg-amber-50', status: 'Active', description: 'Handbags, crossbody styles, clutches, and carry-all pieces.', slug: 'bags', image: '' },
  { id: 5, name: 'Accessories', count: 28, iconName: 'Heart', color: 'text-rose-600', bg: 'bg-rose-50', status: 'Scheduled', description: 'Belts, jewelry, scarves, and finishing touches.', slug: 'accessories', image: '' },
  { id: 6, name: 'New Arrivals', count: 19, iconName: 'LayoutGrid', color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Inactive', description: 'Fresh picks curated for current season collections.', slug: 'new-arrivals', image: '' }
];

const INITIAL_SUBCATEGORIES = [
  { id: 1, name: 'Running Shoes', categoryId: 1, categoryName: 'Shoes', description: 'Performance running and training shoes.', status: 'Active', image: '' },
  { id: 2, name: 'Heels', categoryId: 1, categoryName: 'Shoes', description: 'Occasion and daily wear heels.', status: 'Inactive', image: '' },
  { id: 3, name: 'Dresses', categoryId: 2, categoryName: 'Fashion', description: 'Casual, evening, and occasion dresses.', status: 'Active', image: '' },
  { id: 4, name: 'Skincare', categoryId: 3, categoryName: 'Beauty', description: 'Creams, serums, masks, and cleansers.', status: 'Active', image: '' },
  { id: 5, name: 'Tote Bags', categoryId: 4, categoryName: 'Bags', description: 'Spacious carry-all handbags and totes.', status: 'Active', image: '' },
  { id: 6, name: 'Jewelry', categoryId: 5, categoryName: 'Accessories', description: 'Necklaces, earrings, bracelets, and rings.', status: 'Inactive', image: '' },
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subcategories, setSubcategories] = useState(INITIAL_SUBCATEGORIES);
  const { success } = useToast();

  const addCategory = (category) => {
    const categoryVisuals = getCategoryVisuals(category.iconName);
    const newCategory = {
      ...category,
      id: Date.now(),
      count: 0,
      iconName: category.iconName || 'LayoutGrid',
      color: category.color || categoryVisuals.color,
      bg: category.bg || categoryVisuals.bg,
      image: category.image || '',
    };
    setCategories((prev) => [newCategory, ...prev]);
    success('Category added', `${newCategory.name} was created successfully.`);
  };

  const updateCategory = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== updatedCategory.id) {
          return category;
        }

        const nextIconName = updatedCategory.iconName || category.iconName || 'LayoutGrid';
        const categoryVisuals = getCategoryVisuals(nextIconName);

        return {
          ...category,
          ...updatedCategory,
          iconName: nextIconName,
          color: updatedCategory.color || categoryVisuals.color,
          bg: updatedCategory.bg || categoryVisuals.bg,
        };
      }),
    );
    success('Category updated', `${updatedCategory.name || 'Category'} changes were saved.`);
  };

  const deleteCategory = (id) => {
    const categoryName = categories.find((category) => category.id === id)?.name || 'Category';
    setCategories((prev) => prev.filter((category) => category.id !== id));
    setSubcategories((prev) => prev.filter((subcategory) => subcategory.categoryId !== id));
    success('Category deleted', `${categoryName} and its subcategories were removed.`);
  };

  const addSubcategory = (subcategory) => {
    const nextSubcategory = { ...subcategory, id: Date.now() };
    setSubcategories((prev) => [nextSubcategory, ...prev]);
    success('Subcategory added', `${nextSubcategory.name} was created successfully.`);
  };

  const updateSubcategory = (updatedSubcategory) => {
    setSubcategories((prev) =>
      prev.map((subcategory) =>
        subcategory.id === updatedSubcategory.id ? { ...subcategory, ...updatedSubcategory } : subcategory,
      ),
    );
    success('Subcategory updated', `${updatedSubcategory.name || 'Subcategory'} changes were saved.`);
  };

  const deleteSubcategory = (id) => {
    const subcategoryName = subcategories.find((subcategory) => subcategory.id === id)?.name || 'Subcategory';
    setSubcategories((prev) => prev.filter((subcategory) => subcategory.id !== id));
    success('Subcategory deleted', `${subcategoryName} was removed successfully.`);
  };

  const toggleSubcategoryStatus = (subcategoryId) => {
    const currentSubcategory = subcategories.find((subcategory) => subcategory.id === subcategoryId);
    setSubcategories((prev) =>
      prev.map((subcategory) =>
        subcategory.id === subcategoryId
          ? { ...subcategory, status: subcategory.status === 'Active' ? 'Inactive' : 'Active' }
          : subcategory,
      ),
    );
    const nextStatus = currentSubcategory?.status === 'Active' ? 'Inactive' : 'Active';
    success('Subcategory status updated', `${currentSubcategory?.name || 'Subcategory'} is now ${nextStatus}.`);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        subcategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        toggleSubcategoryStatus,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};
