'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';

export default function AdminPromotions() {
  const router = useRouter();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 10,
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/promotions/');
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
      alert('Discount percentage must be between 0 and 100');
      return;
    }
    
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      alert('End date must be after start date');
      return;
    }

    try {
      const url = editingPromotion
        ? `http://127.0.0.1:8000/api/admin/promotions/${editingPromotion.id}/`
        : 'http://127.0.0.1:8000/api/admin/promotions/';
      
      const method = editingPromotion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchPromotions();
        resetForm();
      } else {
        alert(data.error || 'Failed to save promotion');
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Failed to save promotion');
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      discount_percentage: parseFloat(promotion.discount_percentage),
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      is_active: promotion.is_active
    });
    setShowForm(true);
  };

  const handleSendEmail = async (id) => {
    if (!confirm('Send promotional email to all subscribed users? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/promotions/${id}/send-email/`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.message}\nEmails sent: ${data.emails_sent} out of ${data.total_subscribed} subscribed users`);
      } else {
        alert(data.error || 'Failed to send promotion emails');
      }
    } catch (error) {
      console.error('Error sending promotion emails:', error);
      alert('Failed to send promotion emails');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promotion?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/promotions/${id}/`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchPromotions();
      } else {
        alert(data.error || 'Failed to delete promotion');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Failed to delete promotion');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percentage: 10,
      start_date: '',
      end_date: '',
      is_active: true
    });
    setEditingPromotion(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Parse the date string directly without timezone conversion
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const isPromotionActive = (promotion) => {
    if (!promotion.is_active) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    
    return today >= start && today <= end;
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <div className="text-center">Loading...</div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Promotion Management</h1>
            <div className="space-x-4">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Create New Promotion
                </button>
              )}
              <Link
                href="/admin"
                className="inline-block px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Back to Admin
              </Link>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Promotion Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                      required
                      maxLength={50}
                      placeholder="e.g., SUMMER25"
                    />
                    <p className="text-sm text-gray-400 mt-1">Uppercase letters, numbers, no spaces</p>
                  </div>

                  <div>
                    <label className="block mb-2">Discount Percentage *</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg"
                        required
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <span className="text-xl">%</span>
                    </div>
                    <input
                      type="range"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                      className="w-full mt-2"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="is_active" className="cursor-pointer">
                    Active (Can be used by customers)
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                  >
                    {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Discount</th>
                  <th className="px-6 py-3 text-left">Start Date</th>
                  <th className="px-6 py-3 text-left">End Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No promotions found. Create your first promotion!
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-blue-400">{promo.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-bold">{parseFloat(promo.discount_percentage).toFixed(0)}%</span>
                      </td>
                      <td className="px-6 py-4">{formatDate(promo.start_date)}</td>
                      <td className="px-6 py-4">{formatDate(promo.end_date)}</td>
                      <td className="px-6 py-4">
                        {isPromotionActive(promo) ? (
                          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                            Active
                          </span>
                        ) : !promo.is_active ? (
                          <span className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full">
                            Inactive
                          </span>
                        ) : new Date() < new Date(promo.start_date) ? (
                          <span className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
                            Scheduled
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleSendEmail(promo.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                          title="Send promotion email to subscribed users"
                        >
                          Send Email
                        </button>
                        <button
                          onClick={() => handleEdit(promo)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
