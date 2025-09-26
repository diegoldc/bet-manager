import React, { useState, useMemo } from 'react';
import { Bet, BetStatus, Selection, SelectionStatus, Sport } from '../types';
import { ChevronDownIcon, CheckIcon, CrossIcon, ReturnIcon, TrashIcon, ChevronUpIcon, FootballIcon, BasketballIcon, TennisIcon, F1Icon, UFCIcon } from './icons';
import BookmakerLogo from './BookmakerLogo';

interface BetListProps {
  bets: Bet[];
  onUpdateSelectionStatus: (betId: string, selectionId: string, newStatus: SelectionStatus) => void;
  onDelete: (betId: string) => void;
}

const SportIcon: React.FC<{ sport: Sport, className?: string }> = ({ sport, className = "w-5 h-5" }) => {
    switch (sport) {
        case Sport.Football:
            return <FootballIcon className={className} />;
        case Sport.Basketball:
            return <BasketballIcon className={className} />;
        case Sport.Tennis:
            return <TennisIcon className={className} />;
        case Sport.F1:
            return <F1Icon className={className} />;
        case Sport.UFC:
            return <UFCIcon className={className} />;
        default:
            return null;
    }
}

const BetStatusBadge: React.FC<{ status: BetStatus | SelectionStatus }> = ({ status }) => {
  const statusStyles: { [key in BetStatus | SelectionStatus]: string } = {
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

const SelectionActions: React.FC<{ selection: Selection, betId: string, onUpdateSelectionStatus: (betId: string, selectionId: string, newStatus: SelectionStatus) => void }> = ({ selection, betId, onUpdateSelectionStatus }) => {
  if (selection.status !== SelectionStatus.Pending) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={() => onUpdateSelectionStatus(betId, selection.id, SelectionStatus.Won)}
        className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
        aria-label="Marcar como Ganada"
        title="Ganada"
      >
        <CheckIcon />
      </button>
      <button
        onClick={() => onUpdateSelectionStatus(betId, selection.id, SelectionStatus.Lost)}
        className="p-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 transition-colors"
        aria-label="Marcar como Perdida"
        title="Perdida"
      >
        <CrossIcon />
      </button>
      <button
        onClick={() => onUpdateSelectionStatus(betId, selection.id, SelectionStatus.Void)}
        className="p-1.5 rounded-full bg-slate-500/10 text-slate-400 hover:bg-slate-500/30 transition-colors"
        aria-label="Marcar como Nula"
        title="Nula"
      >
        <ReturnIcon />
      </button>
    </div>
  );
};

const BetItem: React.FC<{ bet: Bet; onUpdateSelectionStatus: (betId: string, selectionId: string, newStatus: SelectionStatus) => void; onDelete: (id: string) => void; }> = ({ bet, onUpdateSelectionStatus, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = new Date(bet.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-slate-800 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:bg-slate-700/50">
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <p className="font-bold text-white truncate">{bet.name || bet.selections[0].event}</p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{formattedDate} {bet.time && `- ${bet.time}`}</span>
              {bet.bookmaker && <><span>|</span> <BookmakerLogo name={bet.bookmaker} /></>}
              <span>| {bet.selections.length} Selección(es)</span>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-slate-400">Stake</p>
            <p className="font-semibold text-white">{bet.stake.toFixed(2)}€</p>
          </div>
          <div className="text-sm">
            <p className="text-slate-400">Cuota Total</p>
            <p className="font-semibold text-white">@{bet.totalOdds.toFixed(2)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
            <BetStatusBadge status={bet.status} />
            <button className="p-1 rounded-full hover:bg-slate-700 text-slate-400">
              {isExpanded ? <ChevronUpIcon/> : <ChevronDownIcon />}
            </button>
            <button onClick={(e) => {e.stopPropagation(); onDelete(bet.id)}} className="p-1.5 rounded-full text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <TrashIcon />
            </button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-slate-700/50 px-4 pb-4 pt-2">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Selecciones</h4>
            <div className="space-y-2">
                {bet.selections.map(selection => (
                    <div key={selection.id} className="grid grid-cols-6 gap-2 items-center text-sm bg-slate-700/40 p-2 rounded-md">
                        <div className="flex items-center justify-center text-slate-400">
                           <SportIcon sport={selection.sport} />
                        </div>
                        <div className="col-span-2">
                            <p className="font-medium text-white">{selection.event}</p>
                            <p className="text-slate-400">{selection.market}: <span className="text-slate-300 font-semibold">{selection.pick}</span></p>
                            {selection.detailedPick && <p className="text-xs text-slate-500 italic mt-1">"{selection.detailedPick}"</p>}
                        </div>
                        <div>
                            <p className="text-slate-400">Cuota</p>
                            <p className="font-semibold text-white">@{selection.odds.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-center">
                            <BetStatusBadge status={selection.status}/>
                        </div>
                        <div className="flex justify-end">
                           <SelectionActions selection={selection} betId={bet.id} onUpdateSelectionStatus={onUpdateSelectionStatus} />
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 text-right text-sm">
                <p className="text-slate-400">Ganancia Potencial: <span className="font-bold text-white">{bet.potentialReturn.toFixed(2)}€</span></p>
                <p className="text-slate-400">Beneficio Actual: 
                    <span className={`font-bold ${bet.profit > 0 ? 'text-emerald-400' : bet.profit < 0 ? 'text-red-400' : 'text-slate-300'}`}> {bet.profit.toFixed(2)}€</span>
                </p>
             </div>
        </div>
      )}
    </div>
  );
};

const filterOptions = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Pendientes', value: BetStatus.Pending },
    { label: 'Ganadas', value: BetStatus.Won },
    { label: 'Perdidas', value: BetStatus.Lost },
    { label: 'Nulas', value: BetStatus.Void },
];

const sortOptions = [
    { label: 'Fecha (Más recientes)', value: 'date-desc' },
    { label: 'Fecha (Más antiguas)', value: 'date-asc' },
    { label: 'Stake (Mayor)', value: 'stake-desc' },
    { label: 'Stake (Menor)', value: 'stake-asc' },
    { label: 'Ganancia Potencial (Mayor)', value: 'potential-desc' },
    { label: 'Ganancia Potencial (Menor)', value: 'potential-asc' },
];

const getBetDateTime = (bet: Bet) => new Date(`${bet.date}T${bet.time || '00:00:00'}`).getTime();

const BetList: React.FC<BetListProps> = ({ bets, onUpdateSelectionStatus, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState<BetStatus | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<string>('date-desc');
  const [bookmakerFilter, setBookmakerFilter] = useState<string>('ALL');

  const bookmakers = useMemo(() => {
    const all = bets
      .map(b => b.bookmaker)
      .filter((b): b is string => !!b && b.trim() !== '');
    return ['ALL', ...Array.from(new Set(all))];
  }, [bets]);

  const displayedBets = useMemo(() => {
    const filteredByStatus = bets.filter(bet => {
        if (activeFilter === 'ALL') return true;
        return bet.status === activeFilter;
    });

    const filteredByBookmaker = filteredByStatus.filter(bet => {
        if (bookmakerFilter === 'ALL') return true;
        return bet.bookmaker === bookmakerFilter;
    });

    const sorted = [...filteredByBookmaker];
    switch (sortOrder) {
        case 'date-desc':
            return sorted.sort((a, b) => getBetDateTime(b) - getBetDateTime(a));
        case 'date-asc':
            return sorted.sort((a, b) => getBetDateTime(a) - getBetDateTime(b));
        case 'stake-desc':
            return sorted.sort((a, b) => b.stake - a.stake);
        case 'stake-asc':
            return sorted.sort((a, b) => a.stake - b.stake);
        case 'potential-desc':
            return sorted.sort((a, b) => b.potentialReturn - a.potentialReturn);
        case 'potential-asc':
            return sorted.sort((a, b) => a.potentialReturn - b.potentialReturn);
        default:
            return sorted;
    }
  }, [bets, activeFilter, sortOrder, bookmakerFilter]);


  if (bets.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800 rounded-lg">
        <p className="text-slate-400">No hay apuestas registradas.</p>
        <p className="text-slate-500 text-sm">Añade tu primera apuesta para empezar.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="pl-4 border-l-4 border-accent text-2xl font-bold text-white mb-4 tracking-tight">Mis Apuestas</h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
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
          {bookmakers.length > 1 && (
            <div>
              <select 
                  value={bookmakerFilter}
                  onChange={(e) => setBookmakerFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:ring-accent focus:border-accent"
              >
                  {bookmakers.map(b => (
                      <option key={b} value={b}>{b === 'ALL' ? 'Todas las casas' : b}</option>
                  ))}
              </select>
            </div>
          )}
          <div>
              <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:ring-accent focus:border-accent"
              >
                  {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
              </select>
          </div>
        </div>
      </div>

      {displayedBets.length > 0 ? (
        <div className="space-y-3">
            {displayedBets.map(bet => (
            <BetItem key={bet.id} bet={bet} onUpdateSelectionStatus={onUpdateSelectionStatus} onDelete={onDelete} />
            ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-800 rounded-lg">
            <p className="text-slate-400">No hay apuestas que coincidan con el filtro seleccionado.</p>
        </div>
      )}
    </div>
  );
};

export default BetList;