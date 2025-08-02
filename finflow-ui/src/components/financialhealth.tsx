/**
 * Interactive financial health widget.
 */
export const FinancialHealth = () => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Finansal Sağlık</h3>
        <span className="text-lg font-bold text-green-600">78%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: '78%' }}
        />
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        <p>Son 30 günde <span className="text-green-600">%12 iyileşme</span></p>
      </div>
    </div>
  );
};