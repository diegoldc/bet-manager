import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Bet365Logo, BwinLogo, CodereLogo, WilliamHillLogo, _888sportLogo } from './icons';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  transactionToEdit?: Transaction | null;
}

const popularBookmakers = ['Bet365', 'Bwin', 'Codere', 'William Hill', '888sport'];
const bookmakerLogos: { [key: string]: React.FC } = {
    'Bet365': Bet365Logo,
    'Bwin': BwinLogo,
    'Codere': CodereLogo,
    'William Hill': WilliamHillLogo,
    '888sport': _888sportLogo,
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAddTransaction, onUpdateTransaction, transactionToEdit }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.Deposit);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookmaker, setBookmaker] = useState('');
  const [notes, setNotes] = useState('');

  const [customBookmaker, setCustomBookmaker] = useState('');
  const [showCustomBookmaker, setShowCustomBookmaker] = useState(false);

  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isEditing) {
        setType(transactionToEdit.type);
        setAmount(transactionToEdit.amount.toString());
        setDate(transactionToEdit.date);
        setBookmaker(transactionToEdit.bookmaker || '');
        setNotes(transactionToEdit.notes || '');

        const isPopular = popularBookmakers.includes(transactionToEdit.bookmaker || '');
        if (!isPopular && transactionToEdit.bookmaker) {
            setShowCustomBookmaker(true);
            setCustomBookmaker(transactionToEdit.bookmaker);
        }
    }
  }, [transactionToEdit, isEditing]);


  const handleBookmakerSelect = (name: string) => {
    if (name === 'Otra') {
      setShowCustomBookmaker(true);
      setBookmaker(customBookmaker);
    } else {
      setShowCustomBookmaker(false);
      setBookmaker(name);
      setCustomBookmaker('');
    }
  };

  const handleCustomBookmakerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBookmaker(e.target.value);
    setBookmaker(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;

    if (isEditing) {
        onUpdateTransaction({
            id: transactionToEdit.id,
            type,
            amount: amountNum,
            date,
            bookmaker,
            notes,
        });
    } else {
        onAddTransaction({
            type,
            amount: amountNum,
            date,
            bookmaker,
            notes,
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{isEditing ? 'Editar Transacción' : 'Añadir Transacción'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Tipo de Transacción</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType(TransactionType.Deposit)}
                className={`w-full p-3 rounded-lg font-semibold transition-colors ${
                  type === TransactionType.Deposit ? 'bg-red-500 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.Withdrawal)}
                className={`w-full p-3 rounded-lg font-semibold transition-colors ${
                  type === TransactionType.Withdrawal ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Retiro
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="amount" className="text-sm text-slate-400 mb-1 block">Cantidad (€)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="date" className="text-sm text-slate-400 mb-1 block">Fecha</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Casa de Apuestas (Opcional)</label>
            <div className="flex flex-wrap gap-2">
                 {popularBookmakers.map(name => {
                    const LogoComponent = bookmakerLogos[name];
                    return (
                        <button key={name} type="button" onClick={() => handleBookmakerSelect(name)}
                            className={`p-2 h-12 w-24 rounded-lg transition-all duration-200 flex items-center justify-center ${bookmaker === name && !showCustomBookmaker ? 'bg-white ring-2 ring-accent' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {LogoComponent && <LogoComponent />}
                        </button>
                    )
                })}
                <button type="button" onClick={() => handleBookmakerSelect('Otra')}
                    className={`px-4 py-2 h-12 text-sm rounded-lg transition-colors flex items-center justify-center font-semibold ${showCustomBookmaker ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    Otra
                </button>
            </div>
            {showCustomBookmaker && (
                <input type="text" placeholder="Casa de Apuestas Personalizada" value={customBookmaker} onChange={handleCustomBookmakerChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white mt-2"
                />
            )}
          </div>
          <div>
            <label htmlFor="notes" className="text-sm text-slate-400 mb-1 block">Notas (Opcional)</label>
            <textarea
              id="notes"
              placeholder="Ej: Bono de bienvenida"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;