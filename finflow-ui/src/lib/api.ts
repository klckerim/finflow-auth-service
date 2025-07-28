export const getWallets = async () => {
  const res = await fetch('http://localhost:5000/api/wallets');
  return res.json();
};
