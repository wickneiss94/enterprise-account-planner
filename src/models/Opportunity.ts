export type OpportunityStage = 
  | 'Qualification'
  | 'Discovery'
  | 'Solution Development'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type OpportunityStatus = 'Active' | 'On Hold' | 'Closed';

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  stage: OpportunityStage;
  status: OpportunityStatus;
  value: number;
  probability: number;
  expectedCloseDate: Date;
  accountId: string;
  contactIds: string[];
  initiativeIds: string[];
  products: string[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
} 