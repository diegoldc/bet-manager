
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isPositive?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isPositive, delay }) => {
  const valueColor = isPositive === true ? 'text-emerald-400' : isPositive === false ? 'text-red-400' : 'text-white';
  const iconColor = isPositive === true ? 'text-accent' : isPositive === false ? 'text-red-400' : 'text-accent';

  return (
    <div 
      className="bg-slate-800 p-5 rounded-xl shadow-lg flex items-start space-x-4 transition-transform transform hover:-translate-y-1"
      style={{ animation: 'fadeInSlideUp 0.5s ease-out forwards', opacity: 0, animationDelay: `${delay || 0}s` }}
    >
      <div className="bg-slate-700/50 p-3 rounded-lg">
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;