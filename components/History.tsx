import React, { useState, useMemo } from 'react';
import { Bet, BetStatus } from '../types';
import BookmakerLogo from './BookmakerLogo';

const BetStatusBadge: React.FC<{ status: BetStatus }> = ({ status }) => {
  const statusStyles: { [key in BetStatus]: string } = {
    [BetStatus.Won]: 'bg-emerald-500/20 text-emerald-400',
    [BetStatus.Lost]: 'bg-red-500/20 text-red-400',
    [BetStatus.Pending]: 'bg-amber-500/20 text-amber-400',
    [BetStatus.Void]: 'bg-slate-500/20 text-slate-400',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};


const HistoryBetItem: React.FC<{ bet: Bet }> = ({ bet }) => {
  const formattedDate = new Date(bet.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
      <div className="col-span-2">
        <p className="font-bold text-white truncate">{bet.name}</p>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{formattedDate} {bet.time && `- ${bet.time}`}</span>
          {bet.bookmaker && <><span>|</span> <BookmakerLogo name={bet.bookmaker} /></>}
        </div>
      </div>
      <div className="text-sm">
        <p className="text-slate-400">Stake</p>
        <p className="font-semibold text-white">{bet.stake.toFixed(2)}€</p>
      </div>
      <div className="text-sm">
        <p className="text-slate-400">Beneficio</p>
        <p className={`font-bold ${bet.profit > 0 ? 'text-emerald-400' : bet.profit < 0 ? 'text-red-400' : 'text-slate-300'}`}>
          {bet.profit.toFixed(2)}€
        </p>
      </div>
      <div className="flex justify-end">
        <BetStatusBadge status={bet.status} />
      </div>
    </div>
  );
};

const filterOptions = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Ganadas', value: BetStatus.Won },
    { label: 'Perdidas', value: BetStatus.Lost },
    { label: 'Nulas', value: BetStatus.Void },
];

interface HistoryProps {
  bets: Bet[];
}

const History: React.FC<HistoryProps> = ({ bets }) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<BetStatus | 'ALL'>('ALL');

  const historicalBets = useMemo(() => {
    const settled = bets.filter(bet => 
        bet.status === BetStatus.Won || 
        bet.status === BetStatus.Lost || 
        bet.status === BetStatus.Void
    );
    
    const statusFiltered = settled.filter(bet => {
        if (activeFilter === 'ALL') return true;
        return bet.status === activeFilter;
    });

    const dateFiltered = statusFiltered.filter(bet => {
        const betDate = new Date(bet.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        if (start && betDate < start) return false;
        if (end && betDate > end) return false;
        
        return true;
    });

    return dateFiltered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
      return dateB.getTime() - dateA.getTime();
    });

  }, [bets, activeFilter, startDate, endDate]);

  return (
    <div className="mt-2">
      <h2 className="pl-4 border-l-4 border-accent text-2xl font-bold text-white mb-4 tracking-tight">Historial de Apuestas</h2>
      
      <div className="bg-slate-800 p-4 rounded-lg mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value as BetStatus | 'ALL')}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeFilter === option.value ? 'bg-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-sm text-slate-400">Desde:</label>
                <input 
                    type="date" 
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:ring-accent focus:border-accent"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-sm text-slate-400">Hasta:</label>
                <input 
                    type="date" 
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:ring-accent focus:border-accent"
                />
            </div>
        </div>
      </div>

      {historicalBets.length > 0 ? (
        <div className="space-y-3">
          {historicalBets.map(bet => (
            <HistoryBetItem key={bet.id} bet={bet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-800 rounded-lg">
          <p className="text-slate-400">No hay apuestas en el historial que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default History;