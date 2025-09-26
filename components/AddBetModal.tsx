import React, { useState, useMemo, useCallback } from 'react';
import { Bet, BetStatus, Selection, SelectionStatus, Sport } from '../types';
import { PlusIcon, TrashIcon, FootballIcon, BasketballIcon, TennisIcon, F1Icon, UFCIcon, Bet365Logo, BwinLogo, CodereLogo, WilliamHillLogo, _888sportLogo } from './icons';

interface AddBetModalProps {
  onClose: () => void;
  onAddBet: (bet: Omit<Bet, 'id'>) => void;
}

const sports = [
    { type: Sport.Football, icon: FootballIcon, label: 'Fútbol' },
    { type: Sport.Basketball, icon: BasketballIcon, label: 'Baloncesto' },
    { type: Sport.Tennis, icon: TennisIcon, label: 'Tenis' },
    { type: Sport.F1, icon: F1Icon, label: 'F1' },
    { type: Sport.UFC, icon: UFCIcon, label: 'UFC' },
];

const teamSports = [Sport.Football, Sport.Basketball, Sport.Tennis];

const marketOptionsBySport = {
    [Sport.Football]: [
        { name: 'Resultado Final', type: '1X2' },
        { name: 'Total Goles', type: 'OVER_UNDER', line: 2.5 },
        { name: 'Ambos Equipos Marcan', type: 'YES_NO' },
        { name: 'Total Córners', type: 'OVER_UNDER', line: 9.5 },
        { name: 'Total Tarjetas', type: 'OVER_UNDER', line: 4.5 },
        { name: 'Otro', type: 'CUSTOM' },
    ],
    [Sport.Basketball]: [
        { name: 'Ganador (Inc. Prórroga)', type: '12' },
        { name: 'Total Puntos', type: 'OVER_UNDER', line: 210.5 },
        { name: 'Hándicap', type: 'HANDICAP', line: 5.5 },
        { name: 'Otro', type: 'CUSTOM' },
    ],
    [Sport.Tennis]: [
        { name: 'Ganador del Partido', type: '12' },
        { name: 'Total Juegos', type: 'OVER_UNDER', line: 22.5 },
        { name: 'Otro', type: 'CUSTOM' },
    ],
    [Sport.F1]: [{ name: 'Ganador de la Carrera', type: 'CUSTOM' }, { name: 'Podio', type: 'CUSTOM' }, { name: 'Otro', type: 'CUSTOM' }],
    [Sport.UFC]: [{ name: 'Ganador del Combate', type: '12' }, { name: 'Método de Victoria', type: 'CUSTOM' }, { name: 'Otro', type: 'CUSTOM' }],
};

const popularBookmakers = ['Bet365', 'Bwin', 'Codere', 'William Hill', '888sport'];
const bookmakerLogos: { [key: string]: React.FC } = {
    'Bet365': Bet365Logo,
    'Bwin': BwinLogo,
    'Codere': CodereLogo,
    'William Hill': WilliamHillLogo,
    '888sport': _888sportLogo,
};


const SportIcon: React.FC<{ sport: Sport; className?: string }> = ({ sport, className = 'w-5 h-5' }) => {
    const Icon = sports.find(s => s.type === sport)?.icon;
    return Icon ? <Icon className={className} /> : null;
}

