import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const C = {
  navy:    "#0f172a",
  navyMid: "#1e293b",
  slate:   "#334155",
  muted:   "#64748b",
  border:  "#e2e8f0",
  bg:      "#f8fafc",
  white:   "#ffffff",
  blue:    "#2563eb",
  blueLt:  "#dbeafe",
  emerald: "#059669",
  emerLt:  "#d1fae5",
  amber:   "#d97706",
  ambLt:   "#fef3c7",
  red:     "#dc2626",
  redLt:   "#fee2e2",
  violet:  "#7c3aed",
  violLt:  "#ede9fe",
};

const gradients = {
  blue:    "linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",
  violet:  "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)",
  emerald: "linear-gradient(135deg,#059669 0%,#047857 100%)",
  amber:   "linear-gradient(135deg,#d97706 0%,#b45309 100%)",
  rose:    "linear-gradient(135deg,#e11d48 0%,#be123c 100%)",
  teal:    "linear-gradient(135deg,#0891b2 0%,#0e7490 100%)",
};

/* ─── API ─────────────────────────────────── */
const BASE = "http://localhost:9090";
const api = {
  get:    (p)    => fetch(`${BASE}${p}`).then(r=>r.json()).catch(()=>null),
  post:   (p,b)  => fetch(`${BASE}${p}`,{method:"POST",  headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json()).catch(()=>null),
  put:    (p,b)  => fetch(`${BASE}${p}`,{method:"PUT",   headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json()).catch(()=>null),
  delete: (p)    => fetch(`${BASE}${p}`,{method:"DELETE"}).then(r=>r.json()).catch(()=>null),
};

const MOCK = {
  products: [
    { id:1, name:"Rouge Cream Lipstick",  price:299, category:"Make-up",    stock:45, image:"https://images.unsplash.com/photo-1586495777744-4e6232bf2b49?w=300" },
    { id:2, name:"Absolue Revitalizing",  price:245, category:"Skincare",   stock:12, image:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300" },
    { id:3, name:"La Mer Cream",          price:247, category:"Skincare",   stock:8,  image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300" },
    { id:4, name:"Rénergie Lift",         price:399, category:"Anti-aging", stock:22, image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300" },
    { id:5, name:"Flawless Poreless",     price:372, category:"Foundation", stock:34, image:"https://images.unsplash.com/photo-1631214524020-3c69f2a09891?w=300" },
    { id:6, name:"Skin Cream Luxe",       price:399, category:"Skincare",   stock:19, image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300" },
  ],
  customers: [
    { id:1, name:"Alice Johnson", email:"alice@example.com", orders:12, spent:4580 },
    { id:2, name:"Bob Martinez",  email:"bob@example.com",   orders:7,  spent:2340 },
    { id:3, name:"Carol White",   email:"carol@example.com", orders:23, spent:8920 },
    { id:4, name:"David Lee",     email:"david@example.com", orders:4,  spent:1200 },
  ],
  orders: [
    { id:"ORD-001", customer:"Alice Johnson", total:847,  status:"Completed",  date:"2026-03-06", items:3 },
    { id:"ORD-002", customer:"Bob Martinez",  total:399,  status:"Pending",    date:"2026-03-06", items:1 },
    { id:"ORD-003", customer:"Carol White",   total:1244, status:"Processing", date:"2026-03-05", items:5 },
    { id:"ORD-004", customer:"David Lee",     total:245,  status:"Completed",  date:"2026-03-05", items:1 },
    { id:"ORD-005", customer:"Alice Johnson", total:671,  status:"Pending",    date:"2026-03-04", items:2 },
  ],
  categories:    [{ id:1,name:"Make-up",productCount:24 },{ id:2,name:"Skincare",productCount:18 },{ id:3,name:"Anti-aging",productCount:9 },{ id:4,name:"Foundation",productCount:15 }],
  coupons:       [{ id:1,coupon_code:"SUMMER2026",coupon_price:15,coupon_limit:100,coupon_used:0,coupon_title:"Summer Flash Sale",product_id:55 },{ id:2,coupon_code:"SAVE20",coupon_price:20,coupon_limit:50,coupon_used:5,coupon_title:"Save 20",product_id:null }],
  payments:      [{ id:1,orderId:"ORD-001",amount:847, method:"Credit Card",status:"Paid",      date:"2026-03-06" },{ id:2,orderId:"ORD-002",amount:399, method:"Cash",       status:"Pending",   date:"2026-03-06" },{ id:3,orderId:"ORD-003",amount:1244,method:"PayPal",     status:"Processing",date:"2026-03-05" }],
  stores:        [{ id:1,name:"Main Store",location:"Phnom Penh" }],
  wishlist:      [],
  manufacturers: [{ id:1,name:"L'Oréal",country:"France" }],
};

const revenueData = [
  {month:"Jan",revenue:4200,orders:38},{month:"Feb",revenue:5800,orders:52},
  {month:"Mar",revenue:4900,orders:44},{month:"Apr",revenue:7200,orders:68},
  {month:"May",revenue:6100,orders:57},{month:"Jun",revenue:8400,orders:79},
  {month:"Jul",revenue:9100,orders:88},{month:"Aug",revenue:7600,orders:71},
  {month:"Sep",revenue:10200,orders:95},{month:"Oct",revenue:9400,orders:87},
  {month:"Nov",revenue:11800,orders:112},{month:"Dec",revenue:13200,orders:124},
];
const weeklyData = [
  {day:"Mon",sales:1200},{day:"Tue",sales:1900},{day:"Wed",sales:1500},
  {day:"Thu",sales:2400},{day:"Fri",sales:2100},{day:"Sat",sales:3200},{day:"Sun",sales:1800},
];
const channelData = [
  {name:"Direct",value:65.6,color:"#2563eb"},{name:"Organic",value:45.2,color:"#059669"},
  {name:"Referral",value:15.6,color:"#d97706"},{name:"Social",value:25.2,color:"#7c3aed"},
];

/* ─── Shared UI Atoms ─────────────────────── */
const Icon = ({ name, size=20 }) => {
  const icons = {
    dashboard:     <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    products:      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    orders:        <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    customers:     <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    categories:    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
    coupons:       <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    payments:      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    cart:          <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    settings:      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    search:        <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    plus:          <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit:          <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:         <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    close:         <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check:         <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    menu:          <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    stores:        <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    wishlist:      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    manufacturers: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    trend_up:      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    tag:           <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  };
  return icons[name] || <span style={{fontSize:size/2}}>{name}</span>;
};

const StatusBadge = ({ status }) => {
  const map = {
    Completed:  {bg:C.emerLt, color:C.emerald},
    Paid:       {bg:C.emerLt, color:C.emerald},
    Pending:    {bg:C.ambLt,  color:C.amber},
    Processing: {bg:C.blueLt, color:C.blue},
    Cancelled:  {bg:C.redLt,  color:C.red},
    DELIVERED:  {bg:C.emerLt, color:C.emerald},
    PENDING:    {bg:C.ambLt,  color:C.amber},
    CANCELLED:  {bg:C.redLt,  color:C.red},
    PROCESSING: {bg:C.blueLt, color:C.blue},
  };
  const s = map[(status||"").toUpperCase()] || map[(status||"")] || {bg:"#f1f5f9",color:C.muted};
  return (
    <span style={{background:s.bg,color:s.color,padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:700,letterSpacing:"0.02em",whiteSpace:"nowrap"}}>
      {status}
    </span>
  );
};

const Card = ({ title, subtitle, children, action, style={} }) => (
  <div style={{background:C.white,borderRadius:18,boxShadow:"0 2px 20px rgba(15,23,42,0.06)",border:`1px solid ${C.border}`,padding:"22px 24px",...style}}>
    {(title||action) && (
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          {title && <div style={{fontWeight:700,color:C.navy,fontSize:15}}>{title}</div>}
          {subtitle && <div style={{color:C.muted,fontSize:12,marginTop:2}}>{subtitle}</div>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({ label, value, sub, gradient, icon, trend }) => (
  <div style={{background:gradient,borderRadius:18,padding:"22px 24px",color:"#fff",position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.15)"}}>
    <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
    <div style={{position:"absolute",right:20,bottom:-30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative"}}>
      <div>
        <div style={{fontSize:12,opacity:.8,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
        <div style={{fontSize:30,fontWeight:800,lineHeight:1,marginBottom:6}}>{value}</div>
        <div style={{fontSize:12,opacity:.75}}>{sub}</div>
      </div>
      <div style={{width:46,height:46,background:"rgba(255,255,255,0.2)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon name={icon} size={22}/>
      </div>
    </div>
  </div>
);

const Modal = ({ title, onClose, children, wide=false }) => (
  <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(15,23,42,0.5)",backdropFilter:"blur(4px)"}}>
    <div style={{background:C.white,borderRadius:24,boxShadow:"0 24px 80px rgba(15,23,42,0.25)",width:"100%",maxWidth:wide?640:480,margin:"0 16px",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 28px",borderBottom:`1px solid ${C.border}`}}>
        <h3 style={{fontSize:18,fontWeight:800,color:C.navy,margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:10,padding:8,cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseOver={e=>e.currentTarget.style.background=C.border} onMouseOut={e=>e.currentTarget.style.background=C.bg}>
          <Icon name="close" size={18}/>
        </button>
      </div>
      <div style={{padding:"24px 28px",overflowY:"auto",flex:1}}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, name, value, onChange, type="text", placeholder, options }) => (
  <div style={{marginBottom:18}}>
    <label style={{display:"block",fontSize:13,fontWeight:600,color:C.slate,marginBottom:6}}>{label}</label>
    {options ? (
      <select name={name} value={value} onChange={onChange}
        style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontSize:14,color:C.navy,background:C.white,outline:"none",cursor:"pointer"}}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontSize:14,color:C.navy,background:C.white,outline:"none",boxSizing:"border-box",transition:"border-color .2s"}}
        onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}
      />
    )}
  </div>
);

const Btn = ({ children, onClick, variant="primary", disabled=false, size="md", style={} }) => {
  const variants = {
    primary: {background:gradients.blue,color:"#fff",border:"none"},
    danger:  {background:"none",color:C.red,border:`1.5px solid ${C.redLt}`},
    ghost:   {background:"none",color:C.blue,border:`1.5px solid ${C.blueLt}`},
    success: {background:gradients.emerald,color:"#fff",border:"none"},
  };
  const sizes = { sm:"6px 14px", md:"10px 22px", lg:"14px 32px" };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      style={{...v,padding:sizes[size],borderRadius:12,fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.6:1,display:"inline-flex",alignItems:"center",gap:6,transition:"opacity .2s,transform .1s",...style}}
      onMouseOver={e=>{if(!disabled)e.currentTarget.style.opacity=".85"}} onMouseOut={e=>{e.currentTarget.style.opacity="1"}}
    >{children}</button>
  );
};

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{position:"relative",marginBottom:20}}>
    <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,display:"flex"}}><Icon name="search" size={16}/></span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Search..."}
      style={{width:"100%",paddingLeft:42,paddingRight:16,paddingTop:10,paddingBottom:10,border:`1.5px solid ${C.border}`,borderRadius:14,fontSize:14,color:C.navy,background:C.white,outline:"none",boxSizing:"border-box",transition:"border-color .2s"}}
      onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}
    />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:C.navyMid,color:"#fff",borderRadius:12,padding:"10px 16px",fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,0.25)"}}>
      <div style={{fontWeight:700,marginBottom:4,color:"#94a3b8"}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:"#fff"}}>
          <span style={{color:p.color||"#94a3b8"}}>{p.name}</span>: <strong>{p.name==="revenue"?`$${Number(p.value).toLocaleString()}`:p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─── DASHBOARD PAGE ──────────────────────── */
const DashboardPage = ({ data }) => {
  const orders    = data.orders    || [];
  const products  = data.products  || [];
  const customers = data.customers || [];

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <h2 style={{fontSize:26,fontWeight:800,color:C.navy,margin:0,letterSpacing:"-0.5px"}}>Dashboard Overview</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:4}}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
          </p>
        </div>
        <div style={{background:gradients.blue,color:"#fff",borderRadius:12,padding:"9px 20px",fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(37,99,235,0.3)"}}>
          ↑ 12% vs last month
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:24}}>
        <StatCard label="Total Revenue" value="$24,685"              sub="↑ 12% this month"  gradient={gradients.blue}    icon="trend_up"  />
        <StatCard label="Total Orders"  value={orders.length||142}   sub="5 pending"         gradient={gradients.violet}  icon="orders"    />
        <StatCard label="Products"      value={products.length||86}  sub="2 low stock"       gradient={gradients.emerald} icon="products"  />
        <StatCard label="Customers"     value={customers.length||318}sub="4 new today"       gradient={gradients.amber}   icon="customers" />
      </div>

      {/* Row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <Card title="Revenue Overview" subtitle="Monthly revenue — 2024">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData} margin={{top:5,right:10,left:-10,bottom:0}}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.blue} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="revenue" name="revenue" stroke={C.blue} strokeWidth={2.5} fill="url(#revG)" dot={false} activeDot={{r:5,fill:C.blue}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Weekly Sales" subtitle="This week">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={weeklyData} margin={{top:5,right:5,left:-22,bottom:0}} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="sales" name="sales" radius={[8,8,0,0]}>
                {weeklyData.map((_,i)=><Cell key={i} fill={i===5?C.blue:C.blueLt}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.5fr",gap:18}}>
        <Card title="Orders Trend" subtitle="Monthly order volume">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={revenueData} margin={{top:5,right:10,left:-22,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="orders" name="orders" stroke={C.violet} strokeWidth={2.5} dot={false} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue by Channel">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="44%" innerRadius={50} outerRadius={74} dataKey="value" paddingAngle={3}>
                {channelData.map((c,i)=><Cell key={i} fill={c.color}/>)}
              </Pie>
              <Tooltip formatter={v=>`${v}%`}/>
              <Legend iconType="circle" iconSize={8} formatter={v=><span style={{fontSize:11,color:C.muted}}>{v}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recent Orders" subtitle="Last 5 orders">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["ID","Customer","Total","Status"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"0 8px 10px",color:C.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders.length?orders:MOCK.orders).slice(0,5).map((o,i)=>(
                <tr key={o.id||i} style={{borderBottom:`1px solid ${C.bg}`}}>
                  <td style={{padding:"9px 8px",color:C.blue,fontWeight:700,fontSize:12}}>{o.id}</td>
                  <td style={{padding:"9px 8px",color:C.slate,fontSize:13}}>{o.customer}</td>
                  <td style={{padding:"9px 8px",fontWeight:700,color:C.navy}}>${o.total}</td>
                  <td style={{padding:"9px 8px"}}><StatusBadge status={o.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

/* ─── PRODUCTS PAGE ───────────────────────── */
const ProductsPage = ({ data, onRefresh }) => {
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({name:"",price:"",category:"",stock:"",image:""});
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState("");
  const [products,setProducts]= useState(data?.products||[]);
  const [imgPreview, setImgPreview] = useState("");

  useEffect(()=>{ setProducts(data?.products||[]); },[data?.products]);

  const onChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const onImageChange = e => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImgPreview(ev.target.result);
      setForm(f=>({...f, image: ev.target.result}));
    };
    reader.readAsDataURL(file);
  };

  const openAdd  = () => {
    setForm({name:"",price:"",category:"",stock:"",image:""});
    setImgPreview("");
    setModal("add");
  };
  const openEdit = p => {
    setForm({name:p.name,price:p.price,category:p.category,stock:p.stock,image:p.image||""});
    setImgPreview(p.image||"");
    setModal({edit:p});
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    if(modal==="add") await api.post("/api/products", payload);
    else              await api.put(`/api/products/${modal.edit.id}`, payload);
    setLoading(false); setModal(null); onRefresh("products");
  };

  const handleDelete = async id => {
    if(window.confirm("Delete this product?")){ await api.delete(`/api/products/${id}`); onRefresh("products"); }
  };

  const filtered = products.filter(p=>(p?.name||"").toLowerCase().includes(search.toLowerCase()));

  // Fix: parse as Number to handle string values from API
  const totalValue = products.reduce((s,p)=>s+(Number(p.price)||0)*(Number(p.stock)||0),0);
  const lowStock   = products.filter(p=>Number(p.stock)<15).length;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>Products</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:3}}>{products.length} total products</p>
        </div>
        <Btn onClick={openAdd}><Icon name="plus" size={16}/>Add Product</Btn>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        <Card style={{padding:"18px 22px"}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Total Products</div>
          <div style={{fontSize:28,fontWeight:800,color:C.navy}}>{products.length}</div>
        </Card>
        <Card style={{padding:"18px 22px"}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Inventory Value</div>
          <div style={{fontSize:28,fontWeight:800,color:C.emerald}}>${totalValue.toLocaleString()}</div>
        </Card>
        <Card style={{padding:"18px 22px"}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Low Stock Alert</div>
          <div style={{fontSize:28,fontWeight:800,color:lowStock>0?C.red:C.emerald}}>{lowStock} items</div>
        </Card>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search products..."/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {filtered.map((p, idx)=>(
          <Card key={p.id ?? idx} style={{padding:0,overflow:"hidden"}}>
            <div style={{height:160,background:"#f1f5f9",overflow:"hidden",position:"relative"}}>
              <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
              <span style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.95)",color:C.slate,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,backdropFilter:"blur(4px)"}}>{p.category}</span>
              {Number(p.stock)<15 && <span style={{position:"absolute",top:10,left:10,background:C.red,color:"#fff",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>Low Stock</span>}
            </div>
            <div style={{padding:"16px 18px"}}>
              <div style={{fontWeight:700,color:C.navy,marginBottom:4,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:22,fontWeight:800,color:C.blue}}>${Number(p.price).toFixed(2)}</span>
                <span style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:20,background:Number(p.stock)<15?C.redLt:C.emerLt,color:Number(p.stock)<15?C.red:C.emerald}}>
                  Stock: {p.stock}
                </span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openEdit(p)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.blue,border:`1.5px solid ${C.blueLt}`,borderRadius:10,padding:"7px 0",fontSize:12,fontWeight:700,background:"none",cursor:"pointer",transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=C.blueLt} onMouseOut={e=>e.currentTarget.style.background="none"}>
                  <Icon name="edit" size={13}/> Edit
                </button>
                <button onClick={()=>handleDelete(p.id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.red,border:`1.5px solid ${C.redLt}`,borderRadius:10,padding:"7px 0",fontSize:12,fontWeight:700,background:"none",cursor:"pointer",transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=C.redLt} onMouseOut={e=>e.currentTarget.style.background="none"}>
                  <Icon name="trash" size={13}/> Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add Product":"Edit Product"} onClose={()=>setModal(null)}>
          <Field label="Product Name" name="name"     value={form.name}     onChange={onChange} placeholder="e.g. Rouge Cream"/>
          <Field label="Price ($)"    name="price"    value={form.price}    onChange={onChange} type="number" placeholder="299"/>
          <Field label="Category"     name="category" value={form.category} onChange={onChange} placeholder="Skincare"/>
          <Field label="Stock"        name="stock"    value={form.stock}    onChange={onChange} type="number" placeholder="50"/>

          {/* Image Upload */}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:700,color:C.slate,marginBottom:6}}>Product Image</label>

            {/* Preview */}
            {imgPreview && (
              <div style={{width:"100%",height:160,borderRadius:12,overflow:"hidden",marginBottom:10,background:"#f1f5f9",border:`1.5px solid ${C.border}`}}>
                <img src={imgPreview} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            )}

            {/* Upload button */}
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"10px 0",borderRadius:10,border:`2px dashed ${C.border}`,cursor:"pointer",fontSize:13,fontWeight:600,color:C.slate,background:C.bg,boxSizing:"border-box",transition:"border-color .2s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.blue}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.border}
            >
              <Icon name="upload" size={15}/>
              {imgPreview ? "Change Image" : "Upload Image"}
              <input type="file" accept="image/*" onChange={onImageChange} style={{display:"none"}}/>
            </label>
          </div>

          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",justifyContent:"center",marginTop:4}}>
            {loading?"Saving...":modal==="add"?"Create Product":"Update Product"}
          </Btn>
        </Modal>
      )}
    </div>
  );
};

/* ─── COUPONS PAGE ────────────────────────── */
const CouponsPage = ({ data, onRefresh }) => {
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({coupon_code:"",coupon_price:"",coupon_limit:"",coupon_title:"",coupon_used:"0"});
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState("");

  const coupons = data?.coupons || [];
  const onChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const openAdd  = () => { setForm({coupon_code:"",coupon_price:"",coupon_limit:"100",coupon_title:"",coupon_used:"0"}); setModal("add"); };
  const openEdit = c  => { setForm({coupon_code:c.coupon_code||c.code||"",coupon_price:c.coupon_price||c.discount||"",coupon_limit:c.coupon_limit||"",coupon_title:c.coupon_title||"",coupon_used:c.coupon_used||c.uses||"0"}); setModal({edit:c}); };

  const handleSubmit = async () => {
    setLoading(true);
    if(modal==="add") await api.post("/api/coupons",form);
    else              await api.put(`/api/coupons/${modal.edit.id}`,form);
    setLoading(false); setModal(null); onRefresh("coupons");
  };
  const handleDelete = async id => {
    if(window.confirm("Delete this coupon?")){ await api.delete(`/api/coupons/${id}`); onRefresh("coupons"); }
  };

  const filtered = coupons.filter(c=>
    (c.coupon_code||c.code||"").toLowerCase().includes(search.toLowerCase()) ||
    (c.coupon_title||"").toLowerCase().includes(search.toLowerCase())
  );

  const totalUses  = coupons.reduce((s,c)=>s+(c.coupon_used||c.uses||0),0);
  const activeCoup = coupons.filter(c=>(c.coupon_used||c.uses||0)<(c.coupon_limit||100)).length;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>Coupons</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:3}}>{coupons.length} total coupons</p>
        </div>
        <Btn onClick={openAdd}><Icon name="plus" size={16}/>Add New</Btn>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.blue}`}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Total Coupons</div>
          <div style={{fontSize:28,fontWeight:800,color:C.navy}}>{coupons.length}</div>
        </Card>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.emerald}`}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Active Coupons</div>
          <div style={{fontSize:28,fontWeight:800,color:C.emerald}}>{activeCoup}</div>
        </Card>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.violet}`}}>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Total Uses</div>
          <div style={{fontSize:28,fontWeight:800,color:C.violet}}>{totalUses}</div>
        </Card>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search coupons..."/>

      {/* Coupon cards grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {filtered.map(c=>{
          const code   = c.coupon_code  || c.code     || "—";
          const title  = c.coupon_title || code;
          const price  = c.coupon_price || c.discount || "—";
          const limit  = c.coupon_limit || 100;
          const used   = c.coupon_used  || c.uses     || 0;
          const pct    = Math.min(100,Math.round((used/limit)*100));
          const active = used < limit;
          return (
            <Card key={c.id} style={{position:"relative",overflow:"hidden"}}>
              {/* decorative stripe */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:active?gradients.blue:gradients.rose}}/>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,paddingTop:8}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,background:active?C.emerLt:C.redLt,color:active?C.emerald:C.red}}>
                      {active?"ACTIVE":"EXPIRED"}
                    </span>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:C.navy,letterSpacing:"0.05em",fontFamily:"monospace"}}>{code}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:2}}>{title}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:800,color:C.blue}}>${price}</div>
                  <div style={{fontSize:11,color:C.muted}}>discount</div>
                </div>
              </div>

              {/* Usage progress */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginBottom:6}}>
                  <span>Usage</span>
                  <span style={{fontWeight:700,color:C.navy}}>{used} / {limit}</span>
                </div>
                <div style={{background:C.bg,borderRadius:99,height:7,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:pct>80?gradients.rose:gradients.blue,borderRadius:99,transition:"width .4s"}}/>
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:4}}>{pct}% used</div>
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openEdit(c)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,color:C.blue,border:`1.5px solid ${C.blueLt}`,borderRadius:10,padding:"7px 0",fontSize:12,fontWeight:700,background:"none",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background=C.blueLt} onMouseOut={e=>e.currentTarget.style.background="none"}>
                  <Icon name="edit" size={13}/> Edit
                </button>
                <button onClick={()=>handleDelete(c.id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,color:C.red,border:`1.5px solid ${C.redLt}`,borderRadius:10,padding:"7px 0",fontSize:12,fontWeight:700,background:"none",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background=C.redLt} onMouseOut={e=>e.currentTarget.style.background="none"}>
                  <Icon name="trash" size={13}/> Delete
                </button>
              </div>
            </Card>
          );
        })}
        {filtered.length===0 && (
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:C.muted}}>No coupons found</div>
        )}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add Coupon":"Edit Coupon"} onClose={()=>setModal(null)}>
          <Field label="Coupon Code"  name="coupon_code"  value={form.coupon_code}  onChange={onChange} placeholder="SUMMER2026"/>
          <Field label="Title"        name="coupon_title" value={form.coupon_title} onChange={onChange} placeholder="Summer Flash Sale"/>
          <Field label="Discount ($)" name="coupon_price" value={form.coupon_price} onChange={onChange} type="number" placeholder="15"/>
          <Field label="Usage Limit"  name="coupon_limit" value={form.coupon_limit} onChange={onChange} type="number" placeholder="100"/>
          <Field label="Times Used"   name="coupon_used"  value={form.coupon_used}  onChange={onChange} type="number" placeholder="0"/>
          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",justifyContent:"center",marginTop:4}}>
            {loading?"Saving...":modal==="add"?"Create Coupon":"Update Coupon"}
          </Btn>
        </Modal>
      )}
    </div>
  );
};

/* ─── ORDERS PAGE ─────────────────────────── */
const OrdersPage = ({ data, onRefresh }) => {
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({customer:"",total:"",status:"Pending"});
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState("");

  const orders   = data?.orders || [];
  const onChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const openAdd  = () => { setForm({customer:"",total:"",status:"Pending"}); setModal("add"); };
  const openEdit = o  => { setForm({customer:o.customer,total:o.total,status:o.status}); setModal({edit:o}); };

  const handleSubmit = async () => {
    setLoading(true);
    if(modal==="add") await api.post("/api/customer-orders",form);
    else              await api.put(`/api/customer-orders/${modal.edit.id}`,form);
    setLoading(false); setModal(null); onRefresh("orders");
  };
  const handleDelete = async id => {
    if(window.confirm("Delete this order?")){ await api.delete(`/api/customer-orders/${id}`); onRefresh("orders"); }
  };

  const filtered = orders.filter(o=>
    (o.customer||"").toLowerCase().includes(search.toLowerCase()) ||
    (o.id||"").toLowerCase().includes(search.toLowerCase())
  );

  const totalRev    = orders.reduce((s,o)=>s+(o.total||0),0);
  const pendingOrds = orders.filter(o=>o.status==="Pending").length;
  const completedO  = orders.filter(o=>o.status==="Completed").length;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>Orders</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:3}}>{orders.length} total orders</p>
        </div>
        <Btn onClick={openAdd}><Icon name="plus" size={16}/>Add Order</Btn>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.blue}`}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Total Orders</div>
          <div style={{fontSize:26,fontWeight:800,color:C.navy}}>{orders.length}</div>
        </Card>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.emerald}`}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Completed</div>
          <div style={{fontSize:26,fontWeight:800,color:C.emerald}}>{completedO}</div>
        </Card>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.amber}`}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Pending</div>
          <div style={{fontSize:26,fontWeight:800,color:C.amber}}>{pendingOrds}</div>
        </Card>
        <Card style={{padding:"18px 22px",borderLeft:`4px solid ${C.violet}`}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Total Revenue</div>
          <div style={{fontSize:26,fontWeight:800,color:C.violet}}>${totalRev.toLocaleString()}</div>
        </Card>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search orders..."/>

      <Card>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.border}`}}>
              {["Order ID","Customer","Total","Status","Date","Items","Actions"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 14px",color:C.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o,i)=>(
              <tr key={o.id||i} style={{borderBottom:`1px solid ${C.bg}`,transition:"background .15s"}} onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 14px",color:C.blue,fontWeight:700}}>{o.id}</td>
                <td style={{padding:"12px 14px",color:C.slate}}>{o.customer}</td>
                <td style={{padding:"12px 14px",fontWeight:700,color:C.navy}}>${o.total}</td>
                <td style={{padding:"12px 14px"}}><StatusBadge status={o.status}/></td>
                <td style={{padding:"12px 14px",color:C.muted}}>{o.date}</td>
                <td style={{padding:"12px 14px",color:C.slate}}>{o.items}</td>
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>openEdit(o)} style={{background:C.blueLt,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.blue,display:"flex"}} title="Edit"><Icon name="edit" size={14}/></button>
                    <button onClick={()=>handleDelete(o.id)} style={{background:C.redLt,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red,display:"flex"}} title="Delete"><Icon name="trash" size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={7} style={{padding:"40px",textAlign:"center",color:C.muted}}>No orders found</td></tr>}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title={modal==="add"?"Add Order":"Edit Order"} onClose={()=>setModal(null)}>
          <Field label="Customer Name" name="customer" value={form.customer} onChange={onChange} placeholder="Customer name"/>
          <Field label="Total ($)"     name="total"    value={form.total}    onChange={onChange} type="number" placeholder="0.00"/>
          <Field label="Status"        name="status"   value={form.status}   onChange={onChange} options={[
            {value:"Pending",label:"Pending"},{value:"Processing",label:"Processing"},
            {value:"Completed",label:"Completed"},{value:"Cancelled",label:"Cancelled"},
          ]}/>
          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",justifyContent:"center",marginTop:4}}>
            {loading?"Saving...":modal==="add"?"Create Order":"Update Order"}
          </Btn>
        </Modal>
      )}
    </div>
  );
};

/* ─── GENERIC CRUD PAGE ───────────────────── */
const CrudPage = ({ title, endpoint, columns, formFields, data, onRefresh, keyField="id", summaryCards }) => {
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({});
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState("");

  const onChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const openAdd  = () => { const init={}; formFields.forEach(f=>{init[f.name]="";}); setForm(init); setModal("add"); };
  const openEdit = row => { const init={}; formFields.forEach(f=>{init[f.name]=row[f.name]||"";}); setForm(init); setModal({edit:row}); };

  const handleSubmit = async () => {
    setLoading(true);
    if(modal==="add") await api.post(endpoint,form);
    else              await api.put(`${endpoint}/${modal.edit[keyField]}`,form);
    setLoading(false); setModal(null);
    onRefresh(endpoint.replace("/api/","").replace(/-/g,"_"));
  };
  const handleDelete = async id => {
    if(window.confirm("Delete this record?")){ await api.delete(`${endpoint}/${id}`); onRefresh(endpoint.replace("/api/","").replace(/-/g,"_")); }
  };

  const rows     = data||[];
  const filtered = rows.filter(r=>columns.some(c=>String(r[c.key]||"").toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>{title}</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:3}}>{rows.length} records</p>
        </div>
        <Btn onClick={openAdd}><Icon name="plus" size={16}/>Add New</Btn>
      </div>

      {summaryCards && (
        <div style={{display:"grid",gridTemplateColumns:`repeat(${summaryCards.length},1fr)`,gap:16,marginBottom:24}}>
          {summaryCards.map((sc,i)=>(
            <Card key={i} style={{padding:"18px 22px",borderLeft:`4px solid ${sc.color||C.blue}`}}>
              <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{sc.label}</div>
              <div style={{fontSize:26,fontWeight:800,color:sc.color||C.navy}}>{sc.value}</div>
            </Card>
          ))}
        </div>
      )}

      <SearchBar value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`}/>

      <Card>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.border}`}}>
              {columns.map(c=>(
                <th key={c.key} style={{textAlign:"left",padding:"10px 14px",color:C.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>{c.label}</th>
              ))}
              <th style={{textAlign:"left",padding:"10px 14px",color:C.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row,i)=>(
              <tr key={row[keyField]??i} style={{borderBottom:`1px solid ${C.bg}`,transition:"background .15s"}} onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                {columns.map(c=>(
                  <td key={c.key} style={{padding:"12px 14px",color:C.slate}}>
                    {c.badge  ? <StatusBadge status={row[c.key]}/> :
                     c.money  ? <span style={{fontWeight:700,color:C.navy}}>${row[c.key]}</span> :
                     c.key==="id" ? <span style={{color:C.blue,fontWeight:700}}>{row[c.key]}</span> :
                     row[c.key]}
                  </td>
                ))}
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>openEdit(row)} style={{background:C.blueLt,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.blue,display:"flex"}} title="Edit"><Icon name="edit" size={14}/></button>
                    <button onClick={()=>handleDelete(row[keyField])} style={{background:C.redLt,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red,display:"flex"}} title="Delete"><Icon name="trash" size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={columns.length+1} style={{padding:"40px",textAlign:"center",color:C.muted}}>No records found</td></tr>}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title={modal==="add"?`Add ${title}`:`Edit ${title}`} onClose={()=>setModal(null)}>
          {formFields.map(f=>(
            <Field key={f.name} label={f.label} name={f.name} value={form[f.name]||""} onChange={onChange} type={f.type} placeholder={f.placeholder} options={f.options}/>
          ))}
          <Btn onClick={handleSubmit} disabled={loading} style={{width:"100%",justifyContent:"center",marginTop:4}}>
            {loading?"Saving...":modal==="add"?"Create":"Update"}
          </Btn>
        </Modal>
      )}
    </div>
  );
};

/* ─── POS PAGE ────────────────────────────── */
const POSPage = ({ products }) => {
  const [cart,        setCart]        = useState([]);
  const [coupon,      setCoupon]      = useState("");
  const [couponData,  setCouponData]  = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponMsg,   setCouponMsg]   = useState("");
  const [search,      setSearch]      = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = p => setCart(c=>{
    const ex=c.find(i=>i.id===p.id);
    return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}];
  });
  const removeFromCart = id => setCart(c=>c.filter(i=>i.id!==id));
  const updateQty = (id,qty) => { if(qty<1)return removeFromCart(id); setCart(c=>c.map(i=>i.id===id?{...i,qty}:i)); };

  const subtotal    = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const discountAmt = couponData?Math.min(couponData.coupon_price||0,subtotal):0;
  const total       = subtotal-discountAmt;

  const applyCoupon = async () => {
    setCouponError(""); setCouponMsg("");
    if(!coupon.trim()) return;
    try {
      const res = await api.get(`/api/coupons/validate?code=${coupon.trim()}`);
      if(res?.valid){ setCouponData(res.coupon); setCouponMsg(`✓ "${res.coupon.coupon_title}" applied — $${res.coupon.coupon_price} off`); }
      else           { setCouponData(null); setCouponError(res?.message||"Invalid or expired coupon"); }
    } catch { setCouponData(null); setCouponError("Could not validate coupon."); }
  };
  const removeCoupon = () => { setCoupon(""); setCouponData(null); setCouponError(""); setCouponMsg(""); };

  const placeOrder = async () => {
    if(!cart.length) return;
    await api.post("/api/pending-orders",{items:cart,total,coupon:couponData?.coupon_code||null,coupon_id:couponData?.coupon_id||null});
    setOrderPlaced(true);
    setTimeout(()=>{ setCart([]); setCoupon(""); setCouponData(null); setCouponMsg(""); setCouponError(""); setOrderPlaced(false); },2500);
  };

  const filtered = (products||[]).filter(p=>(p?.name||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{display:"flex",gap:22,height:"calc(100vh - 140px)"}}>
      {/* Product Grid */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>Point of Sale</h2>
          <span style={{fontSize:13,color:C.muted}}>{filtered.length} products</span>
        </div>
        <div style={{position:"relative",marginBottom:16}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,display:"flex"}}><Icon name="search" size={16}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
            style={{width:"100%",paddingLeft:42,paddingRight:16,paddingTop:10,paddingBottom:10,border:`1.5px solid ${C.border}`,borderRadius:14,fontSize:14,background:C.white,outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>
        <div style={{flex:1,overflowY:"auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,alignContent:"start"}}>
          {filtered.map((p, idx)=>(
            <button key={p.id ?? idx} onClick={()=>addToCart(p)}
              style={{background:C.white,borderRadius:16,border:`1.5px solid ${C.border}`,padding:14,textAlign:"left",cursor:"pointer",transition:"border-color .2s,box-shadow .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.boxShadow="0 4px 16px rgba(37,99,235,0.12)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}
            >
              <div style={{height:110,background:"#f1f5f9",borderRadius:10,marginBottom:10,overflow:"hidden"}}>
                <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:16,fontWeight:800,color:C.blue}}>${p.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div style={{width:300,flexShrink:0,background:C.white,borderRadius:20,border:`1px solid ${C.border}`,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
          <Icon name="cart" size={18}/>
          <span style={{fontWeight:800,color:C.navy,fontSize:15}}>Cart</span>
          <span style={{marginLeft:"auto",background:C.blue,color:"#fff",borderRadius:99,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{cart.length}</span>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {cart.length===0&&<p style={{color:C.muted,fontSize:13,textAlign:"center",marginTop:32}}>Cart is empty</p>}
          {cart.map((item, idx)=>(
            <div key={item.id ?? idx} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,background:C.bg,borderRadius:12,padding:10}}>
              <div style={{width:40,height:40,background:C.border,borderRadius:8,overflow:"hidden",flexShrink:0}}>
                <img src={item.image} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:12,color:C.blue,fontWeight:800}}>${item.price}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <button onClick={()=>updateQty(item.id,item.qty-1)} style={{width:24,height:24,borderRadius:6,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.slate}}>−</button>
                <span style={{fontSize:12,width:20,textAlign:"center",fontWeight:700,color:C.navy}}>{item.qty}</span>
                <button onClick={()=>updateQty(item.id,item.qty+1)} style={{width:24,height:24,borderRadius:6,border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.slate}}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:16,borderTop:`1px solid ${C.border}`}}>
          {/* Coupon */}
          {!couponData ? (
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",gap:8,marginBottom:4}}>
                <input value={coupon} onChange={e=>{setCoupon(e.target.value);setCouponError("");}}
                  onKeyDown={e=>e.key==="Enter"&&applyCoupon()} placeholder="Coupon code"
                  style={{flex:1,border:`1.5px solid ${couponError?C.red:C.border}`,borderRadius:10,padding:"8px 12px",fontSize:12,outline:"none"}}
                />
                <button onClick={applyCoupon} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",color:C.slate}}>Apply</button>
              </div>
              {couponError&&<p style={{color:C.red,fontSize:11,margin:0}}>{couponError}</p>}
            </div>
          ):(
            <div style={{background:C.emerLt,border:`1px solid #a7f3d0`,borderRadius:10,padding:"10px 12px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:12,fontWeight:800,color:C.emerald,fontFamily:"monospace"}}>{couponData.coupon_code}</div>
                <div style={{fontSize:11,color:C.emerald}}>{couponMsg}</div>
              </div>
              <button onClick={removeCoupon} style={{background:"none",border:"none",cursor:"pointer",color:C.emerald,fontWeight:700,fontSize:14}}>✕</button>
            </div>
          )}

          {/* Totals */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.muted,marginBottom:6}}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {couponData&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.emerald,marginBottom:6,fontWeight:600}}><span>Discount</span><span>−${discountAmt.toFixed(2)}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:17,fontWeight:800,color:C.navy,borderTop:`1px solid ${C.border}`,paddingTop:10}}><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <button onClick={placeOrder}
            style={{width:"100%",padding:"13px 0",borderRadius:14,border:"none",cursor:cart.length?"pointer":"not-allowed",fontSize:14,fontWeight:800,background:orderPlaced?gradients.emerald:gradients.blue,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:cart.length?1:.6,boxShadow:cart.length?"0 4px 14px rgba(37,99,235,0.3)":"none"}}
          >
            {orderPlaced
              ? <><Icon key="icon" name="check" size={16}/><span key="label">Order Placed!</span></>
              : "Place Order"
            }
          </button>
        </div>
      </div>
    </div>
  );
};
/* ─── MAIN APP ────────────────────────────── */
export default function App() {
  const [page,        setPage]        = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data,        setData]        = useState({
    products:MOCK.products,customers:MOCK.customers,orders:MOCK.orders,
    categories:MOCK.categories,coupons:MOCK.coupons,payments:MOCK.payments,
    stores:MOCK.stores,wishlist:MOCK.wishlist,manufacturers:MOCK.manufacturers,
  });

  const fetchData = async (key,endpoint) => {
    const r = await api.get(endpoint);
    if(r) setData(d=>({...d,[key]:r}));
  };
  useEffect(()=>{
    fetchData("products","/api/products");
    fetchData("customers","/api/customers");
    fetchData("orders","/api/customer-orders");
    fetchData("categories","/api/categories");
    fetchData("coupons","/api/coupons");
    fetchData("payments","/api/payments");
  },[]);

  const onRefresh = key => {
    const map={products:"/api/products",customers:"/api/customers",orders:"/api/customer-orders",categories:"/api/categories",coupons:"/api/coupons",payments:"/api/payments"};
    if(map[key]) fetchData(key,map[key]);
  };

  const navItems = [
    {id:"dashboard",    label:"Dashboard",    icon:"dashboard"},
    {id:"pos",          label:"POS",          icon:"cart"},
    {id:"products",     label:"Products",     icon:"products"},
    {id:"orders",       label:"Orders",       icon:"orders"},
    {id:"customers",    label:"Customers",    icon:"customers"},
    {id:"categories",   label:"Categories",   icon:"categories"},
    {id:"coupons",      label:"Coupons",      icon:"coupons"},
    {id:"payments",     label:"Payments",     icon:"payments"},
    {id:"manufacturers",label:"Manufacturers",icon:"manufacturers"},
    {id:"stores",       label:"Stores",       icon:"stores"},
    {id:"wishlist",     label:"Wishlist",     icon:"wishlist"},
    {id:"settings",     label:"Settings",     icon:"settings"},
  ];

  const renderPage = () => {
    switch(page){
      case "dashboard":    return <DashboardPage data={data}/>;
      case "pos":          return <POSPage products={data.products}/>;
      case "products":     return <ProductsPage data={data} onRefresh={onRefresh}/>;
      case "orders":       return <OrdersPage data={data} onRefresh={onRefresh}/>;
      case "coupons":      return <CouponsPage data={data} onRefresh={onRefresh}/>;

      case "customers":    return (
        <CrudPage title="Customers" endpoint="/api/customers" data={data.customers}
          columns={[{key:"id",label:"ID"},{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"orders",label:"Orders"},{key:"spent",label:"Spent",money:true}]}
          formFields={[{name:"name",label:"Full Name",placeholder:"Jane Doe"},{name:"email",label:"Email",type:"email",placeholder:"jane@example.com"}]}
          onRefresh={onRefresh}
          summaryCards={[
            {label:"Total Customers",value:data.customers?.length||0,color:C.blue},
            {label:"Total Spent",    value:`$${(data.customers||[]).reduce((s,c)=>s+(c.spent||0),0).toLocaleString()}`,color:C.emerald},
            {label:"Avg Orders",     value:data.customers?.length?Math.round((data.customers||[]).reduce((s,c)=>s+(c.orders||0),0)/data.customers.length):0,color:C.violet},
          ]}
        />
      );

      case "categories":   return (
        <CrudPage title="Categories" endpoint="/api/categories" data={data.categories}
          columns={[{key:"id",label:"ID"},{key:"name",label:"Category Name"},{key:"productCount",label:"Products"}]}
          formFields={[{name:"name",label:"Category Name",placeholder:"Skincare"}]}
          onRefresh={onRefresh}
        />
      );

      case "payments":     return (
        <CrudPage title="Payments" endpoint="/api/payments" data={data.payments}
          columns={[{key:"id",label:"ID"},{key:"orderId",label:"Order"},{key:"amount",label:"Amount",money:true},{key:"method",label:"Method"},{key:"status",label:"Status",badge:true},{key:"date",label:"Date"}]}
          formFields={[{name:"orderId",label:"Order ID",placeholder:"ORD-001"},{name:"amount",label:"Amount",type:"number"},{name:"method",label:"Method",placeholder:"Credit Card"},{name:"status",label:"Status",placeholder:"Paid"}]}
          onRefresh={onRefresh}
          summaryCards={[
            {label:"Total Payments",value:data.payments?.length||0,color:C.blue},
            {label:"Total Amount",  value:`$${(data.payments||[]).reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}`,color:C.emerald},
            {label:"Paid",          value:(data.payments||[]).filter(p=>p.status==="Paid").length,color:C.violet},
          ]}
        />
      );

      case "manufacturers": return (
        <CrudPage title="Manufacturers" endpoint="/api/manufacturers" data={data.manufacturers}
          columns={[{key:"id",label:"ID"},{key:"name",label:"Name"},{key:"country",label:"Country"}]}
          formFields={[{name:"name",label:"Manufacturer Name",placeholder:"L'Oréal"},{name:"country",label:"Country",placeholder:"France"}]}
          onRefresh={onRefresh}
        />
      );

      case "stores": return (
        <CrudPage title="Stores" endpoint="/api/stores" data={data.stores}
          columns={[{key:"id",label:"ID"},{key:"name",label:"Store Name"},{key:"location",label:"Location"}]}
          formFields={[{name:"name",label:"Store Name",placeholder:"Main Store"},{name:"location",label:"Location",placeholder:"Phnom Penh"}]}
          onRefresh={onRefresh}
        />
      );

      case "wishlist": return (
        <CrudPage title="Wishlist" endpoint="/api/wishlist" data={data.wishlist}
          columns={[{key:"id",label:"ID"},{key:"product",label:"Product"},{key:"customer",label:"Customer"}]}
          formFields={[{name:"product",label:"Product",placeholder:"Product name"},{name:"customer",label:"Customer",placeholder:"Customer name"}]}
          onRefresh={onRefresh}
        />
      );

      case "settings": return (
        <div>
          <h2 style={{fontSize:24,fontWeight:800,color:C.navy,marginBottom:24}}>Settings</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <Card title="API Configuration">
              <Field label="Base URL"  name="url" value="http://localhost:9090"  onChange={()=>{}}/>
              <Field label="App Name"  name="app" value="CommerceHQ Dashboard"   onChange={()=>{}}/>
              <Btn style={{marginTop:4}}>Save Settings</Btn>
            </Card>
            <Card title="Appearance">
              <Field label="Theme"    name="theme" value="Light" onChange={()=>{}} options={[{value:"light",label:"Light"},{value:"dark",label:"Dark"}]}/>
              <Field label="Language" name="lang"  value="en"    onChange={()=>{}} options={[{value:"en",label:"English"},{value:"km",label:"Khmer"}]}/>
              <Btn style={{marginTop:4}}>Save Preferences</Btn>
            </Card>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'Nunito','Segoe UI',sans-serif",overflow:"hidden"}}>

      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:64,background:C.navy,display:"flex",flexDirection:"column",transition:"width .2s",flexShrink:0,overflowX:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"18px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{width:34,height:34,background:gradients.blue,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 12px rgba(37,99,235,0.4)"}}>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
          {sidebarOpen&&<span style={{fontWeight:800,color:"#fff",fontSize:15,whiteSpace:"nowrap"}}>CommerceHQ</span>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"12px 10px",overflowY:"auto",overflowX:"hidden"}}>
          {navItems.map(item=>{
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>setPage(item.id)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,border:"none",cursor:"pointer",marginBottom:2,transition:"background .15s",background:active?"rgba(37,99,235,0.9)":"transparent",color:active?"#fff":"rgba(255,255,255,0.55)",fontWeight:active?700:500,fontSize:13,whiteSpace:"nowrap"}}
                onMouseOver={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
                onMouseOut={e=>{if(!active)e.currentTarget.style.background="transparent";}}
              >
                <span style={{flexShrink:0}}><Icon name={item.icon} size={17}/></span>
                {sidebarOpen&&<span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse */}
        <div style={{padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {sidebarOpen&&(
            <div style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 12px",marginBottom:8,textAlign:"center"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:700}}>Pro Plan</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>All features</div>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(o=>!o)}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:10,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",color:"rgba(255,255,255,0.4)"}}
            onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}
          >
            <Icon name="menu" size={18}/>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{position:"relative",width:300}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,display:"flex"}}><Icon name="search" size={15}/></span>
            <input placeholder="Search anything..." style={{width:"100%",paddingLeft:38,paddingRight:14,paddingTop:9,paddingBottom:9,border:`1.5px solid ${C.border}`,borderRadius:12,fontSize:13,background:C.bg,outline:"none",boxSizing:"border-box",color:C.navy}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{background:C.blueLt,color:C.blue,borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700}}>
              {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,background:gradients.blue,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,boxShadow:"0 3px 10px rgba(37,99,235,0.3)"}}>A</div>
              {sidebarOpen&&<div><div style={{fontWeight:700,color:C.navy,fontSize:13}}>Admin</div><div style={{color:C.muted,fontSize:11}}>maotityamony@gmail.com</div></div>}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
