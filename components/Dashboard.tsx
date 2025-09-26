import React, { useMemo, useState } from 'react';
import { Bet, BetStatus, Sport, Transaction, TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import StatCard from './StatCard';
import { ChartIcon, DollarIcon, PercentIcon, TargetIcon, BarChartIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, ScaleIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, EuroCoinIcon, PencilIcon, TrashIcon, TrendingUpIcon } from './icons';
import BookmakerLogo from './BookmakerLogo';

interface DashboardProps {
  stats: {
    totalStaked: number;
    totalProfit: number;
    roi: number;
    winRate: number;
    totalBets: number;
    totalDeposited: number;
    totalWithdrawn: number;
    netBalance: number;
    bankroll: number;
  };
  bets: Bet[];
  transactions: Transaction[];
  onAddTransactionClick: () => void;
  onManageBankrollClick: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

type ChartType = 'profitEvolution' | 'profitBySport' | 'bankrollEvolution';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const name = payload[0].name;
    return (
      <div className="bg-slate-800 p-3 border border-slate-700 rounded-lg shadow-lg">
        <p className="label text-slate-300">{label}</p>
        <p className={`intro ${value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{`${name}: ${value.toFixed(2)}€`}</p>
      </div>
    );
  }
  return null;
};

const sportLabels: { [key in Sport]: string } = {
    [Sport.Football]: 'Fútbol',
    [Sport.Basketball]: 'Baloncesto',
    [Sport.Tennis]: 'Tenis',
    [Sport.F1]: 'F1',
    [Sport.UFC]: 'UFC',
};

const Dashboard: React.FC<DashboardProps> = ({ stats, bets, transactions, onAddTransactionClick, onManageBankrollClick, onEditTransaction, onDeleteTransaction }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('profitEvolution');
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(false);

  const settledBets = useMemo(() => 
    bets.filter(b => b.status === BetStatus.Won || b.status === BetStatus.Lost),
    [bets]
  );
  
  const profitEvolutionData = useMemo(() => {
    const sortedBets = [...settledBets].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
        return dateA.getTime() - dateB.getTime();
    });
    let cumulativeProfit = 0;
    const data = sortedBets.map(bet => {
      cumulativeProfit += bet.profit;
      return {
        date: new Date(bet.date).toLocaleDateString(),
        'Beneficio Acumulado': cumulativeProfit,
      };
    });
    return [{ date: 'Inicio', 'Beneficio Acumulado': 0 }, ...data];
  }, [settledBets]);


  const profitBySportData = useMemo(() => {
    const profitBySport: { [key in Sport]?: number } = {};
    
    settledBets.forEach(bet => {
        if (bet.selections.length > 0) {
            // Simple approach: assign bet profit to the sport of the first selection
            const sport = bet.selections[0].sport;
            if (!profitBySport[sport]) {
                profitBySport[sport] = 0;
            }
            profitBySport[sport]! += bet.profit;
        }
    });

    return Object.entries(profitBySport).map(([sport, profit]) => ({
        sport: sportLabels[sport as Sport],
        Beneficio: profit,
    }));
  }, [settledBets]);
  
  const bankrollEvolutionData = useMemo(() => {
    const betEvents = settledBets.map(b => ({
      date: new Date(`${b.date}T${b.time || '23:59:59'}`).getTime(),
      change: b.profit
    }));

    const transactionEvents = transactions.map(t => ({
      date: new Date(t.date).getTime(),
      change: t.type === TransactionType.Deposit ? t.amount : -t.amount
    }));

    const allEvents = [...betEvents, ...transactionEvents].sort((a, b) => b.date - a.date);

    let currentBankroll = stats.bankroll;
    const dataPoints = [{
      date: new Date().toLocaleDateString(),
      'Bankroll': currentBankroll
    }];

    for (const event of allEvents) {
      currentBankroll -= event.change;
      dataPoints.push({
        date: new Date(event.date).toLocaleDateString(),
        'Bankroll': currentBankroll
      });
    }

    return dataPoints.reverse();
  }, [settledBets, transactions, stats.bankroll]);

  const displayedTransactions = isTransactionsExpanded ? transactions : transactions.slice(0, 2);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="pl-4 border-l-4 border-accent text-2xl font-bold text-white mb-4 tracking-tight">Resumen de Apuestas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Beneficio Total"
            value={`${stats.totalProfit.toFixed(2)}€`}
            icon={<DollarIcon />}
            isPositive={stats.totalProfit >= 0}
            delay={0}
          />
          <StatCard
            title="Total Apostado"
            value={`${stats.totalStaked.toFixed(2)}€`}
            icon={<ChartIcon className="w-6 h-6"/>}
            delay={0.1}
          />
          <StatCard
            title="ROI"
            value={`${stats.roi.toFixed(2)}%`}
            icon={<PercentIcon />}
            isPositive={stats.roi >= 0}
            delay={0.2}
          />
          <StatCard
            title="Tasa de Acierto"
            value={`${stats.winRate.toFixed(2)}%`}
            icon={<TargetIcon />}
            delay={0.3}
          />
        </div>
      </div>

      {/* Fund Management Section */}
      <div>
          <h2 className="pl-4 border-l-4 border-accent text-2xl font-bold text-white mb-4 tracking-tight">Gestión de Fondos</h2>
          <div className="mb-6 bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
             <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-200">Bankroll Actual</h3>
                  <button onClick={onManageBankrollClick} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/60 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors text-sm">
                       Ajustar Manualmente
                  </button>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800/50 p-6 rounded-xl shadow-inner flex items-center justify-between">
                <div>
                    <p className="text-base font-medium text-slate-400">Capital Total</p>
                    <p className={`text-4xl lg:text-5xl font-bold tracking-tight ${stats.bankroll >= (stats.totalDeposited - stats.totalWithdrawn) ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stats.bankroll.toFixed(2)}€
                    </p>
                </div>
                <EuroCoinIcon className="w-16 h-16 text-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatCard
                  title="Total Ingresado"
                  value={`${stats.totalDeposited.toFixed(2)}€`}
                  icon={<ArrowUpCircleIcon />}
                  isPositive={false}
                  delay={0}
              />
              <StatCard
                  title="Total Retirado"
                  value={`${stats.totalWithdrawn.toFixed(2)}€`}
                  icon={<ArrowDownCircleIcon />}
                  isPositive={true}
                  delay={0.1}
              />
              <StatCard
                  title="Balance Neto"
                  value={`${stats.netBalance.toFixed(2)}€`}
                  icon={<ScaleIcon />}
                  isPositive={stats.netBalance >= 0}
                  delay={0.2}
              />
          </div>

          <div className="mt-6 bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-200">Transacciones Recientes</h3>
                  <button onClick={onAddTransactionClick} className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent font-semibold rounded-lg hover:bg-accent/30 transition-colors text-sm">
                      <PlusIcon /> Añadir
                  </button>
              </div>
              <div className="space-y-2">
                  {transactions.length > 0 ? (
                      displayedTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between bg-slate-700/40 p-3 rounded-md text-sm group">
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 p-1.5 rounded-full ${t.type === TransactionType.Deposit ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                                    {t.type === TransactionType.Deposit 
                                        ? <ArrowUpIcon className="w-4 h-4 text-red-400"/> 
                                        : <ArrowDownIcon className="w-4 h-4 text-emerald-400"/>}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t.type === TransactionType.Deposit ? 'Ingreso' : 'Retiro'}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{new Date(t.date).toLocaleDateString()}</span>
                                        {t.bookmaker && <><span>&bull;</span> <BookmakerLogo name={t.bookmaker} /></>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className={`font-bold ${t.type === TransactionType.Deposit ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {t.type === TransactionType.Deposit ? '-' : '+'}{t.amount.toFixed(2)}€
                                    </p>
                                    {t.notes && <p className="text-xs text-slate-500 italic truncate max-w-[120px]" title={t.notes}>"{t.notes}"</p>}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); onEditTransaction(t); }} className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white" title="Editar">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t); }} className="p-1 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400" title="Eliminar">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                      ))
                  ) : (
                      <p className="text-slate-500 text-center py-4">No hay transacciones registradas.</p>
                  )}
              </div>
              {transactions.length > 2 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setIsTransactionsExpanded(!isTransactionsExpanded)}
                    className="text-accent text-sm font-semibold hover:underline focus:outline-none"
                  >
                    {isTransactionsExpanded ? 'Ver menos' : 'Ver más'}
                  </button>
                </div>
              )}
          </div>
      </div>


      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold text-slate-200">Análisis Gráfico</h3>
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveChart('profitEvolution')}
                    className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'profitEvolution' ? 'bg-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                 >
                    <ChartIcon className="w-4 h-4" />
                    Evolución (Beneficio)
                 </button>
                 <button 
                    onClick={() => setActiveChart('profitBySport')}
                    className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'profitBySport' ? 'bg-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                 >
                    <BarChartIcon className="w-4 h-4" />
                    Por Deporte
                 </button>
                 <button 
                    onClick={() => setActiveChart('bankrollEvolution')}
                    className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'bankrollEvolution' ? 'bg-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                 >
                    <TrendingUpIcon className="w-4 h-4" />
                    Evolución (Bankroll)
                 </button>
            </div>
        </div>

        {activeChart === 'profitEvolution' && (
             profitEvolutionData.length > 1 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={profitEvolutionData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12}/>
                      <YAxis stroke="#94a3b8" fontSize={12} unit="€" allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }}/>
                      <Line type="monotone" dataKey="Beneficio Acumulado" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No hay suficientes datos. Resuelve algunas apuestas pendientes.</p>
                </div>
              )
        )}

        {activeChart === 'profitBySport' && (
             profitBySportData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart 
                        data={profitBySportData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="sport" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} unit="€" allowDecimals={false}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Bar dataKey="Beneficio">
                            {profitBySportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.Beneficio >= 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No hay datos de beneficios por deporte. Resuelve algunas apuestas.</p>
                </div>
              )
        )}

        {activeChart === 'bankrollEvolution' && (
             bankrollEvolutionData.length > 1 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={bankrollEvolutionData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12}/>
                      <YAxis stroke="#94a3b8" fontSize={12} unit="€" allowDecimals={false} domain={['dataMin - 10', 'dataMax + 10']}/>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }}/>
                      <Line type="monotone" dataKey="Bankroll" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No hay suficientes datos. Registra transacciones o resuelve apuestas.</p>
                </div>
              )
        )}
      </div>
    </div>
  );
};

export default Dashboard;