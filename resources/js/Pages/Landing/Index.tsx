import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const y = useTransform(scrollY, [0, 100], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const waterWaveVariants = {
    animate: {
      x: ['-100%', '0%'],
      transition: {
        x: {
          repeat: Infinity,
          duration: 20,
          ease: 'linear' as const,
        },
      },
    },
  };

  return (
    <>
      <Head>
        <title>Ajib Darkah - Air Minum Pegunungan Terbaik di Cilacap</title>
        <meta
          name="description"
          content="Ajib Darkah - Air minum pegunungan terbaik dari mata air Pegunungan Pancasan Ajibarang. TDS rendah, pH stabil, segar dan sehat untuk konsumsi sehari-hari. Pesan sekarang!"
        />
        <meta
          name="keywords"
          content="air minum galon, depot air minum, air pegunungan, ajib darkah, air minum cilacap, air minum berkualitas"
        />
        <meta property="og:title" content="Ajib Darkah - Air Minum Pegunungan Terbaik" />
        <meta
          property="og:description"
          content="Air minum yang berasal dari mata air Pegunungan Pancasan Ajibarang, diolah menggunakan teknologi canggih dan telah melalui pengujian sesuai standar kualitas produk."
        />
        <meta property="og:image" content="/AJIB-DARKAH-INDONESIA.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ajibdarkah.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ajib Darkah',
              description:
                'Perusahaan pengolahan dan pelayanan air minum dalam kemasan yang menjadi pelopor air minum pegunungan terbaik di Cilacap',
              url: 'https://ajibdarkah.com',
              logo: 'https://ajibdarkah.com/AJIB-DARKAH-INDONESIA.png',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: 'Indonesian',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Ajib Darkah Air Minum Pegunungan',
              description:
                'Air minum yang berasal dari mata air Pegunungan Pancasan Ajibarang, diolah menggunakan teknologi canggih',
              brand: {
                '@type': 'Brand',
                name: 'Ajib Darkah',
              },
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'IDR',
              },
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
        {/* Animated Water Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            variants={waterWaveVariants}
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-10"
            variants={waterWaveVariants}
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)',
              animationDelay: '10s',
            }}
          />
        </div>

        {/* Navigation */}
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-lg shadow-lg'
              : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="/AJIB-DARKAH-INDONESIA.png"
                  alt="Ajib Darkah Indonesia"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">Ajib Darkah</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="#tentang"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="#produk"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Produk
                </Link>
                <Link
                  href="#kemitraan"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Kemitraan
                </Link>
                <Link
                  href="/order"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Pesan Sekarang
                </Link>
              </div>

              <button className="md:hidden p-2 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden">
          {/* Mountain Background */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/pegunungan-bg.jpg)',
              backgroundPosition: 'center bottom',
            }}
          >
            {/* Overlay biru lembut untuk readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 via-blue-50/40 to-blue-100/50"></div>
            {/* Overlay tambahan untuk depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 via-transparent to-transparent"></div>
          </div>

          <motion.div
            className="w-full z-10 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              {/* Text - Left */}
              <motion.div variants={itemVariants} className="text-left relative z-10">
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-lg"
                >
                  <span className="block">Ajib Darkah</span>
                  <span className="block text-blue-700 mt-2">Kebaikan Air Menebarkan Berkah</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-800 mb-12 leading-relaxed drop-shadow-md"
                >
                  Air minum yang berasal dari mata air Pegunungan Pancasan Ajibarang, diolah menggunakan
                  teknologi canggih dan telah melalui pengujian sesuai standar kualitas produk. Dengan TDS
                  rendah dan pH yang stabil menjadikan air segar dan cocok dikonsumsi sehari-hari.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/order"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform text-center"
                  >
                    Pesan Sekarang
                  </Link>
                  <Link
                    href="#tentang"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl border-2 border-blue-600 text-center"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </motion.div>
              </motion.div>

              {/* Photo - Right */}
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start xl:justify-center relative z-10">
                <motion.div
                  className="relative group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <img
                    src="/landing.png"
                    alt="Depot Air Minum Ajib Darkah"
                    className="h-64 md:h-80 lg:h-96 w-auto rounded-2xl shadow-2xl object-cover relative z-10 border-4 border-white/50"
                    onError={(e) => {
                      // Fallback jika gambar tidak ditemukan
                      (e.target as HTMLImageElement).src = '/AJIB-DARKAH-INDONESIA.png';
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Water Drops Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {typeof window !== 'undefined' && [...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-blue-400/30 rounded-full"
                initial={{
                  x: Math.random() * (window.innerWidth || 1200),
                  y: (window.innerHeight || 800) + 100,
                  opacity: 0,
                }}
                animate={{
                  y: -100,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="tentang" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="text-8xl">💧</motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold text-gray-900">Air Minum Pegunungan Terbaik</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Ajib Darkah merupakan perusahaan pengolahan dan pelayanan air minum dalam kemasan
                  yang menjadi pelopor air minum pegunungan terbaik di Cilacap, berdiri sejak 2018
                  hingga saat ini.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Dengan komitmen untuk menyediakan air minum berkualitas tinggi, kami menggunakan
                  teknologi canggih dalam proses pengolahan dan memastikan setiap produk memenuhi
                  standar kualitas yang ketat.
                </p>
                <Link
                  href="#produk"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Lihat Produk Kami
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produk" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Produk Ajib Darkah</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Air minum berkualitas tinggi dengan TDS rendah dan pH stabil untuk kesehatan optimal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Air Galon 19L',
                  description: 'Air minum dalam kemasan galon 19 liter, praktis untuk kebutuhan rumah tangga',
                  icon: '💧',
                },
                {
                  title: 'Air Botol 600ml',
                  description: 'Air minum dalam kemasan botol 600ml, mudah dibawa kemana saja',
                  icon: '🥤',
                },
                {
                  title: 'Air Botol 1500ml',
                  description: 'Air minum dalam kemasan botol 1.5 liter, ekonomis untuk keluarga',
                  icon: '🍶',
                },
              ].map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="text-6xl mb-4 text-center">{product.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{product.title}</h3>
                  <p className="text-gray-700 text-center mb-6">{product.description}</p>
                  <div className="text-center">
                    <Link
                      href="/order"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section id="kemitraan" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Program Kemitraan</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-12 text-white shadow-2xl"
            >
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Raih Potensi Keuntungan Besar dengan Kemitraan Ajib Darkah
                </h3>
                <p className="text-xl leading-relaxed">
                  Kami membuka kesempatan kemitraan untuk distribusi air minum berkualitas. Raih potensi
                  keuntungan besar dengan permintaan pasar yang terus meningkat, modal terjangkau, serta
                  dukungan pemasaran dan operasional.
                </p>
                <p className="text-xl leading-relaxed">
                  Tidak hanya bisnis yang menguntungkan, tetapi juga membawa keberkahan dengan menyediakan
                  air minum sehat bagi masyarakat.
                </p>
                <Link
                  href="/order?type=partnership"
                  className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl mt-8"
                >
                  Gabung Kemitraan Ajib Darkah
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <img
                  src="/AJIB-DARKAH-INDONESIA.png"
                  alt="Ajib Darkah"
                  className="h-12 w-auto mb-4"
                />
                <p className="text-gray-400">
                  Air minum pegunungan terbaik dari Cilacap sejak 2018
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Perusahaan</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#tentang" className="hover:text-white transition">
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link href="#produk" className="hover:text-white transition">
                      Produk
                    </Link>
                  </li>
                  <li>
                    <Link href="#kemitraan" className="hover:text-white transition">
                      Kemitraan
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Layanan</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/order" className="hover:text-white transition">
                      Pemesanan
                    </Link>
                  </li>
                  <li>
                    <Link href="/order?type=partnership" className="hover:text-white transition">
                      Daftar Kemitraan
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Kontak</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Email: info@ajibdarkah.com</li>
                  <li>WhatsApp: +62 XXX XXX XXX</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>Copyright © {new Date().getFullYear()} Ajib Darkah Indonesia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

