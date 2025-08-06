'use client';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.div
      className="text-center mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img src="/hero-icon.svg" alt="FinFlow" className="mx-auto w-24 h-24 mb-4" />
      <h1 className="text-3xl md:text-4xl font-bold text-white">FinFlow</h1>
      <p className="text-gray-400 mt-2">Finansal kararlarını akıllıca yönet.</p>
    </motion.div>
  );
}
