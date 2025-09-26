import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bet, BetStatus, Selection, SelectionStatus, Transaction, TransactionType } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BetList from './components/BetList';
import AddBetModal from './components/AddBetModal';
import History from './components/History';
import { ChartIcon, HistoryIcon, TicketIcon } from './components/icons';
import AddTransactionModal from './components/AddTransactionModal';
import SetBankrollModal from './components/SetBankrollModal';

const App: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankroll, setBankroll] = useState<number>(0);

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBankrollModalOpen, setIsBankrollModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'bets' | 'history'>('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    try {
      const storedBets = localStorage.getItem('sportBets');
      if (storedBets) setBets(JSON.parse(storedBets));

      const storedTransactions = localStorage.getItem('sportTransactions');
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      
      const storedBankroll = localStorage.getItem('sportBankroll');
      if (storedBankroll) setBankroll(JSON.parse(storedBankroll));

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sportBets', JSON.stringify(bets));
    } catch (error) {
      console.error("Failed to save bets to localStorage", error);
    }
  }, [bets]);

  useEffect(() => {
    try {
        localStorage.setItem('sportTransactions', JSON.stringify(transactions));
    } catch (error) {
        console.error("Failed to save transactions to localStorage", error);
    }
  }, [transactions]);

  useEffect(() => {
    try {
        localStorage.setItem('sportBankroll', JSON.stringify(bankroll));
    } catch (error) {
        console.error("Failed to save bankroll to localStorage", error);
    }
  }, [bankroll]);

  const handleAddBet = useCallback((newBet: Omit<Bet, 'id'>) => {
    const betWithId: Bet = {
      ...newBet,
      id: crypto.randomUUID(),
    };
    setBets(prevBets => [betWithId, ...prevBets]);
    setIsBetModalOpen(false);
  }, []);

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  }

  const handleOpenAddTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };
  
  const handleOpenEditTransactionModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId: Transaction = {
        ...newTransaction,
        id: crypto.randomUUID(),
    };
    setTransactions(prev => [transactionWithId, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    if (newTransaction.type === TransactionType.Deposit) {
        setBankroll(prev => prev + newTransaction.amount);
    } else {
        setBankroll(prev => prev - newTransaction.amount);
    }
    handleCloseTransactionModal();
  }, []);
  
  const handleUpdateTransaction = useCallback((updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    if (!oldTransaction) return;

    setBankroll(prevBankroll => {
      let newBankroll = prevBankroll;
      // Reverse old transaction
      if (oldTransaction.type === TransactionType.Deposit) {
        newBankroll -= oldTransaction.amount;
      } else {
        newBankroll += oldTransaction.amount;
      }
      // Apply new transaction
      if (updatedTransaction.type === TransactionType.Deposit) {
        newBankroll += updatedTransaction.amount;
      } else {
        newBankroll -= updatedTransaction.amount;
      }
      return newBankroll;
    });
    
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    handleCloseTransactionModal();
  }, [transactions]);

  const handleDeleteTransaction = useCallback((transactionToDelete: Transaction) => {
    // Check if the transaction actually exists in the current state to be safe
    const transactionExists = transactions.some(t => t.id === transactionToDelete.id);
    if (!transactionExists) {
      console.warn("Attempted to delete a transaction that does not exist in the current state.");
      return;
    }
    
    let newBankroll = bankroll;
    if (transactionToDelete.type === TransactionType.Deposit) {
        newBankroll -= transactionToDelete.amount;
    } else {
        newBankroll += transactionToDelete.amount;
    }
    setBankroll(newBankroll);

    const newTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
    setTransactions(newTransactions);
  }, [transactions, bankroll]);


  const handleSetBankroll = useCallback((amount: number) => {
      setBankroll(amount);
      setIsBankrollModalOpen(false);
  }, []);


  const recalculateBetStatusAndProfit = (bet: Bet): Bet => {
    const { selections, stake } = bet;

    if (selections.some(s => s.status === SelectionStatus.Lost)) {
      return { ...bet, status: BetStatus.Lost, profit: -stake };
    }

    if (selections.some(s => s.status === SelectionStatus.Pending)) {
        return { ...bet, status: BetStatus.Pending, profit: 0 };
    }
    
    if (selections.every(s => s.status === SelectionStatus.Void)) {
        return { ...bet, status: BetStatus.Void, profit: 0 };
    }

    let effectiveOdds = 1;
    selections.forEach(selection => {
        if (selection.status === SelectionStatus.Won) {
            effectiveOdds *= selection.odds;
        }
    });
    
    const finalProfit = (stake * effectiveOdds) - stake;
    return { ...bet, status: BetStatus.Won, profit: finalProfit };
  };

  const handleUpdateSelectionStatus = useCallback((betId: string, selectionId: string, newStatus: SelectionStatus) => {
    setBets(prevBets => {
        const oldBet = prevBets.find(b => b.id === betId);
        if (!oldBet) return prevBets;

        const oldProfit = oldBet.profit;

        const updatedSelections = oldBet.selections.map(selection =>
            selection.id === selectionId ? { ...selection, status: newStatus } : selection
        );
        const updatedBetWithSelections = { ...oldBet, selections: updatedSelections };
        const finalUpdatedBet = recalculateBetStatusAndProfit(updatedBetWithSelections);

        const newProfit = finalUpdatedBet.profit;
        const profitDelta = newProfit - oldProfit;

        if (profitDelta !== 0) {
            setBankroll(prevBankroll => prevBankroll + profitDelta);
        }

        return prevBets.map(b => (b.id === betId ? finalUpdatedBet : b));
    });
  }, []);

  const handleDeleteBet = useCallback((betId: string) => {
    const betToDelete = bets.find(b => b.id === betId);
    if (betToDelete && betToDelete.profit !== 0) {
        setBankroll(prev => prev - betToDelete.profit);
    }
    setBets(prevBets => prevBets.filter(bet => bet.id !== betId));
  }, [bets]);

  const stats = useMemo(() => {
    // Bet stats
    const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0);
    const settledBets = bets.filter(b => b.status === BetStatus.Won || b.status === BetStatus.Lost);
    const wonBets = settledBets.filter(b => b.status === BetStatus.Won);
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    const winRate = settledBets.length > 0 ? (wonBets.length / settledBets.length) * 100 : 0;
    
    // Transaction stats
    const totalDeposited = transactions.filter(t => t.type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = transactions.filter(t => t.type === 'WITHDRAWAL').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalWithdrawn - totalDeposited;

    return { totalStaked, totalProfit, roi, winRate, totalBets: bets.length, totalDeposited, totalWithdrawn, netBalance, bankroll };
  }, [bets, transactions, bankroll]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onAddBetClick={() => setIsBetModalOpen(true)} />

        <div className="mb-6 border-b border-slate-700">
            <nav className="flex -mb-px space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeView === 'dashboard'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                    <ChartIcon className="h-5 w-5" />
                    General
                </button>
                <button
                    onClick={() => setActiveView('bets')}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeView === 'bets'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                    <TicketIcon className="h-5 w-5" />
                    Apuestas
                </button>
                <button
                    onClick={() => setActiveView('history')}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeView === 'history'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                    <HistoryIcon className="h-5 w-5" />
                    Historial
                </button>
            </nav>
        </div>

        <main>
          {activeView === 'dashboard' && (
            <Dashboard 
                stats={stats} 
                bets={bets} 
                transactions={transactions}
                onAddTransactionClick={handleOpenAddTransactionModal}
                onManageBankrollClick={() => setIsBankrollModalOpen(true)}
                onEditTransaction={handleOpenEditTransactionModal}
                onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {activeView === 'bets' && <BetList bets={bets} onUpdateSelectionStatus={handleUpdateSelectionStatus} onDelete={handleDeleteBet} />}
          {activeView === 'history' && <History bets={bets} />}
        </main>
      </div>
      {isBetModalOpen && <AddBetModal onClose={() => setIsBetModalOpen(false)} onAddBet={handleAddBet} />}
      {isTransactionModalOpen && <AddTransactionModal 
                                    key={editingTransaction?.id || 'new'}
                                    onClose={handleCloseTransactionModal} 
                                    onAddTransaction={handleAddTransaction}
                                    onUpdateTransaction={handleUpdateTransaction}
                                    transactionToEdit={editingTransaction} 
                                />}
      {isBankrollModalOpen && <SetBankrollModal onClose={() => setIsBankrollModalOpen(false)} onSetBankroll={handleSetBankroll} currentBankroll={bankroll} />}
    </div>
  );
};

export default App;