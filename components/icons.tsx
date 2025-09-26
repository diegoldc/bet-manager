import React from 'react';

// General Icons
export const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

export const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);

export const BarChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-bar-chart-2 ${className}`}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

export const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-percent"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
);

export const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);

export const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
);

export const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export const ReturnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 15 20 20 15 20"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
);

export const HistoryIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-rotate-ccw ${className}`}><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
);

export const TicketIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
      <path d="M8 7v10"/>
      <path d="M16 7v10"/>
      <path d="M21 12H3"/>
    </svg>
);

export const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

// Transaction & Bankroll Icons
export const ArrowUpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>;
export const ArrowDownCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 4 4 4-4"/><path d="M12 8v8"/></svg>;
export const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-down"><path d="M12 20V10"/><path d="M12 20l-4-4"/><path d="M12 20l4-4"/><path d="M4 4h16"/></svg>;
export const ArrowUpIcon = ({className = "w-5 h-5"}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>;
export const ArrowDownIcon = ({className = "w-5 h-5"}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
export const EuroCoinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15.32 7.68A6.002 6.002 0 0 0 12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a6.002 6.002 0 0 0 3.32-1.08" />
        <path d="M5 10h6" />
        <path d="M5 14h6" />
    </svg>
);
export const TrendingUpIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-trending-up ${className}`}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

// Bookmaker Icons
export const BuildingStorefrontIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.25 3.375A3.375 3.375 0 0 0 7.875 6.75h8.25A3.375 3.375 0 0 0 12.75 3.375h-1.5Z" />
      <path fillRule="evenodd" d="M14.06 8.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm-3.31 0a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm-3.31 0a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 7.44 8.25ZM4.5 12.332A3.375 3.375 0 0 0 7.875 15.75h8.25a3.375 3.375 0 0 0 3.375-3.418V8.683a3.375 3.375 0 0 0-2.06-3.131l-3.564-1.528a3.375 3.375 0 0 0-2.824 0L6.561 5.552a3.375 3.375 0 0 0-2.06 3.131v3.649Zm3.375 1.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Zm4.125 1.875a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm4.125-1.875a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" clipRule="evenodd" />
      <path d="M2.25 19.5a.75.75 0 0 0 0 1.5H3v.75a.75.75 0 0 0 1.5 0V21h15v.75a.75.75 0 0 0 1.5 0V21h.75a.75.75 0 0 0 0-1.5h-19.5Z" />
    </svg>
);
// Simplified SVG logos
export const Bet365Logo = () => <svg width="80" height="20" viewBox="0 0 80 20"><text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#4CAF50">bet365</text></svg>;
export const BwinLogo = () => <svg width="60" height="20" viewBox="0 0 60 20"><rect width="60" height="20" fill="black" /><text x="5" y="15" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">bwin</text></svg>;
export const CodereLogo = () => <svg width="80" height="20" viewBox="0 0 80 20"><text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#00a651">CODERE</text></svg>;
export const WilliamHillLogo = () => <svg width="100" height="20" viewBox="0 0 100 20"><text x="0" y="15" fontFamily="Times New Roman, serif" fontSize="16" fontWeight="bold" fill="#004899">William Hill</text></svg>;
export const _888sportLogo = () => <svg width="80" height="20" viewBox="0 0 80 20"><text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#ff8a00">888sport</text></svg>;


// Sport Icons
export const FootballIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="12,7 9.5,11.5 14.5,11.5" fill="currentColor" />
        <path d="M12 2L9.5 7H14.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5.05 16L9.5 11.5L7.5 7.5L2.4 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M18.95 16L14.5 11.5L16.5 7.5L21.6 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9.5 11.5L5.05 16L8.5 20.5h7L18.95 16L14.5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
);

export const BasketballIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2.5 9.5C5.5 11 8.5 12 12 12s6.5-1 9.5-2.5"/>
        <path d="M14.5 2.5C13 5.5 12 8.5 12 12s1 6.5 2.5 9.5"/>
        <path d="M9.5 21.5C11 18.5 12 15.5 12 12S11 5.5 9.5 2.5"/>
    </svg>
);

export const TennisIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M19.07 4.93a10 10 0 00-14.14 0m14.14 14.14a10 10 0 00-14.14 0"/>
    </svg>
);

export const F1Icon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 11.5L8 14V18L6 20L4 18V14L2 12L4.5 11.5Z"/>
        <path d="M19.5 11.5L16 14V18L18 20L20 18V14L22 12L19.5 11.5Z"/>
        <path d="M8 14H16"/>
        <path d="M17 10L19.5 11.5H4.5L7 10H17Z"/>
        <path d="M7 10L9 4H15L17 10"/>
    </svg>
);

export const UFCIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 15.5C18.2614 15.5 20.5 13.2614 20.5 10.5C20.5 7.73858 18.2614 5.5 15.5 5.5C12.7386 5.5 10.5 7.73858 10.5 10.5V18.5H14.5C15.0523 18.5 15.5 18.0523 15.5 17.5V15.5Z"/>
        <path d="M7 13.5C7 10.4624 9.46243 8 12.5 8C13.8807 8 15.1228 8.56061 16 9.5"/>
        <path d="M7 13.5H3.5C2.94772 13.5 2.5 13.9477 2.5 14.5V18.5H7"/>
    </svg>
);