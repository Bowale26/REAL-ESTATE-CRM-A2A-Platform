import { Contact, Lead, PanelId, Email, Deal, CaptureChannel, Task, Workflow, EnrichmentResult, Agent, Listing, Transaction } from './types';

export const PANEL_LABELS: Record<PanelId, [string, string]> = {
  dashboard: ['Dashboard', 'Real-time overview · A2A agents active'],
  contacts: ['CRM & Contacts', '248 contacts · Unified history active'],
  leads: ['Lead Automation', 'AI-qualified — Lindy & SmartZip intelligence'],
  properties: ['Listing Management', 'AI-power descriptions and real-time MLS'],
  pipeline: ['Executive Pipeline', '$4.2M active · Transaction tracking'],
  transactions: ['Document Coordination', 'Secure vault & compliance tracking'],
  email: ['Communication Hub', '12 unread · CINC auto-sequences'],
  capture: ['Inbound Capture', 'Forms, Chatbots & Social Ads'],
  tasks: ['Strategic Tasks', '5 due today · AI auto-prioritization'],
  workflow: ['Process Engine', 'Visual A2A workflow automation'],
  analytics: ['Business Intel', 'ROI, Performance & Sentiment Analytics'],
  import: ['Data Portability', 'Bulk sync across real estate platforms'],
  ai_assistant: ['Cognitive Assistant', 'Zero-latency Gemini A2A Hub'],
  valuation: ['Neural Valuation', 'HouseCanary · Royal LePage Real-time'],
  enrichment: ['Identity Enrichment', 'Social verification & tax records'],
  calendar: ['Executive Schedule', 'Strategic calendar & Showing sync'],
  leaderboard: ['Agent Leaderboard', 'Performance rankings & market domination'],
  media: ['Media Production', 'AI Cinematic Tours & Virtual Staging'],
  crm: ['CRM Integration Hub', 'Multi-Node Synchronization Center'],
  settings: ['Global Configuration', 'Localization, Currency & Prefs'],
};

export const AGENTS_DATA: Agent[] = [
  { id: 'a1', name: 'Alina Vance', avatar: 'AV', listingsTaken: 12, salesVolume: 8200000, avgDaysOnMarket: 14, csatScore: 4.9 },
  { id: 'a2', name: 'Marcus Chen', avatar: 'MC', listingsTaken: 8, salesVolume: 5100000, avgDaysOnMarket: 22, csatScore: 4.7 },
  { id: 'a3', name: 'Sarah Lopez', avatar: 'SL', listingsTaken: 15, salesVolume: 12400000, avgDaysOnMarket: 11, csatScore: 4.8 },
  { id: 'a4', name: 'David Kim', avatar: 'DK', listingsTaken: 5, salesVolume: 3200000, avgDaysOnMarket: 31, csatScore: 4.5 },
  { id: 'a5', name: 'James Wilson', avatar: 'JW', listingsTaken: 10, salesVolume: 7800000, avgDaysOnMarket: 18, csatScore: 4.6 },
];

export const LISTINGS_DATA: Listing[] = [
  { 
    id: 'l1', address: '52 Maple Ave', city: 'Toronto', state: 'ON', zip: 'M4B 1B3', price: '1240000', beds: 4, baths: 3, sqft: 2800, 
    mlsNumber: 'C1234567', status: 'Active', agentId: 'a1', images: [], 
    description: 'Stunning modern detached home in the heart of East York. Features open concept living, custom designer kitchen, and a private backyard oasis. Perfect for growing families seeking urban comfort.' 
  },
  { 
    id: 'l2', address: '88 Park Blvd', city: 'New York', state: 'NY', zip: '10003', price: '2450000', beds: 2, baths: 2, sqft: 1450, 
    mlsNumber: 'NY-88912', status: 'Active', agentId: 'a3', images: [], 
    description: 'Penthouse luxury at its finest. Floor-to-ceiling windows with sweeping views of Manhattan. Doorman building with complete amenity suite including roof deck and state-of-the-art gym.' 
  },
  { 
    id: 'l3', address: '12-402 Bay St', city: 'Vancouver', state: 'BC', zip: 'V6B 2T4', price: '890000', beds: 1, baths: 1, sqft: 750, 
    mlsNumber: 'V992831', status: 'Pending', agentId: 'a2', images: [], 
    description: 'Chic urban loft in Coal Harbour. Just steps from the seawall and Stanley Park. High ceilings and industrial finishes define this unique space.' 
  },
  { 
    id: 'l4', address: '1600 Ocean Front Walk', city: 'Los Angeles', state: 'CA', zip: '90291', price: '4750000', beds: 5, baths: 5, sqft: 4200, 
    mlsNumber: 'LA-10101', status: 'Active', agentId: 'a3', images: [], 
    description: 'Iconic beachfront architecture in Venice. Expansive decks and direct beach access. Sun-drenched interiors designed for the ultimate indoor-outdoor California lifestyle.' 
  },
];

