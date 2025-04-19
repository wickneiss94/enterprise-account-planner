export type BusinessOutcome = 'Increase Revenue' | 'Cut Costs' | 'Manage Risk';

export type InitiativeStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';

export interface Initiative {
  id: string;
  name: string;
  description: string;
  businessOutcome: BusinessOutcome;
  status: InitiativeStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
  budget?: number;
  contactIds: string[];
  opportunityIds: string[];
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
} 