const AddBetModal: React.FC<AddBetModalProps> = ({ onClose, onAddBet }) => {
  const [selections, setSelections] = useState<Omit<Selection, 'id' | 'status'>[]>([]);
  
  // State for building a single selection
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.Football);
  const [eventDetails, setEventDetails] = useState({ homeTeam: '', awayTeam: '', event: '' });
  const [activeMarket, setActiveMarket] = useState<any | null>(null);
  const [pickDetails, setPickDetails] = useState<any>({});
  const [odds, setOdds] = useState('');
  const [detailedPick, setDetailedPick] = useState('');

  const [betName, setBetName] = useState('');
  const [stake, setStake] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  
  const [bookmaker, setBookmaker] = useState('');
  const [customBookmaker, setCustomBookmaker] = useState('');
  const [showCustomBookmaker, setShowCustomBookmaker] = useState(false);

  const resetSelectionForm = () => {
    setEventDetails({ homeTeam: '', awayTeam: '', event: '' });
    setActiveMarket(null);
    setPickDetails({});
    setOdds('');
    setDetailedPick('');
  };

  const handleAddSelection = () => {
    const oddsNum = parseFloat(odds);
    if (!activeMarket || !oddsNum || oddsNum <= 1) return;

    const eventName = teamSports.includes(selectedSport) 
      ? `${eventDetails.homeTeam} vs ${eventDetails.awayTeam}` 
      : eventDetails.event;

    if (!eventName.trim() || eventName.trim() === 'vs') return;

    let finalPick = '';
    if (activeMarket.type === 'CUSTOM') {
        finalPick = pickDetails.customPick || '';
    } else if (pickDetails.choice) {
        finalPick = pickDetails.choice;
    }

    if (!finalPick) return;

    setSelections([...selections, { 
        event: eventName,
        market: pickDetails.customMarket || activeMarket.name,
        pick: finalPick,
        detailedPick: detailedPick,
        odds: oddsNum,
        sport: selectedSport
    }]);
    resetSelectionForm();
  };
  
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


  const { totalOdds, potentialReturn } = useMemo(() => {
    const stakeNum = parseFloat(stake) || 0;
    if (selections.length === 0) return { totalOdds: 0, potentialReturn: 0 };
    const calculatedOdds = selections.reduce((acc, s) => acc * s.odds, 1);
    return {
      totalOdds: calculatedOdds,
      potentialReturn: stakeNum * calculatedOdds,
    };
  }, [selections, stake]);

  const handleRemoveSelection = (indexToRemove: number) => {
    setSelections(selections.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stakeNum = parseFloat(stake);
    if (selections.length > 0 && stakeNum > 0 && date) {
      const finalSelections: Selection[] = selections.map(s => ({
        ...s,
        id: crypto.randomUUID(),
        status: SelectionStatus.Pending,
      }));
      onAddBet({
        name: betName || finalSelections[0].event,
        selections: finalSelections,
        stake: stakeNum,
        totalOdds,
        potentialReturn,
        bookmaker,
        date,
        time,
        status: BetStatus.Pending,
        profit: 0,
      });
    }
  };
  
  const renderPickConfigurator = () => {
    if (!activeMarket) return null;

    const commonInputs = (
        <>
            <input type="number" step="0.01" placeholder="Cuota" value={odds} onChange={e => setOdds(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent" />
            <input type="text" placeholder="Pronóstico Detallado (Opcional)" value={detailedPick} onChange={e => setDetailedPick(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent" />
        </>
    );

    switch (activeMarket.type) {
        case '1X2':
        case '12':
            const options = activeMarket.type === '1X2' ? ['1', 'X', '2'] : ['1', '2'];
            return <div className="p-3 bg-slate-700/50 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2">
                    {options.map(opt => <button type="button" key={opt} onClick={() => setPickDetails({ choice: opt })} className={`p-2 rounded-md font-semibold ${pickDetails.choice === opt ? 'bg-accent text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>{opt}</button>)}
                </div>
                <div className="grid grid-cols-2 gap-2">{commonInputs}</div>
            </div>;
        case 'OVER_UNDER':
            return <div className="p-3 bg-slate-700/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPickDetails({ ...pickDetails, overUnder: 'Más de', choice: `Más de ${pickDetails.line || activeMarket.line}` })} className={`p-2 rounded-md font-semibold ${pickDetails.overUnder === 'Más de' ? 'bg-accent text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>Más de</button>
                    <button type="button" onClick={() => setPickDetails({ ...pickDetails, overUnder: 'Menos de', choice: `Menos de ${pickDetails.line || activeMarket.line}` })} className={`p-2 rounded-md font-semibold ${pickDetails.overUnder === 'Menos de' ? 'bg-accent text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>Menos de</button>
                </div>
                <input type="number" step="0.5" placeholder="Línea" defaultValue={activeMarket.line} onChange={e => setPickDetails({ ...pickDetails, line: e.target.value, choice: `${pickDetails.overUnder || 'Más de'} ${e.target.value}` })} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                 <div className="grid grid-cols-2 gap-2">{commonInputs}</div>
            </div>;
        case 'YES_NO':
             return <div className="p-3 bg-slate-700/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPickDetails({ choice: 'Sí' })} className={`p-2 rounded-md font-semibold ${pickDetails.choice === 'Sí' ? 'bg-accent text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>Sí</button>
                    <button type="button" onClick={() => setPickDetails({ choice: 'No' })} className={`p-2 rounded-md font-semibold ${pickDetails.choice === 'No' ? 'bg-accent text-white' : 'bg-slate-600 hover:bg-slate-500'}`}>No</button>
                </div>
                <div className="grid grid-cols-2 gap-2">{commonInputs}</div>
            </div>;
        case 'CUSTOM':
            return <div className="p-3 bg-slate-700/50 rounded-lg space-y-3">
                <input type="text" placeholder="Mercado Personalizado" onChange={e => setPickDetails({ ...pickDetails, customMarket: e.target.value })} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                <input type="text" placeholder="Selección Personalizada" onChange={e => setPickDetails({ ...pickDetails, customPick: e.target.value, choice: e.target.value })} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                <div className="grid grid-cols-2 gap-2">{commonInputs}</div>
            </div>;
        default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 transform transition-all max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Crear Boleto de Apuesta</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow space-y-6">
            {/* Paso 1: Crear Selección */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 pl-4 border-l-4 border-slate-600">Paso 1: Crear Selección</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-center gap-2 sm:gap-4 bg-slate-800 p-2 rounded-lg">
                        {sports.map(sport => (
                            <button type="button" key={sport.type} onClick={() => { setSelectedSport(sport.type); resetSelectionForm(); }}
                                className={`flex-1 flex flex-col items-center justify-center gap-2 p-2 rounded-md transition-all duration-200 ${selectedSport === sport.type ? 'bg-accent text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                                <sport.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                <span className="text-xs sm:text-sm font-semibold">{sport.label}</span>
                            </button>
                        ))}
                    </div>
                     {teamSports.includes(selectedSport) ? (
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Equipo Local" value={eventDetails.homeTeam} onChange={e => setEventDetails({...eventDetails, homeTeam: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent" />
                            <span className="text-slate-400 font-bold">vs</span>
                            <input type="text" placeholder="Equipo Visitante" value={eventDetails.awayTeam} onChange={e => setEventDetails({...eventDetails, awayTeam: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent" />
                        </div>
                     ) : (
                        <input type="text" placeholder="Nombre del Evento" value={eventDetails.event} onChange={e => setEventDetails({...eventDetails, event: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent" />
                     )}
                
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(marketOptionsBySport[selectedSport] || []).map(market => (
                            <button type="button" key={market.name} onClick={() => { setActiveMarket(market); setPickDetails(market.type === 'OVER_UNDER' && 'line' in market ? { overUnder: 'Más de', line: market.line, choice: `Más de ${market.line}` } : {})}}
                             className={`p-2 rounded-md text-sm font-semibold transition-colors ${activeMarket?.name === market.name ? 'bg-accent text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                {market.name}
                            </button>
                        ))}
                    </div>
                    {renderPickConfigurator()}
                </div>
                <button type="button" onClick={handleAddSelection} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent/20 text-accent font-semibold rounded-lg hover:bg-accent/30 transition-colors">
                    <PlusIcon /> Añadir Selección al Boleto
                </button>
            </div>

            {/* Paso 2: Tu Boleto */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 pl-4 border-l-4 border-slate-600">Paso 2: Tu Boleto</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg flex-grow flex flex-col">
                    <div className="space-y-2 flex-grow min-h-[100px] max-h-48 overflow-y-auto">
                        {selections.length > 0 ? selections.map((s, index) => (
                            <div key={index} className="bg-slate-700/50 p-3 rounded-md flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400"><SportIcon sport={s.sport} /></span>
                                    <div>
                                        <p className="font-semibold text-white">{s.event}</p>
                                        <p className="text-slate-300">{s.market}: {s.pick}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-accent">@{s.odds.toFixed(2)}</p>
                                    <button type="button" onClick={() => handleRemoveSelection(index)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon /></button>
                                </div>
                            </div>
                        )) : <p className="text-slate-500 text-center pt-8">Añade selecciones para crear tu boleto.</p>}
                    </div>
                </div>
            </div>

            {/* Paso 3: Detalles Finales */}
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-slate-200 pl-4 border-l-4 border-slate-600">Paso 3: Detalles Finales</h3>
                 <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
                    <input type="text" placeholder="Nombre del Boleto (Opcional)" value={betName} onChange={(e) => setBetName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="number" step="0.01" placeholder="Stake (€)" value={stake} onChange={(e) => setStake(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white sm:col-span-1" />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
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
                </div>
            </div>
        </div>

        <div className="flex-shrink-0 pt-4 mt-4 border-t border-slate-700/50">
             <div className="bg-slate-900/50 p-4 rounded-lg text-center grid grid-cols-3 gap-2 mb-4">
                <div>
                    <p className="text-sm text-slate-400">Selecciones</p>
                    <p className="font-bold text-white text-xl">{selections.length}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Cuota Total</p>
                    <p className="font-bold text-accent text-xl">@{totalOdds.toFixed(2)}</p>
                </div>
                 <div>
                    <p className="text-sm text-slate-400">Ganancia</p>
                    <p className="font-bold text-white text-xl">{potentialReturn.toFixed(2)}€</p>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={selections.length === 0 || !stake}>Guardar Apuesta</button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddBetModal;