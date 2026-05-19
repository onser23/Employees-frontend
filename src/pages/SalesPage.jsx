import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Trash2,
  Pencil,
  X,
  Calendar,
  DollarSign,
  User,
  ArrowRightLeft,
  Save,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { salesAPI } from "../services/api";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    buyer: "",
    seller: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    currency: "AZN",
    buyer: "",
    seller: "",
    description: "",
  });

  const currencies = ["AZN", "USD", "EUR", "TRY", "RUB"];

  useEffect(() => {
    fetchSales();
    fetchSellers();
    fetchBuyers();
  }, []);

  const fetchSales = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll(filterParams);
      setSales(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error("Satışları yükləyərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await salesAPI.getSellers();
      setSellers(response.data.data);
    } catch (error) {
      console.error("Satıcıları yükləyərkən xəta:", error);
    }
  };

  const fetchBuyers = async () => {
    try {
      const response = await salesAPI.getBuyers();
      setBuyers(response.data.data);
    } catch (error) {
      console.error("Alıcıları yükləyərkən xəta:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.buyer) params.buyer = filters.buyer;
    if (filters.seller) params.seller = filters.seller;

    fetchSales(params);
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      buyer: "",
      seller: "",
    });
    fetchSales();
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Tarix tələb olunur");
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Məbləğ tələb olunur");
      return false;
    }
    if (!formData.buyer.trim()) {
      toast.error("Alıcı tələb olunur");
      return false;
    }
    if (!formData.seller.trim()) {
      toast.error("Satıcı tələb olunur");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingSale) {
        await salesAPI.update(editingSale._id, formData);
        toast.success("Satış uğurla yeniləndi!");
      } else {
        await salesAPI.create(formData);
        toast.success("Satış uğurla əlavə edildi!");
      }
      setShowForm(false);
      setEditingSale(null);
      resetForm();
      fetchSales();
    } catch (error) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      date: sale.date.split("T")[0],
      amount: sale.amount,
      currency: sale.currency,
      buyer: sale.buyer,
      seller: sale.seller,
      description: sale.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu satışı silmək istədiyinizə əminsiniz?")) return;

    try {
      await salesAPI.delete(id);
      toast.success("Satış uğurla silindi!");
      fetchSales();
    } catch (error) {
      toast.error("Silinərkən xəta baş verdi");
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      amount: "",
      currency: "AZN",
      buyer: "",
      seller: "",
      description: "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSale(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("az-AZ");
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("az-AZ").format(amount) + " " + currency;
  };

  // Ümumi məbləğ hesabla
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <div className="space-y-6">
      {/* ... Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Satışlar</h2>
            <p className="text-sm text-gray-500">
              {sales.length} satış | Ümumi: {formatAmount(totalAmount, "AZN")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Satış</span>
            </button>
          )}
        </div>
      </div>
      {/* Filters - YENILENMIS */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Başlanğıc tarix
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Son tarix
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {/* ✅ YENI: Alıcı dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Alıcı
              </label>
              <div className="relative">
                <select
                  name="buyer"
                  value={filters.buyer}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                >
                  <option value="">Bütün alıcılar</option>
                  {buyers.map((buyer, index) => (
                    <option key={index} value={buyer}>
                      {buyer}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            {/* Satıcı dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Satıcı
              </label>
              <div className="relative">
                <select
                  name="seller"
                  value={filters.seller}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                >
                  <option value="">Bütün satıcılar</option>
                  {sellers.map((seller, index) => (
                    <option key={index} value={seller}>
                      {seller}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Axtar
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Təmizlə
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingSale ? "Satışı Redaktə Et" : "Yeni Satış Əlavə Et"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarix *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Məbləğ *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleFormChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valyuta *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alıcı *
              </label>
              <input
                type="text"
                name="buyer"
                value={formData.buyer}
                onChange={handleFormChange}
                placeholder="Alıcı adı"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satıcı *
              </label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleFormChange}
                placeholder="Satıcı adı"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıqlama
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Əlavə məlumat..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Ləğv Et
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingSale ? "Yenilə" : "Əlavə Et"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Tarix
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Alıcı
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Satıcı
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Məbləğ
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Valyuta
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(sale.date)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      {sale.buyer}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-green-400" />
                      {sale.seller}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-right font-medium">
                    {formatAmount(sale.amount, sale.currency)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {sale.currency}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sales.map((sale) => (
          <div
            key={sale._id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(sale.date)}
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                {sale.currency}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Alıcı:</span>
                <span className="text-sm font-medium text-gray-800">
                  {sale.buyer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Satıcı:</span>
                <span className="text-sm font-medium text-gray-800">
                  {sale.seller}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Məbləğ:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatAmount(sale.amount, sale.currency)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleEdit(sale)}
                className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Redaktə
              </button>
              <button
                onClick={() => handleDelete(sale._id)}
                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sales.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">Satış tapılmadı</h3>
          <p className="text-gray-400 text-sm mt-1">
            Yeni satış əlavə etmək üçün "Yeni Satış" düyməsinə klik edin
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
