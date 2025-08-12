'use client';
import { motion } from 'framer-motion';

export function EmptyWalletHero() {
  return (
    <motion.div
      className="text-center mt-16 flex flex-col items-center gap-4 p-6 "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 10, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <img
        src="/icons/wallet.svg"
        alt="Empty Wallet"
        className="w-48 h-48 sm:w-64 sm:h-64 opacity-90"
      />
      <h2 className="text-2xl font-semibold">No wallet yet</h2>
      <p className="text-muted-foreground max-w-md">
        Create your first wallet to manage your budget and track spending in one place.
      </p>
    </motion.div>
  );
}
