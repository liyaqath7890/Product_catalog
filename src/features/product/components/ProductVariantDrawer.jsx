import React, { useEffect, useMemo, useState } from 'react';
import { GripVertical, Plus, Save, Trash2, X } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import CustomInput from '../../../components/custom/CustomInput';

const DRAWER_STATUS_OPTIONS = ['Live', 'Draft', 'Archived', 'Action Needed'];

const createGroup = (id, name, values = []) => ({ id, name, values });
const createVariantId = () => Date.now() + Math.floor(Math.random() * 10000);
const toLabelKey = (combo) => combo.map((item) => item.value).join(' / ');

const buildOptionGroups = (product) => {
  if (!product?.variants?.length) {
    return [
      createGroup(1, 'Colors', ['White', 'Black']),
      createGroup(2, 'Size', ['EU 39', 'EU 40']),
    ];
  }

  const colors = [...new Set(product.variants.map((variant) => variant.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((variant) => variant.size).filter(Boolean))];

  return [
    createGroup(1, 'Colors', colors.length ? colors : ['White', 'Black']),
    createGroup(2, 'Size', sizes.length ? sizes : ['EU 39', 'EU 40']),
  ];
};

const cartesian = (groups) =>
  groups.reduce(
    (accumulator, group) =>
      accumulator.flatMap((entry) => group.values.map((value) => [...entry, { name: group.name, value }])),
    [[]],
  );

const ProductVariantDrawer = ({ isOpen, product, onClose, onSave }) => {
  const [status, setStatus] = useState('Live');
  const [optionGroups, setOptionGroups] = useState([]);
  const [draftVariants, setDraftVariants] = useState([]);

  useEffect(() => {
    if (!isOpen || !product) return;

    const groups = buildOptionGroups(product);
    setOptionGroups(groups);
    setStatus(product.status || 'Live');
  }, [isOpen, product]);

  useEffect(() => {
    if (!product || optionGroups.length === 0) return;

    const completeGroups = optionGroups.filter((group) => group.values.length > 0);
    if (completeGroups.length === 0) {
      setDraftVariants([]);
      return;
    }

    const combos = cartesian(completeGroups);
    setDraftVariants((previous) => {
      const previousByKey = new Map(
        previous.map((variant) => [[variant.size, variant.color].filter(Boolean).join(' / '), variant]),
      );
      const existingByKey = new Map(
        (product.variants || []).map((variant) => [[variant.size, variant.color].filter(Boolean).join(' / '), variant]),
      );

      return combos.map((combo) => {
        const key = toLabelKey(combo);
        const previousDraft = previousByKey.get(key);
        const existing = existingByKey.get(key);
        const size = combo.find((item) => item.name.toLowerCase().includes('size'))?.value || '';
        const color = combo.find((item) => item.name.toLowerCase().includes('color'))?.value || '';
        const baseVariant = previousDraft || existing;

        return {
          id: baseVariant?.id || createVariantId(),
          size,
          color,
          price: baseVariant?.price ?? product.price ?? '',
          onHand: baseVariant?.onHand ?? 0,
          available: Number(baseVariant?.onHand ?? 0) > 0,
          sku: baseVariant?.sku || `${product.sku}-${key.replace(/\s+/g, '-').toUpperCase()}`,
        };
      });
    });
  }, [optionGroups, product]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const previewCount = useMemo(() => draftVariants.length, [draftVariants]);

  if (!isOpen || !product) return null;

  const addOptionGroup = () => {
    setOptionGroups((previous) => [...previous, createGroup(Date.now(), `Option ${previous.length + 1}`, [])]);
  };

  const updateGroupName = (groupId, name) => {
    setOptionGroups((previous) => previous.map((group) => (group.id === groupId ? { ...group, name } : group)));
  };

  const addGroupValue = (groupId, value) => {
    const nextValue = value.trim();
    if (!nextValue) return;

    setOptionGroups((previous) =>
      previous.map((group) =>
        group.id === groupId && !group.values.includes(nextValue)
          ? { ...group, values: [...group.values, nextValue] }
          : group,
      ),
    );
  };

  const removeGroupValue = (groupId, valueToRemove) => {
    setOptionGroups((previous) =>
      previous.map((group) =>
        group.id === groupId ? { ...group, values: group.values.filter((value) => value !== valueToRemove) } : group,
      ),
    );
  };

  const removeGroup = (groupId) => {
    setOptionGroups((previous) => previous.filter((group) => group.id !== groupId));
  };

  const updateVariant = (variantId, field, value) => {
    setDraftVariants((previous) =>
      previous.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: value,
              ...(field === 'onHand' ? { available: Number(value) > 0 } : {}),
            }
          : variant,
      ),
    );
  };

  const handleSave = () => {
    const normalizedVariants = draftVariants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
      onHand: Number(variant.onHand),
      available: Number(variant.onHand) > 0,
    }));

    onSave({
      ...product,
      status,
      variants: normalizedVariants,
      stock: normalizedVariants.reduce((sum, variant) => sum + Number(variant.onHand || 0), 0),
      qty: normalizedVariants.reduce((sum, variant) => sum + Number(variant.onHand || 0), 0),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/35 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-[540px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">Manage Variants</h2>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">
              Create ecommerce-ready color, size, and option combinations for {product.name}.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-6 py-4">
          <CustomDropdown value={status} onChange={(event) => setStatus(event.target.value)} options={DRAWER_STATUS_OPTIONS} placeholder="Select Status" className="w-[160px]" />
          <div className="flex items-center gap-3">
            <CustomButton type="button" variant="outline" onClick={onClose} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold">Cancel</CustomButton>
            <CustomButton type="button" onClick={handleSave} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"><Save size={16} /> Save</CustomButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-4">
            {optionGroups.map((group) => (
              <VariantGroupCard
                key={group.id}
                group={group}
                onRename={updateGroupName}
                onRemoveGroup={removeGroup}
                onAddValue={addGroupValue}
                onRemoveValue={removeGroupValue}
              />
            ))}

            <button type="button" onClick={addOptionGroup} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--table-grid)] px-4 py-4 text-sm font-semibold text-[var(--color-primary)] transition-standard hover:bg-[var(--surface-muted)]">
              <Plus size={16} /> Add Option Group
            </button>
          </div>

          <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--table-grid)]">
            <div className="flex items-center justify-between border-b border-[var(--table-grid)] bg-[var(--surface-muted)] px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-gray-900)]">Generated Variants</h3>
                <p className="mt-1 text-xs text-[var(--color-gray-500)]">{previewCount} combinations ready</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                  <tr className="border-b border-[var(--table-grid)]">
                    <th className="border-r border-[var(--table-grid)] px-4 py-3">Size</th>
                    <th className="border-r border-[var(--table-grid)] px-4 py-3">Color</th>
                    <th className="border-r border-[var(--table-grid)] px-4 py-3">Price</th>
                    <th className="border-r border-[var(--table-grid)] px-4 py-3">On Hand</th>
                    <th className="px-4 py-3">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {draftVariants.map((variant) => (
                    <tr key={variant.id} className="border-b border-[var(--table-grid)] last:border-b-0">
                      <td className="border-r border-[var(--table-grid)] px-4 py-3 text-[var(--color-gray-900)]">{variant.size || '-'}</td>
                      <td className="border-r border-[var(--table-grid)] px-4 py-3 text-[var(--color-gray-900)]">{variant.color || '-'}</td>
                      <td className="border-r border-[var(--table-grid)] px-4 py-3"><input type="number" value={variant.price} onChange={(event) => updateVariant(variant.id, 'price', event.target.value)} className="w-24 rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]" /></td>
                      <td className="border-r border-[var(--table-grid)] px-4 py-3"><input type="number" value={variant.onHand} onChange={(event) => updateVariant(variant.id, 'onHand', event.target.value)} className="w-20 rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]" /></td>
                      <td className="px-4 py-3 text-xs text-[var(--color-gray-500)]">{variant.sku}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--table-grid)] px-6 py-4">
          <CustomDropdown value={status} onChange={(event) => setStatus(event.target.value)} options={DRAWER_STATUS_OPTIONS} placeholder="Select Status" className="w-[160px]" />
          <div className="flex items-center gap-3">
            <CustomButton type="button" variant="outline" onClick={onClose} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold">Cancel</CustomButton>
            <CustomButton type="button" onClick={handleSave} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold">Save</CustomButton>
          </div>
        </div>
      </aside>
    </div>
  );
};

