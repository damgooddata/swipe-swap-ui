import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserLanding() {
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});  // category => [subcategories]
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_value: '',
    category: '',
    subcategory: '',
    location: '',
    acceptable_categories: '',
    min_trade_value: '',
    berries_boosted: 0
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://craigslistclone-app2.ue.r.appspot.com/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (error) {
        setMessage('Failed to load user info');
      }
    };

    const fetchCategoryMap = async () => {
      try {
        const response = await axios.get('https://craigslistclone-app2.ue.r.appspot.com/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategoryMap(response.data.category_map); // { Electronics: ["Phones", "Laptops"], ... }
      } catch (error) {
        setMessage('Failed to load categories');
      }
    };

    fetchUserInfo();
    fetchCategoryMap();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://craigslistclone-app2.ue.r.appspot.com/create-listing', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Listing created: ' + response.data.message);
      setShowForm(false);
    } catch (error) {
      setMessage('Failed to create listing: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' })  // Reset subcategory when category changes
    }));
  };

  const categoryOptions = Object.keys(categoryMap);
  const subcategoryOptions = formData.category ? categoryMap[formData.category] || [] : [];

  if (message) return <p className="text-center mt-10 text-red-500">{message}</p>;
  if (!userInfo) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome, {userInfo.email}</h2>
      <p className="mb-4">Subscription Level: {userInfo.subscription_level}</p>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Listing
      </button>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">New Listing</h3>

            {/* Title */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Estimated Value */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
              <input
                name="estimated_value"
                type="text"
                value={formData.estimated_value}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="border p-2 w-full"
                required
                disabled={!formData.category}
              >
                <option value="">Select a subcategory</option>
                {subcategoryOptions.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Acceptable Categories */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Acceptable Categories</label>
              <input
                name="acceptable_categories"
                type="text"
                value={formData.acceptable_categories}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Minimum Trade Value */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Trade Value</label>
              <input
                name="min_trade_value"
                type="text"
                value={formData.min_trade_value}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>

            {/* Berries Boosted */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Berries Boosted</label>
              <input
                name="berries_boosted"
                type="number"
                value={formData.berries_boosted}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Submit
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
