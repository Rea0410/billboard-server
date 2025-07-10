// src/App.jsx
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';

// Public Pages
import Navbar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/Contact-us';
import Markets from './pages/Markets';
import Product from './pages/Products';
import Map from './pages/Map-view';
import Model from './pages/Model';
import Footer from './components/Footer';
import Billboard from './pages/Billboard-details';

// Admin Pages
import AddBillboardForm from './pages/AddBillboardForm';
import ManageBillboard from './components/ManageBillboards';
import ProtectedAdmin from './components/ProtectedAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/product" element={<Product />} />
          <Route path="/map" element={<Map />} />
          <Route path="/model" element={<Model />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/location-detail" element={<Billboard />} />
        </Route>

        {/* ✅ Admin Routes wrapped with ProtectedAdmin */}
        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-billboard" element={<AddBillboardForm />} />
            <Route path="manage-billboard" element={<ManageBillboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