const VariantGroupCard = ({ group, onRename, onRemoveGroup, onAddValue, onRemoveValue }) => {
  const [draftValue, setDraftValue] = useState('');

  const handleAddValue = () => {
    onAddValue(group.id, draftValue);
    setDraftValue('');
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--table-grid)]">
      <div className="flex items-center justify-between border-b border-[var(--table-grid)] bg-[var(--surface-muted)] px-4 py-3">
        <div className="flex items-center gap-3">
          <GripVertical size={15} className="text-[var(--color-gray-400)]" />
          <span className="text-sm font-semibold text-[var(--color-gray-900)]">{group.name || 'Option'}</span>
        </div>
        <button type="button" onClick={() => onRemoveGroup(group.id)} className="text-[var(--color-gray-400)] hover:text-[var(--color-danger)]">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="space-y-4 p-4">
        <CustomInput label="Option Name" value={group.name} onChange={(event) => onRename(group.id, event.target.value)} />
        <div className="space-y-3">
          <span className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Option Values</span>
          {group.values.map((value) => (
            <div key={value} className="flex items-center gap-3">
              <GripVertical size={15} className="text-[var(--color-gray-400)]" />
              <div className="control-shell flex-1 px-4 py-2 text-sm font-medium text-[var(--table-text)]">{value}</div>
              <button type="button" onClick={() => onRemoveValue(group.id, value)} className="text-[var(--color-gray-400)] hover:text-[var(--color-danger)]">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <CustomInput
          label="Add New Value"
          placeholder="Type value name and press Enter"
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleAddValue();
            }
          }}
        />
        <div className="flex justify-end">
          <CustomButton type="button" variant="outline" onClick={handleAddValue} className="h-10 rounded-xl px-4 text-sm font-semibold">
            <Plus size={14} /> Add Value
          </CustomButton>
        </div>
      </div>
    </section>
  );
};

export default ProductVariantDrawer;
