import React, { useState } from 'react';
import { ArrowRight, Edit3, LayoutGrid, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../../../context/CategoryContext';

const CategoryPicker = () => {
  const navigate = useNavigate();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-8 fade-in duration-500 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Select Category to Edit</h1>
          <p className="text-sm font-medium text-gray-500">
            Choose a category from your catalog to update its details.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="group flex flex-1 items-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 transition-all focus-within:border-indigo-500 focus-within:bg-white">
          <Search size={18} className="mr-3 text-gray-300 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full border-none bg-transparent text-sm font-bold text-gray-700 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/categories/edit/${category.id}`)}
            className="group cursor-pointer rounded-3xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-black/[0.01] transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-6 flex items-center gap-5">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100/60 ${category.bg} transition-transform duration-500 group-hover:scale-110`}
              >
                <LayoutGrid className={`h-8 w-8 ${category.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                  {category.name}
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {category.count} items
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 transition-all group-hover:gap-3">
                <Edit3 size={16} />
                <span>Edit Category</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPicker;
