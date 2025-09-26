import React from 'react';
import { BuildingStorefrontIcon, Bet365Logo, BwinLogo, CodereLogo, WilliamHillLogo, _888sportLogo } from './icons';

interface BookmakerLogoProps {
  name?: string;
}

const BookmakerLogo: React.FC<BookmakerLogoProps> = ({ name }) => {
  if (!name) return null;

  const normalizedName = name.toLowerCase().replace(/\s/g, '');

  const logoMap: { [key: string]: React.ReactNode } = {
    'bet365': <Bet365Logo />,
    'bwin': <BwinLogo />,
    'codere': <CodereLogo />,
    'williamhill': <WilliamHillLogo />,
    '888sport': <_888sportLogo />,
  };

  const logo = logoMap[normalizedName];

  if (logo) {
    return <div className="h-5 flex items-center" title={name}>{logo}</div>;
  }

  return (
    <div className="flex items-center gap-1.5" title={name}>
      <BuildingStorefrontIcon className="w-4 h-4 text-slate-400" />
      <span className="text-xs text-slate-300 truncate max-w-[100px]">{name}</span>
    </div>
  );
};

export default BookmakerLogo;
