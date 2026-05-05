export type PanelId = 
  | 'dashboard' 
  | 'contacts' 
  | 'leads' 
  | 'properties'
  | 'pipeline' 
  | 'transactions'
  | 'email' 
  | 'capture' 
  | 'tasks' 
  | 'workflow' 
  | 'analytics' 
  | 'import' 
  | 'ai_assistant' 
  | 'valuation' 
  | 'enrichment'
  | 'calendar'
  | 'leaderboard'
  | 'settings';

export type PropertyType = 'Single Family' | 'Condo' | 'Townhouse' | 'Commercial';
export type LeadStatus = 'hot' | 'warm' | 'cold';
export type UrgencyLevel = 'Immediate' | '1-3 Months' | '3-6 Months' | '6+ Months';
export type Currency = 'CAD' | 'USD';
export type DateFormat = 'MM/DD/YYYY' | 'YYYY-MM-DD';

export interface Contact {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  location?: string;
  property?: string;
  propertyType?: PropertyType;
  status: LeadStatus;
  score: string;
  lastContact: string;
  tags: string[];
  preferences?: ClientPreferences;
  history: TimelineEvent[];
}

export interface ClientPreferences {
  mustHaves: string[];
  niceToHaves: string[];
  dealBreakers: string[];
  neighborhoods: string[];
  schoolDistricts: string[];
  commuteRadius: string;
}

export interface TimelineEvent {
  id: string;
  type: 'email' | 'call' | 'text' | 'meeting' | 'note';
  content: string;
  timestamp: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  location: string;
  propertyType: PropertyType;
  source: string;
  urgency: UrgencyLevel;
  interest: 'Buy' | 'Sell' | 'Invest';
  status: LeadStatus;
  probability: string;
  chatbotStatus: string;
  financingStatus: 'Pre-Approved' | 'Need Help' | 'Cash';
}

export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  mlsNumber: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Withdrawn';
  agentId: string;
  images: string[];
  description: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  listingsTaken: number;
  salesVolume: number;
  avgDaysOnMarket: number;
  csatScore: number;
}

export interface Transaction {
  id: string;
  dealName: string;
  value: string;
  stage: string;
  clientName: string;
  agentId: string;
  expectedClosing: string;
  documents: TransactionDoc[];
  tasks: Task[];
}

export interface TransactionDoc {
  id: string;
  name: string;
  category: 'Contract' | 'Disclosure' | 'Inspection' | 'Financing' | 'Title' | 'Closing';
  url: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Missing';
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentLabel?: string;
  timestamp: Date;
}

export interface Email {
  id: string;
  from: string;
  initials: string;
  subject: string;
  property: string;
  time: string;
  status: 'unread' | 'read' | 'replied';
  avatarColor: string;
}

export interface CaptureChannel {
  id: string;
  name: string;
  type: 'Landing Page' | 'IDX Search' | 'Valuation' | 'Social Ad';
  status: 'Active' | 'Paused';
  leadsGenerated: number;
  conversion: string;
  revenuePerLead: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  category: string;
  linkedTo?: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'draft';
  nodes: number;
}

export interface Deal {
  id: string;
  name: string;
  val: string;
  meta: string;
  stage: string;
}

export interface EnrichmentResult {
  id: string;
  name: string;
  linkedin: 'Verified' | 'Pending' | 'Not Found';
  move: string;
  events: string;
  equity: string;
  score: string;
  isEnriched: boolean;
}
