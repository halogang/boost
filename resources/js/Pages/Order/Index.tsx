import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/Button';
import { useToast } from '@/hooks/useToast';

interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  product_type: string;
  quantity: number;
  order_type: 'regular' | 'partnership';
  notes?: string;
}

interface Props {
  orderType?: 'regular' | 'partnership';
}

export default function Order({ orderType: initialOrderType = 'regular' }: Props) {
  const { success } = useToast();
  const [selectedProduct, setSelectedProduct] = useState('galon-19l');
  const [orderType, setOrderType] = useState<'regular' | 'partnership'>(initialOrderType);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  const [data, setData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    product_type: 'galon-19l',
    quantity: 1,
    order_type: initialOrderType,
    notes: '',
  });

  const products = [
    { id: 'galon-19l', name: 'Air Galon 19L', price: 'Rp 15.000', icon: '💧' },
    { id: 'botol-600ml', name: 'Air Botol 600ml', price: 'Rp 5.000', icon: '🥤' },
    { id: 'botol-1500ml', name: 'Air Botol 1500ml', price: 'Rp 8.000', icon: '🍶' },
  ];

  useEffect(() => {
    setData((prev) => ({ ...prev, order_type: orderType }));
  }, [orderType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!data.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!data.phone.trim()) newErrors.phone = 'No. WhatsApp wajib diisi';
    if (!data.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
    if (data.quantity < 1) newErrors.quantity = 'Jumlah minimal 1';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setProcessing(true);
    
    // Mock: Simulate order processing
    const orderNumber = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Simulate API delay
    setTimeout(() => {
      setProcessing(false);
      success('Pesanan berhasil dikirim!', `Nomor pesanan: ${orderNumber}. Tim kami akan menghubungi Anda segera.`);
      
      // Reset form
      setData({
        name: '',
        phone: '',
        email: '',
        address: '',
        product_type: 'galon-19l',
        quantity: 1,
        order_type: orderType,
        notes: '',
      });
      setSelectedProduct('galon-19l');
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Head>
        <title>Pemesanan - Ajib Darkah</title>
        <meta
          name="description"
          content="Pesan air minum Ajib Darkah sekarang. Air galon 19L, botol 600ml, dan botol 1500ml tersedia. Pengiriman cepat dan berkualitas."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <a href="/" className="flex items-center gap-3">
                <img
                  src="/AJIB-DARKAH-INDONESIA.png"
                  alt="Ajib Darkah Indonesia"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">Ajib Darkah</span>
              </a>
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Text - Left */}
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Pesan Air Minum Ajib Darkah
                  </h1>
                  <p className="text-xl text-gray-700">
                    Isi formulir di bawah ini untuk memesan air minum berkualitas kami
                  </p>
                </div>
                
                {/* Image - Right */}
                <div className="flex justify-center md:justify-end">
                  <motion.img
                    src="/AJIB-DARKAH-INDONESIA.png"
                    alt="Ajib Darkah Logo"
                    className="h-48 md:h-64 w-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Order Form - Horizontal Layout */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Type Selection */}
                  <div>
                    <InputLabel value="Jenis Pemesanan" className="mb-4 text-lg font-semibold" />
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('regular');
                          setData({ ...data, order_type: 'regular' });
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          orderType === 'regular'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🛒</div>
                        <div className="font-semibold text-base">Pemesanan Reguler</div>
                        <div className="text-xs text-gray-600 mt-1">Untuk kebutuhan pribadi/rumah tangga</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('partnership');
                          setData({ ...data, order_type: 'partnership' });
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          orderType === 'partnership'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🤝</div>
                        <div className="font-semibold text-base">Daftar Kemitraan</div>
                        <div className="text-xs text-gray-600 mt-1">Untuk menjadi mitra distributor</div>
                      </button>
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div>
                    <InputLabel value="Pilih Produk" className="mb-4 text-lg font-semibold" />
                    <div className="grid grid-cols-3 gap-3">
                      {products.map((product) => (
                        <motion.button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setData({ ...data, product_type: product.id });
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            selectedProduct === product.id
                              ? 'border-blue-600 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-1">{product.icon}</div>
                          <div className="font-semibold text-sm mb-1">{product.name}</div>
                          <div className="text-blue-600 font-bold text-xs">{product.price}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap *" />
                        <TextInput
                          id="name"
                          type="text"
                          value={data.name}
                          onChange={(e) => {
                            setData({ ...data, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          className="mt-1 block w-full"
                          required
                        />
                        <InputError message={errors.name} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="phone" value="No. WhatsApp *" />
                        <TextInput
                          id="phone"
                          type="tel"
                          value={data.phone}
                          onChange={(e) => {
                            setData({ ...data, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          className="mt-1 block w-full"
                          placeholder="08XX XXXX XXXX"
                          required
                        />
                        <InputError message={errors.phone} className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <InputLabel htmlFor="email" value="Email" />
                      <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className="mt-1 block w-full"
                      />
                      <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="address" value="Alamat Lengkap *" />
                      <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => {
                          setData({ ...data, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: undefined });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                      <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <InputLabel htmlFor="quantity" value="Jumlah *" />
                        <TextInput
                          id="quantity"
                          type="number"
                          min="1"
                          value={data.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1;
                            setData({ ...data, quantity: qty });
                            if (errors.quantity) setErrors({ ...errors, quantity: undefined });
                          }}
                          className="mt-1 block w-full"
                          required
                        />
                        <InputError message={errors.quantity} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                        <textarea
                          id="notes"
                          value={data.notes || ''}
                          onChange={(e) => setData({ ...data, notes: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                          placeholder="Catatan khusus..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-100 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {products.find(p => p.id === selectedProduct)?.icon || '💧'}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {products.find(p => p.id === selectedProduct)?.name || 'Produk'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {products.find(p => p.id === selectedProduct)?.price || 'Rp 0'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">x{data.quantity}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jenis Pesanan:</span>
                          <span className="font-semibold text-gray-900">
                            {orderType === 'regular' ? 'Reguler' : 'Kemitraan'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            {(() => {
                              const price = products.find(p => p.id === selectedProduct)?.price || 'Rp 0';
                              const numPrice = parseInt(price.replace(/[^\d]/g, '')) || 0;
                              return `Rp ${(numPrice * data.quantity).toLocaleString('id-ID')}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {orderType === 'partnership' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-4"
                      >
                        <h4 className="font-semibold text-sm mb-2">Informasi Kemitraan</h4>
                        <p className="text-xs text-gray-700">
                          Tim kami akan menghubungi Anda dalam 1x24 jam untuk membahas detail lebih lanjut mengenai program kemitraan Ajib Darkah.
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3 text-base"
                    >
                      {processing ? 'Mengirim...' : 'Kirim Pesanan'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Partnership Info - Full Width */}
              {orderType === 'partnership' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6 lg:hidden"
                >
                  <h3 className="font-semibold text-lg mb-2">Informasi Kemitraan</h3>
                  <p className="text-gray-700">
                    Untuk kemitraan, tim kami akan menghubungi Anda dalam 1x24 jam untuk membahas
                    detail lebih lanjut mengenai program kemitraan Ajib Darkah.
                  </p>
                </motion.div>
              )}

              {orderType === 'partnership' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-lg mb-2">Informasi Kemitraan</h3>
                  <p className="text-gray-700 mb-4">
                    Untuk kemitraan, tim kami akan menghubungi Anda dalam 1x24 jam untuk membahas
                    detail lebih lanjut mengenai program kemitraan Ajib Darkah.
                  </p>
                </motion.div>
              )}

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 text-lg"
                >
                  {processing ? 'Mengirim...' : 'Kirim Pesanan'}
                </Button>
              </div>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-white text-center shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4">Butuh Bantuan?</h3>
              <p className="text-lg mb-6">Hubungi kami melalui WhatsApp untuk pemesanan cepat</p>
              <a
                href="https://wa.me/62XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Chat WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

