import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, QrCode, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { storeService } from '../services/storeService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { StoreResponse, StoreRequest } from '../types';
import { cn } from '../utils/helpers';

export const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreResponse | null>(null);
  const [deletingStoreId, setDeletingStoreId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoreRequest>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    googleReviewUrl: '',
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<StoreRequest>>({});

  useEffect(() => {
    if (!authLoading && user) {
      loadStores();
    }
  }, [user, authLoading]);

  const loadStores = async () => {
    try {
      const data = await storeService.getStores();
      setStores(data);
    } catch (err) {
      addToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    setEditingStore(null);
    resetForm();
    setCreating(true);
  };

  const handleEditStore = (store: StoreResponse) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      description: store.description || '',
      logoUrl: store.logoUrl || '',
      primaryColor: store.primaryColor,
      secondaryColor: store.secondaryColor,
      googleReviewUrl: store.googleReviewUrl,
      active: store.active,
    });
    setCreating(true);
  };

  const handleDeleteStore = (id: string) => {
    setDeletingStoreId(id);
  };

  const confirmDelete = async () => {
    if (!deletingStoreId) return;
    try {
      await storeService.deleteStore(deletingStoreId);
      setStores((prev) => prev.filter((s) => s.id !== deletingStoreId));
      addToast('Store deleted', 'success');
    } catch (err) {
      addToast('Failed to delete store', 'error');
    } finally {
      setDeletingStoreId(null);
    }
  };

  const validateForm = () => {
    const errors: Partial<StoreRequest> = {};
    if (!formData.name.trim()) errors.name = 'Store name is required';
    if (!formData.googleReviewUrl.trim()) errors.googleReviewUrl = 'Google Review URL is required';
    else if (!/^https?:\/\/.+/.test(formData.googleReviewUrl)) errors.googleReviewUrl = 'Must be a valid URL starting with http:// or https://';
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingStore) {
        const updated = await storeService.updateStore(editingStore.id, formData);
        setStores((prev) => prev.map((s) => (s.id === editingStore.id ? updated : s)));
        addToast('Store updated', 'success');
      } else {
        const created = await storeService.createStore(formData);
        setStores((prev) => [created, ...prev]);
        addToast('Store created', 'success');
      }
      setCreating(false);
      resetForm();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { details?: Record<string, string>; message?: string } } };
      if (error.response?.data?.details) {
        setFormErrors(error.response.data.details);
      } else {
        addToast(error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logoUrl: '',
      primaryColor: '#4F46E5',
      secondaryColor: '#06B6D4',
      googleReviewUrl: '',
      active: true,
    });
    setFormErrors({});
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Stores</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your business locations and review collection</p>
        </div>
        <Button onClick={handleCreateStore} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <QrCode className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stores yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first store to start collecting reviews</p>
            <Button onClick={handleCreateStore} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {store.slug} • {store.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    store.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  )}>
                    {store.active ? 'Live' : 'Paused'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {store.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{store.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ExternalLink className="h-4 w-4" />
                  <span className="truncate">Google Review Link</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link to={`/dashboard/stores/${store.id}`} className="flex-1 btn-primary text-center py-2 text-sm">
                    Manage
                  </Link>
                  <Link to={`/dashboard/qr/${store.id}`} className="flex-1 btn-secondary text-center py-2 text-sm">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditStore(store)}>
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteStore(store.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={creating} onClose={() => { setCreating(false); resetForm(); setEditingStore(null); }} title={editingStore ? 'Edit Store' : 'Create Store'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Store Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} error={formErrors.name} placeholder="My Jewellery Shop" required />
          <Input label="Slug (optional)" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase()})} error={formErrors.slug} placeholder="auto-generated from name" />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief description of your business" rows={3} />
          <Input label="Logo URL" value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} placeholder="https://example.com/logo.png" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Primary Color" type="color" value={formData.primaryColor} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} />
            <Input label="Secondary Color" type="color" value={formData.secondaryColor} onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})} />
          </div>
          <Input label="Google Review URL" value={formData.googleReviewUrl} onChange={(e) => setFormData({...formData, googleReviewUrl: e.target.value})} error={formErrors.googleReviewUrl} placeholder="https://g.page/your-business/review" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { setCreating(false); resetForm(); setEditingStore(null); }} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editingStore ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingStoreId} onClose={() => setDeletingStoreId(null)} title="Delete Store">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this store? This action cannot be undone. All categories, attributes, and analytics will be permanently removed.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeletingStoreId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete} loading={!!deletingStoreId && deletingStoreId === 'deleting'}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};