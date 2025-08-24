import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { getProductById } from '../../api/productAPI';
import type { Product } from '../../types/product';
import { ProductContext } from '../../context/ProductContext';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productContext = useContext(ProductContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [error, setError] = useState('');

  const fetchRequested = useRef(false);
  const submitRequested = useRef(false);

  useEffect(() => {
    if (fetchRequested.current) return;
    fetchRequested.current = true;

    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
        setFormData(productData);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      fetchRequested.current = false;
    };
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: undefined }));
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !product || !productContext) return;

    if (submitRequested.current || saving) return;
    submitRequested.current = true;

    try {
      setSaving(true);
      setError('');

      const updatedData: Record<string, any> = {};

      Object.keys(formData).forEach(key => {
        const formValue = formData[key as keyof Product];
        const originalValue = product[key as keyof Product];

        if (key === 'discountPercentage') {
          const numFormValue = typeof formValue === 'string' ? parseFloat(formValue) : formValue;
          const numOriginalValue = typeof originalValue === 'string' ? parseFloat(originalValue) : originalValue;

          if (numFormValue !== numOriginalValue && numFormValue !== undefined) {
            updatedData[key] = numFormValue;
          }
        } else if (formValue !== originalValue && formValue !== undefined) {
          updatedData[key] = formValue;
        }
      });

      if (Object.keys(updatedData).length === 0) {
        setError('No changes detected');
        submitRequested.current = false;
        return;
      }

      await productContext.updateExistingProduct(parseInt(id), updatedData);

      alert('Product updated successfully!');
      navigate(-1);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(`Failed to update product: ${err.response.data.message}`);
      } else {
        setError('Failed to update product. Please check your input values.');
      }
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
      submitRequested.current = false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-100 to-indigo-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/50">
        <div className="text-center">
          <p className="text-red-600">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Product</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Product Information</h2>
              </div>

              <Input
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                required
              />

              <Input
                label="Category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Brand"
                name="brand"
                value={formData.brand || ''}
                onChange={handleInputChange}
              />

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Pricing & Inventory</h2>
              </div>

              <Input
                label="Price ($)"
                type="number"
                name="price"
                value={formData.price ?? ''}
                onChange={handleNumberInputChange}
                step={0.01}
                min={0}
                required
              />

              <Input
                label="Discount Percentage (%)"
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage ?? ''}
                onChange={handleNumberInputChange}
                step={0.1}
                min={0}
                max={100}
              />

              <Input
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock ?? ''}
                onChange={handleNumberInputChange}
                min={0}
                required
              />

              <Input
                label="Rating"
                type="number"
                name="rating"
                value={formData.rating ?? ''}
                onChange={handleNumberInputChange}
                step={0.1}
                min={0}
                max={5}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductEdit;