export const CONTACTS_DATA: Contact[] = [
  { 
    id: '1', name: 'Sarah Mitchell', type: 'Seller', phone: '(416) 555-0121', email: 'sarah@example.com', property: '52 Maple Ave, Toronto', 
    status: 'hot', score: '97%', lastContact: 'Today', tags: ['High Equity', 'Ready now'],
    preferences: { mustHaves: ['Central AC', 'Large Yard'], niceToHaves: ['Finished Basement'], dealBreakers: ['Main Road'], neighborhoods: ['East York'], schoolDistricts: ['TDSB Sec 4'], commuteRadius: '10km' },
    history: [
      { id: 'h1', type: 'call', content: 'Discussed listing strategy and price point expectations.', timestamp: '2024-05-04 10:00', author: 'Alina Vance' },
      { id: 'h2', type: 'email', content: 'Sent CMA report for review.', timestamp: '2024-05-03 14:30', author: 'Alina Vance' }
    ]
  },
  { id: '2', name: 'James Okafor', type: 'Buyer', phone: '(905) 555-0847', email: 'james@example.com', property: 'Thornhill Area', status: 'warm', score: '78%', lastContact: 'Yesterday', tags: ['First Time Buyer'], history: [] },
  { id: '3', name: 'The Wongs', type: 'Buyer', phone: '(604) 555-0334', email: 'wongs@example.com', property: 'Vancouver — $2M+', status: 'warm', score: '65%', lastContact: '2 days ago', tags: ['Upgrade'], history: [] },
  { id: '4', name: 'Maria Santos', type: 'Seller', phone: '(212) 555-0912', email: 'maria@example.com', property: '88 Park Blvd, NYC', status: 'cold', score: '42%', lastContact: '1 week ago', tags: ['Relocating'], history: [] },
  { id: '5', name: 'David Reeves', type: 'Investor', phone: '(403) 555-0228', email: 'david@example.com', property: 'Multi-unit, Calgary', status: 'hot', score: '91%', lastContact: 'Today', tags: ['Cash Buyer'], history: [] },
];

export const LEADS_DATA: Lead[] = [
  { id: '1', name: 'Alex Turner', email: 'alex@example.com', phone: '555-0101', budget: '$1.2M', location: 'Toronto', propertyType: 'Single Family', source: 'SmartZip', urgency: '1-3 Months', interest: 'Sell', status: 'hot', probability: '94%', chatbotStatus: 'Qualified', financingStatus: 'Pre-Approved' },
  { id: '2', name: 'Nicole Park', email: 'nicole@example.com', phone: '555-0102', budget: '$850K', location: 'Vancouver', propertyType: 'Condo', source: 'Ylopo', urgency: 'Immediate', interest: 'Buy', status: 'hot', probability: '87%', chatbotStatus: 'Engaged', financingStatus: 'Need Help' },
  { id: '3', name: 'Robert Chen', email: 'robert@example.com', phone: '555-0103', budget: '$650K', location: 'New York', propertyType: 'Townhouse', source: 'kvCORE', urgency: '3-6 Months', interest: 'Buy', status: 'warm', probability: '71%', chatbotStatus: 'Pending', financingStatus: 'Cash' },
  { id: '4', name: 'Samantha Lee', email: 'samantha@example.com', phone: '555-0104', budget: '$2.1M', location: 'Oakville', propertyType: 'Single Family', source: 'Adwerx', urgency: '1-3 Months', interest: 'Buy', status: 'hot', probability: '98%', chatbotStatus: 'Qualified', financingStatus: 'Pre-Approved' },
  { id: '5', name: 'Gregory Smith', email: 'gregory@example.com', phone: '555-0105', budget: '$450K', location: 'Hamilton', propertyType: 'Condo', source: 'Zillow', urgency: '6+ Months', interest: 'Buy', status: 'cold', probability: '32%', chatbotStatus: 'Nurture', financingStatus: 'Need Help' },
  { id: '6', name: 'Linda Duarte', email: 'linda@example.com', phone: '555-0106', budget: 'TBD', location: 'Markham', propertyType: 'Single Family', source: 'Referral', urgency: 'Immediate', interest: 'Sell', status: 'hot', probability: '91%', chatbotStatus: 'Ready', financingStatus: 'Cash' },
];

