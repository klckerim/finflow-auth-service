export const getWallets = async () => {
  const res = await fetch('http://localhost:5001/api/wallets');
  return res.json();
};


