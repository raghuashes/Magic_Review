import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Loader2, GripVertical } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { storeService } from '../services/storeService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { StoreResponse, Category, Attribute } from '../types';
import { cn } from '../utils/helpers';

type Tab = 'details' | 'categories' | 'attributes';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [editingItem, setEditingItem] = useState<Category | Attribute | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<'category' | 'attribute' | null>(null);
  type FormData = {
    name?: string;
    label?: string;
    active: boolean;
    displayOrder: number;
  };
  const [formData, setFormData] = useState<FormData>({
    active: true,
    displayOrder: 0,
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; label?: string }>({});

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [storeData, categoriesData, attributesData] = await Promise.all([
        storeService.getStore(id!),
        storeService.getCategories(id!),
        storeService.getAttributes(id!),
      ]);
      setStore(storeData);
      setCategories(categoriesData);
      setAttributes(attributesData);
    } catch (err) {
      addToast('Failed to load store data', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingItem(null);
    setFormData({ name: '', active: true, displayOrder: categories.length });
    setFormErrors({});
  };

  const handleCreateAttribute = () => {
    setEditingItem(null);
    setFormData({ label: '', active: true, displayOrder: attributes.length });
    setFormErrors({});
  };

  const handleEditCategory = (category: Category) => {
    setEditingItem(category);
    setFormData({ name: category.name, active: category.active, displayOrder: category.displayOrder });
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingItem(attribute);
    setFormData({ label: attribute.label, active: attribute.active, displayOrder: attribute.displayOrder });
  };

  const handleDelete = (itemId: string, type: 'category' | 'attribute') => {
    setDeletingItemId(itemId);
    setDeletingType(type);
  };

  const confirmDelete = async () => {
    if (!deletingItemId || !deletingType) return;
    try {
      if (deletingType === 'category') {
        await storeService.deleteCategory(id!, deletingItemId);
        setCategories((prev) => prev.filter((c) => c.id !== deletingItemId));
        addToast('Category deleted', 'success');
      } else {
        await storeService.deleteAttribute(id!, deletingItemId);
        setAttributes((prev) => prev.filter((a) => a.id !== deletingItemId));
        addToast('Attribute deleted', 'success');
      }
    } catch (err) {
      addToast('Failed to delete', 'error');
    } finally {
      setDeletingItemId(null);
      setDeletingType(null);
    }
  };

  const validateForm = () => {
    const errors: { name?: string; label?: string } = {};
    if (activeTab === 'categories') {
      if (!formData.name?.trim()) errors.name = 'Category name is required';
    } else {
      if (!formData.label?.trim()) errors.label = 'Attribute label is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (activeTab === 'categories') {
        if (editingItem) {
          const updated = await storeService.updateCategory(id!, editingItem.id, { name: formData.name!, active: formData.active, displayOrder: formData.displayOrder });
          setCategories((prev) => prev.map((c) => (c.id === editingItem.id ? updated : c)));
          addToast('Category updated', 'success');
        } else {
          const created = await storeService.createCategory(id!, { name: formData.name!, active: formData.active, displayOrder: formData.displayOrder });
          setCategories((prev) => [...prev, created]);
          addToast('Category created', 'success');
        }
      } else {
        if (editingItem) {
          const updated = await storeService.updateAttribute(id!, editingItem.id, { label: formData.label!, active: formData.active, displayOrder: formData.displayOrder });
          setAttributes((prev) => prev.map((a) => (a.id === editingItem.id ? updated : a)));
          addToast('Attribute updated', 'success');
        } else {
          const created = await storeService.createAttribute(id!, { label: formData.label!, active: formData.active, displayOrder: formData.displayOrder });
          setAttributes((prev) => [...prev, created]);
          addToast('Attribute created', 'success');
        }
      }
      setEditingItem(null);
      setFormData({ active: true, displayOrder: 0 });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { details?: Record<string, string>; message?: string } } };
      if (error.response?.data?.details) {
        setFormErrors(error.response.data.details);
      } else {
        addToast(error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!store) return null;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'details', label: 'Details', count: 0 },
    { id: 'categories', label: 'Categories', count: categories.length },
    { id: 'attributes', label: 'Attributes', count: attributes.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{store.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{store.slug}</p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex gap-4" aria-label="Store management tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:border-gray-600'
              )}
            >
              {tab.label} {tab.count > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
                <dd className={cn(
                  'mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  store.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                )}>
                  {store.active ? 'Active' : 'Inactive'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Google Review URL</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white truncate max-w-xs">
                  <a href={store.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">
                    {store.googleReviewUrl}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{store.description || 'No description'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Primary Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <div className="h-6 w-6 rounded border" style={{ backgroundColor: store.primaryColor }} />
                  <code className="text-sm">{store.primaryColor}</code>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Secondary Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <div className="h-6 w-6 rounded border" style={{ backgroundColor: store.secondaryColor }} />
                  <code className="text-sm">{store.secondaryColor}</code>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Experience Categories</h2>
            <Button onClick={handleCreateCategory} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No categories yet. Create one to organize review experiences.</p>
                <Button onClick={handleCreateCategory} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <Card key={category.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Order: {category.displayOrder} • {category.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(category.id, 'category')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'attributes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Experience Attributes</h2>
            <Button onClick={handleCreateAttribute} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </div>

          {attributes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No attributes yet. Add tags like "Helpful staff", "Clear pricing", etc.</p>
                <Button onClick={handleCreateAttribute} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Attribute
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {attributes.map((attribute) => (
                <Card key={attribute.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{attribute.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Order: {attribute.displayOrder} • {attribute.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditAttribute(attribute)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(attribute.id, 'attribute')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={!!editingItem || (activeTab !== 'details' && editingItem === null && (categories.length > 0 || attributes.length > 0))}
        onClose={() => { setEditingItem(null); setFormErrors({}); }}
        title={editingItem ? `Edit ${activeTab === 'categories' ? 'Category' : 'Attribute'}` : `Add ${activeTab === 'categories' ? 'Category' : 'Attribute'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'categories' ? (
            <Input
              label="Category Name"
              value={formData.name!}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              placeholder="e.g., Jewellery Quality, Food, Service"
              required
            />
          ) : (
            <Input
              label="Attribute Label"
              value={formData.label!}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              error={formErrors.label}
              placeholder="e.g., Helpful staff, Clear pricing, Clean environment"
              required
            />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Display Order"
              type="number"
              value={formData.displayOrder || 0}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              min="0"
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="active-item"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="active-item" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { setEditingItem(null); setFormErrors({}); }} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editingItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingItemId} onClose={() => { setDeletingItemId(null); setDeletingType(null); }} title="Delete Item">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this {deletingType}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => { setDeletingItemId(null); setDeletingType(null); }}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
        </div>
        </Modal>
    </div>
  );
};