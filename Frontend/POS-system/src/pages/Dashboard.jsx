import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:9090";

// ─── API helpers ────────────────────────────────────────────────────────────
const api = {
  get: (path) => fetch(`${BASE_URL}${path}`).then((r) => r.json()).catch(() => null),
  post: (path, body) => fetch(`${BASE_URL}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()).catch(() => null),
  put: (path, body) => fetch(`${BASE_URL}${path}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()).catch(() => null),
  delete: (path) => fetch(`${BASE_URL}${path}`, { method: "DELETE" }).then((r) => r.json()).catch(() => null),
};

// ─── Mock data fallback ──────────────────────────────────────────────────────
const MOCK = {
  products: [
    { id: 1, name: "Rouge Cream Lipstick", price: 299, category: "Make-up", stock: 45, image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2b49?w=200" },
    { id: 2, name: "Absolue Revitalizing", price: 245, category: "Skincare", stock: 12, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200" },
    { id: 3, name: "La Mer Cream", price: 247, category: "Skincare", stock: 8, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200" },
    { id: 4, name: "Rénergie Lift", price: 399, category: "Anti-aging", stock: 22, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200" },
    { id: 5, name: "Flawless Poreless", price: 372, category: "Foundation", stock: 34, image: "https://images.unsplash.com/photo-1631214524020-3c69f2a09891?w=200" },
    { id: 6, name: "Skin Cream", price: 399, category: "Skincare", stock: 19, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200" },
  ],
  customers: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", orders: 12, spent: 4580 },
    { id: 2, name: "Bob Martinez", email: "bob@example.com", orders: 7, spent: 2340 },
    { id: 3, name: "Carol White", email: "carol@example.com", orders: 23, spent: 8920 },
    { id: 4, name: "David Lee", email: "david@example.com", orders: 4, spent: 1200 },
  ],
  orders: [
    { id: "ORD-001", customer: "Alice Johnson", total: 847, status: "Completed", date: "2026-03-06", items: 3 },
    { id: "ORD-002", customer: "Bob Martinez", total: 399, status: "Pending", date: "2026-03-06", items: 1 },
    { id: "ORD-003", customer: "Carol White", total: 1244, status: "Processing", date: "2026-03-05", items: 5 },
    { id: "ORD-004", customer: "David Lee", total: 245, status: "Completed", date: "2026-03-05", items: 1 },
    { id: "ORD-005", customer: "Alice Johnson", total: 671, status: "Pending", date: "2026-03-04", items: 2 },
  ],
  categories: [
    { id: 1, name: "Make-up", productCount: 24 },
    { id: 2, name: "Skincare", productCount: 18 },
    { id: 3, name: "Anti-aging", productCount: 9 },
    { id: 4, name: "Foundation", productCount: 15 },
  ],
  coupons: [
    { id: 1, code: "SAVE20", discount: "20%", uses: 142, expiry: "2026-04-30" },
    { id: 2, code: "FIRST10", discount: "10%", uses: 89, expiry: "2026-06-30" },
  ],
  payments: [
    { id: 1, orderId: "ORD-001", amount: 847, method: "Credit Card", status: "Paid", date: "2026-03-06" },
    { id: 2, orderId: "ORD-002", amount: 399, method: "Cash", status: "Pending", date: "2026-03-06" },
    { id: 3, orderId: "ORD-003", amount: 1244, method: "PayPal", status: "Processing", date: "2026-03-05" },
  ],
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    products: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    orders: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    customers: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    categories: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
    coupons: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    payments: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    cart: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    settings: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    search: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    close: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    trend_up: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    menu: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    stores: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    wishlist: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    manufacturers: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  };
  return icons[name] || <span>{name}</span>;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-100 text-emerald-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="close" size={20} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon }) => (
  <div className={`rounded-2xl p-5 ${color} flex items-center gap-4 shadow-sm`}>
    <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-white">
      <Icon name={icon} size={22} />
    </div>
    <div>
      <div className="text-white text-opacity-80 text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
      {sub && <div className="text-white text-opacity-70 text-xs">{sub}</div>}
    </div>
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = ({ data }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-2 gap-4 mb-8" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
      <StatCard label="Total Revenue" value="$24,685" sub="+12% this month" color="bg-gradient-to-br from-blue-500 to-blue-600" icon="trend_up" />
      <StatCard label="Total Orders" value={data.orders?.length || 0} sub="5 pending" color="bg-gradient-to-br from-violet-500 to-violet-600" icon="orders" />
      <StatCard label="Products" value={data.products?.length || 0} sub="2 low stock" color="bg-gradient-to-br from-emerald-500 to-emerald-600" icon="products" />
      <StatCard label="Customers" value={data.customers?.length || 0} sub="4 new today" color="bg-gradient-to-br from-amber-500 to-amber-600" icon="customers" />
    </div>

    <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-700 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {(data.orders || []).slice(0, 5).map(o => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <div className="text-sm font-semibold text-gray-700">{o.id}</div>
                <div className="text-xs text-gray-400">{o.customer}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">${o.total}</div>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-700 mb-4">Revenue by Channel</h3>
        {[
          { name: "Direct", pct: 65.6, amount: "$1,24,685", color: "bg-blue-500" },
          { name: "Organic Search", pct: 45.2, amount: "$1,24,685", color: "bg-emerald-500" },
          { name: "Referral", pct: 15.6, amount: "$1,24,685", color: "bg-amber-500" },
          { name: "Social", pct: 25.2, amount: "$1,24,685", color: "bg-violet-500" },
        ].map(c => (
          <div key={c.name} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{c.name}</span>
              <span className="font-semibold text-gray-700">{c.pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Products Page ────────────────────────────────────────────────────────────
const ProductsPage = ({ data, onRefresh }) => {
  const [modal, setModal] = useState(null); // null | 'add' | {edit: product}
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openEdit = (p) => { setForm({ name: p.name, price: p.price, category: p.category, stock: p.stock }); setModal({ edit: p }); };
  const openAdd = () => { setForm({ name: "", price: "", category: "", stock: "" }); setModal("add"); };

  const handleSubmit = async () => {
    setLoading(true);
    if (modal === "add") await api.post("/api/products", form);
    else await api.put(`/api/products/${modal.edit.id}`, form);
    setLoading(false);
    setModal(null);
    onRefresh("products");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await api.delete(`/api/products/${id}`);
      onRefresh("products");
    }
  };

  const filtered = (data.products || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
          <Icon name="plus" size={16} /> Add Product
        </button>
      </div>

      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={16} /></span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="h-40 bg-gray-100 relative overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
              <span className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-semibold text-gray-500 shadow">{p.category}</span>
            </div>
            <div className="p-4">
              <div className="font-bold text-gray-800 mb-1 truncate">{p.name}</div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-600 font-bold text-lg">${p.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.stock < 15 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>Stock: {p.stock}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 text-blue-600 border border-blue-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 transition">
                  <Icon name="edit" size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1 text-red-500 border border-red-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 transition">
                  <Icon name="trash" size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)}>
          <Field label="Product Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rouge Cream" />
          <Field label="Price ($)" name="price" value={form.price} onChange={handleChange} type="number" placeholder="299" />
          <Field label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Skincare" />
          <Field label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="50" />
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60">
            {loading ? "Saving..." : modal === "add" ? "Create Product" : "Update Product"}
          </button>
        </Modal>
      )}
    </div>
  );
};

// ─── Generic CRUD Table Page ──────────────────────────────────────────────────
const CrudPage = ({ title, endpoint, columns, formFields, data, onRefresh, keyField = "id" }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    const init = {};
    formFields.forEach(f => { init[f.name] = ""; });
    setForm(init);
    setModal("add");
  };

  const openEdit = (row) => {
    const init = {};
    formFields.forEach(f => { init[f.name] = row[f.name] || ""; });
    setForm(init);
    setModal({ edit: row });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (modal === "add") await api.post(endpoint, form);
    else await api.put(`${endpoint}/${modal.edit[keyField]}`, form);
    setLoading(false);
    setModal(null);
    onRefresh(endpoint.replace("/api/", "").replace(/-/g, "_"));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await api.delete(`${endpoint}/${id}`);
      onRefresh(endpoint.replace("/api/", "").replace(/-/g, "_"));
    }
  };

  const rows = data || [];
  const filtered = rows.filter(r =>
    columns.some(c => String(r[c.key] || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
          <Icon name="plus" size={16} /> Add New
        </button>
      </div>

      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={16} /></span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {columns.map(c => <th key={c.key} className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">{c.label}</th>)}
            <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row[keyField] || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                {columns.map(c => (
                  <td key={c.key} className="px-5 py-3 text-gray-700">
                    {c.badge ? <StatusBadge status={row[c.key]} /> : c.money ? <span className="font-semibold text-gray-800">${row[c.key]}</span> : row[c.key]}
                  </td>
                ))}
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(row)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Icon name="edit" size={15} /></button>
                    <button onClick={() => handleDelete(row[keyField])} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-gray-400">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "add" ? `Add ${title}` : `Edit ${title}`} onClose={() => setModal(null)}>
          {formFields.map(f => (
            <Field key={f.name} label={f.label} name={f.name} value={form[f.name] || ""} onChange={handleChange} type={f.type} placeholder={f.placeholder} />
          ))}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60">
            {loading ? "Saving..." : modal === "add" ? "Create" : "Update"}
          </button>
        </Modal>
      )}
    </div>
  );
};

// ─── POS Page ─────────────────────────────────────────────────────────────────
const POSPage = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [search, setSearch] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (p) => {
    setCart(c => {
      const existing = c.find(i => i.id === p.id);
      if (existing) return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * (discount / 100);
  const total = subtotal - discountAmt;

  const applyCoupon = () => {
    if (coupon === "SAVE20") setDiscount(20);
    else if (coupon === "FIRST10") setDiscount(10);
    else alert("Invalid coupon");
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    await api.post("/api/pending-orders", { items: cart, total, coupon });
    setOrderPlaced(true);
    setTimeout(() => { setCart([]); setCoupon(""); setDiscount(0); setOrderPlaced(false); }, 2500);
  };

  const filtered = (products || []).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex gap-6 h-full">
      {/* Product Grid */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Point of Sale</h2>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => addToCart(p)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-left hover:border-blue-300 hover:shadow-md transition group">
              <div className="h-28 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div className="text-sm font-semibold text-gray-700 truncate">{p.name}</div>
              <div className="text-blue-600 font-bold">${p.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Icon name="cart" size={18} /> Cart ({cart.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && <p className="text-gray-400 text-sm text-center mt-8">Cart is empty</p>}
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-700 truncate">{item.name}</div>
                <div className="text-blue-600 text-xs font-bold">${item.price}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 bg-gray-100 rounded text-gray-600 text-xs font-bold hover:bg-gray-200 transition">−</button>
                <span className="text-xs w-5 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 bg-gray-100 rounded text-gray-600 text-xs font-bold hover:bg-gray-200 transition">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex gap-2">
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button onClick={applyCoupon} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold transition">Apply</button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount ({discount}%)</span><span>−${discountAmt.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button onClick={placeOrder}
            className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${orderPlaced ? "bg-emerald-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {orderPlaced ? <><Icon name="check" size={16} /> Order Placed!</> : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState({
    products: MOCK.products,
    customers: MOCK.customers,
    orders: MOCK.orders,
    categories: MOCK.categories,
    coupons: MOCK.coupons,
    payments: MOCK.payments,
    stores: [{ id: 1, name: "Main Store", location: "Phnom Penh" }],
    wishlist: [],
    manufacturers: [{ id: 1, name: "L'Oréal", country: "France" }],
  });

  const fetchData = async (key, endpoint) => {
    const result = await api.get(endpoint);
    if (result) setData(d => ({ ...d, [key]: result }));
  };

  useEffect(() => {
    fetchData("products", "/api/products");
    fetchData("customers", "/api/customers");
    fetchData("orders", "/api/customer-orders");
    fetchData("categories", "/api/categories");
    fetchData("coupons", "/api/coupons");
    fetchData("payments", "/api/payments");
  }, []);

  const onRefresh = (key) => {
    const endpointMap = {
      products: "/api/products",
      customers: "/api/customers",
      orders: "/api/customer-orders",
      categories: "/api/categories",
      coupons: "/api/coupons",
      payments: "/api/payments",
    };
    if (endpointMap[key]) fetchData(key, endpointMap[key]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "pos", label: "POS", icon: "cart" },
    { id: "products", label: "Products", icon: "products" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "customers", label: "Customers", icon: "customers" },
    { id: "categories", label: "Categories", icon: "categories" },
    { id: "coupons", label: "Coupons", icon: "coupons" },
    { id: "payments", label: "Payments", icon: "payments" },
    { id: "manufacturers", label: "Manufacturers", icon: "manufacturers" },
    { id: "stores", label: "Stores", icon: "stores" },
    { id: "wishlist", label: "Wishlist", icon: "wishlist" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage data={data} />;
      case "pos": return <POSPage products={data.products} />;
      case "products": return <ProductsPage data={data} onRefresh={onRefresh} />;
      case "orders": return <CrudPage title="Orders" endpoint="/api/customer-orders" data={data.orders}
        columns={[{ key: "id", label: "Order ID" }, { key: "customer", label: "Customer" }, { key: "total", label: "Total", money: true }, { key: "status", label: "Status", badge: true }, { key: "date", label: "Date" }, { key: "items", label: "Items" }]}
        formFields={[{ name: "customer", label: "Customer", placeholder: "Customer name" }, { name: "total", label: "Total", type: "number", placeholder: "0.00" }, { name: "status", label: "Status", placeholder: "Pending" }]}
        onRefresh={onRefresh} />;
      case "customers": return <CrudPage title="Customers" endpoint="/api/customers" data={data.customers}
        columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "orders", label: "Orders" }, { key: "spent", label: "Spent", money: true }]}
        formFields={[{ name: "name", label: "Full Name", placeholder: "Jane Doe" }, { name: "email", label: "Email", type: "email", placeholder: "jane@example.com" }]}
        onRefresh={onRefresh} />;
      case "categories": return <CrudPage title="Categories" endpoint="/api/categories" data={data.categories}
        columns={[{ key: "id", label: "ID" }, { key: "name", label: "Category Name" }, { key: "productCount", label: "Products" }]}
        formFields={[{ name: "name", label: "Category Name", placeholder: "Skincare" }]}
        onRefresh={onRefresh} />;
      case "coupons": return <CrudPage title="Coupons" endpoint="/api/coupons" data={data.coupons}
        columns={[{ key: "id", label: "ID" }, { key: "code", label: "Code" }, { key: "discount", label: "Discount" }, { key: "uses", label: "Uses" }, { key: "expiry", label: "Expiry" }]}
        formFields={[{ name: "code", label: "Coupon Code", placeholder: "SAVE20" }, { name: "discount", label: "Discount", placeholder: "20%" }, { name: "expiry", label: "Expiry Date", type: "date" }]}
        onRefresh={onRefresh} />;
      case "payments": return <CrudPage title="Payments" endpoint="/api/payments" data={data.payments}
        columns={[{ key: "id", label: "ID" }, { key: "orderId", label: "Order" }, { key: "amount", label: "Amount", money: true }, { key: "method", label: "Method" }, { key: "status", label: "Status", badge: true }, { key: "date", label: "Date" }]}
        formFields={[{ name: "orderId", label: "Order ID", placeholder: "ORD-001" }, { name: "amount", label: "Amount", type: "number" }, { name: "method", label: "Method", placeholder: "Credit Card" }, { name: "status", label: "Status", placeholder: "Paid" }]}
        onRefresh={onRefresh} />;
      case "manufacturers": return <CrudPage title="Manufacturers" endpoint="/api/manufacturers" data={data.manufacturers}
        columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "country", label: "Country" }]}
        formFields={[{ name: "name", label: "Manufacturer Name", placeholder: "L'Oréal" }, { name: "country", label: "Country", placeholder: "France" }]}
        onRefresh={onRefresh} />;
      case "stores": return <CrudPage title="Stores" endpoint="/api/stores" data={data.stores}
        columns={[{ key: "id", label: "ID" }, { key: "name", label: "Store Name" }, { key: "location", label: "Location" }]}
        formFields={[{ name: "name", label: "Store Name", placeholder: "Main Store" }, { name: "location", label: "Location", placeholder: "Phnom Penh" }]}
        onRefresh={onRefresh} />;
      case "wishlist": return <CrudPage title="Wishlist" endpoint="/api/wishlist" data={data.wishlist}
        columns={[{ key: "id", label: "ID" }, { key: "product", label: "Product" }, { key: "customer", label: "Customer" }]}
        formFields={[{ name: "product", label: "Product", placeholder: "Product name" }, { name: "customer", label: "Customer", placeholder: "Customer name" }]}
        onRefresh={onRefresh} />;
      case "settings": return (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
            <h3 className="font-bold text-gray-700 mb-4">API Configuration</h3>
            <Field label="Base URL" name="url" value="http://localhost:9090" onChange={() => {}} />
            <Field label="App Name" name="app" value="CommerceHQ Dashboard" onChange={() => {}} />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">Save Settings</button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-56" : "w-16"} bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-200 flex-shrink-0`}>
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
          {sidebarOpen && <span className="font-bold text-gray-800 text-sm">CommerceHQ</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${page === item.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
              <span className="flex-shrink-0"><Icon name={item.icon} size={18} /></span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          {sidebarOpen && <div className="bg-blue-50 rounded-xl p-3 text-center mb-2">
            <div className="text-xs text-blue-600 font-semibold">Pro Plan</div>
            <div className="text-xs text-gray-500 mt-1">All features unlocked</div>
          </div>}
          <button onClick={() => setSidebarOpen(o => !o)} className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={16} /></span>
            <input placeholder="Search anything..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <div className="text-sm">
              <div className="font-semibold text-gray-700">Admin</div>
              <div className="text-gray-400 text-xs">admin@commercehq.com</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
