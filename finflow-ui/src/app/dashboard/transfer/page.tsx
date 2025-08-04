

export default function TransferPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Transfer</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Hedef Cüzdan ID" className="input" />
        <input type="number" placeholder="Tutar" className="input" />
        <button type="submit" className="btn">Gönder</button>
      </form>
    </div>
  );
}