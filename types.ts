export enum SelectionStatus {
  Pending = 'PENDING',
  Won = 'WON',
  Lost = 'LOST',
  Void = 'VOID',
}

export enum Sport {
  Football = 'FOOTBALL',
  Basketball = 'BASKETBALL',
  Tennis = 'TENNIS',
  F1 = 'F1',
  UFC = 'UFC',
}


export interface Selection {
  id: string;
  event: string;
  market: string;
  pick: string;
  detailedPick?: string;
  odds: number;
  status: SelectionStatus;
  sport: Sport;
}

export enum BetStatus {
  Pending = 'PENDING',
  Won = 'WON',
  Lost = 'LOST',
  Void = 'VOID',
}

export interface Bet {
  id: string;
  name: string; // e.g., "Weekend Accumulator"
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  status: BetStatus;
  date: string;
  time?: string;
  profit: number;
  bookmaker?: string;
  selections: Selection[];
}

export enum TransactionType {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  bookmaker?: string;
  notes?: string;
}