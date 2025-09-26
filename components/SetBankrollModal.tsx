import React, { useState, useEffect } from 'react';

interface SetBankrollModalProps {
  onClose: () => void;
  onSetBankroll: (amount: number) => void;
  currentBankroll: number;
}

const SetBankrollModal: React.FC<SetBankrollModalProps> = ({ onClose, onSetBankroll, currentBankroll }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setAmount(currentBankroll > 0 ? currentBankroll.toFixed(2) : '');
  }, [currentBankroll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!isNaN(amountNum) && amountNum >= 0) {
      onSetBankroll(amountNum);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestionar Bankroll</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bankroll-amount" className="text-sm text-slate-400 mb-1 block">
              {currentBankroll > 0 ? 'Actualizar Bankroll' : 'Establecer Bankroll Inicial'}
            </label>
            <input
              type="number"
              id="bankroll-amount"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-lg focus:ring-accent focus:border-accent"
            />
            <p className="text-xs text-slate-500 mt-2">
                Introduce tu capital total disponible para apostar. Se actualizará automáticamente con tus apuestas, ingresos y retiros.
            </p>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetBankrollModal;