export const TRANSACTIONS_DATA: Transaction[] = [
  { 
    id: 't1', dealName: 'Mitchell Sale', value: '1,240,000', stage: 'Under Contract', clientName: 'Sarah Mitchell', agentId: 'a1', expectedClosing: '2024-06-15',
    documents: [
      { id: 'd1', name: 'Signed Listing Agreement', category: 'Contract', status: 'Verified', uploadedAt: '1 week ago', url: '#' },
      { id: 'd2', name: 'Inspection Report', category: 'Inspection', status: 'Pending', uploadedAt: 'Today', url: '#' }
    ],
    tasks: []
  }
];

export const CAPTURE_CHANNELS: CaptureChannel[] = [
  { id: '1', name: 'Spring Sellers — Toronto', type: 'Landing Page', status: 'Active', leadsGenerated: 124, conversion: '12.4%', revenuePerLead: '$540', url: '/c/spring-toronto' },
  { id: '2', name: 'Luxury IDX — Malibu', type: 'IDX Search', status: 'Active', leadsGenerated: 89, conversion: '8.2%', revenuePerLead: '$1,200', url: '/lux/malibu' },
  { id: '3', name: 'AI Valuation — Brooklyn', type: 'Valuation', status: 'Active', leadsGenerated: 256, conversion: '18.1%', revenuePerLead: '$320', url: '/ai-v/bk' },
];

export const SELLER_LEADS = [
  { name: 'Patricia Wong', addr: '142 Birchwood Cres, Markham ON', score: 96, reason: 'Empty nest · 22yr tenure · High equity', ai: 'Crescendo.ai chatbot queued' },
  { name: 'Harold & Susan Kim', addr: '88 Forestview Dr, Mississauga ON', score: 91, reason: 'Retirement signal · Job change · 18yr tenure', ai: 'Convin AI call scheduled' },
  { name: 'Anthony Reeves', addr: '55 Lakeshore Blvd W, Toronto ON', score: 87, reason: 'Marriage · Growing family · Upsizing signal', ai: 'CINC nurture sequence active' },
  { name: 'Maria Santos', addr: '312 Queen St E, Toronto ON', score: 84, reason: 'Divorce filing · 12yr tenure · Price appreciation', ai: 'Structurely qualification pending' },
  { name: 'James & Carol Liu', addr: '77 Oakridge Ave, Vancouver BC', score: 79, reason: 'New job relocation · High equity · MLS activity', ai: 'Ylopo retargeting ad running' },
];

export const ENRICHMENT_DATA: EnrichmentResult[] = [
  { id: '1', name: 'Sarah Mitchell', linkedin: 'Verified', move: '3–6 months', events: 'New job · Marriage', equity: '$340K', score: '98%', isEnriched: true },
  { id: '2', name: 'James Okafor', linkedin: 'Verified', move: '6–12 months', events: 'Retirement', equity: '$210K', score: '84%', isEnriched: true },
  { id: '3', name: 'The Wongs', linkedin: 'Pending', move: '12+ months', events: 'Growing family', equity: '$180K', score: '61%', isEnriched: true },
];

export const WORKFLOWS_DATA: Workflow[] = [
  { id: '1', name: 'New Lead Auto-Reply', trigger: 'Lead Capture', action: 'Send Email', status: 'active', nodes: 3 },
  { id: '2', name: 'Seller Valuation Follow-up', trigger: 'Valuation Completed', action: 'Create Task', status: 'active', nodes: 5 },
];

export const TASKS_DATA: Task[] = [
  { id: '1', title: 'Follow up with James Okafor', dueDate: 'Today, 2:00 PM', priority: 'High', status: 'Pending', category: 'Call', linkedTo: '52 Maple Ave' },
  { id: '2', title: 'Prepare CMA for Thompson family', dueDate: 'Tomorrow', priority: 'High', status: 'Pending', category: 'Admin' },
];

export const EMAILS_DATA: Email[] = [
  { id: '1', from: 'James Okafor', initials: 'JO', subject: 'Re: Showing at 52 Maple Ave', property: '52 Maple Ave', time: '9:14 AM', status: 'unread', avatarColor: 'blue' },
  { id: '2', from: 'Sarah Mitchell', initials: 'SM', subject: 'Interested in listing my home', property: '—', time: 'Yesterday', status: 'unread', avatarColor: 'green' },
];

export const DEALS_DATA: Deal[] = [
  { id: '1', name: 'Nicole Park', val: '$850K', meta: 'Ylopo · 2 days', stage: 'Lead' },
  { id: '2', name: 'T. Nakamura', val: '$1.1M', meta: 'MLS · 4 days', stage: 'Lead' },
  { id: '3', name: 'Alex Turner', val: '$1.2M', meta: 'SmartZip · Hot', stage: 'Qualify' },
];

export const NORTH_AMERICAN_LOCATIONS = {
  CANADA: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 
    'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 
    'Northwest Territories', 'Nunavut', 'Yukon'
  ],
  USA: [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]
};
