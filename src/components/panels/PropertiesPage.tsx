import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Globe, 
  FileText, 
  Zap, 
  Image as ImageIcon, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { LISTINGS_DATA, AGENTS_DATA } from '../../constants';
import { Listing, Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import PropertyDetailsModal from '../modals/PropertyDetailsModal';

interface PropertiesPageProps {
  listings: Listing[];
  onAddListing: (listing: Omit<Listing, 'id'>) => void;
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  currency: Currency;
}

export default function PropertiesPage({ listings, onAddListing, onEditListing, onDeleteListing, currency }: PropertiesPageProps) {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (listing: Listing) => {
    setSelectedProperty(listing);
    setIsDetailsOpen(true);
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Listing>>({
    address: '',
    city: '',
    state: '',
    zip: '',
    price: '',
    beds: 0,
    baths: 0,
    sqft: 0,
    mlsNumber: '',
    status: 'Active',
    agentId: AGENTS_DATA[0]?.id,
    description: '',
    images: []
  });

  const handleOpenAdd = () => {
    setFormData({
      address: '',
      city: '',
      state: '',
      zip: '',
      price: '',
      beds: 0,
      baths: 0,
      sqft: 0,
      mlsNumber: '',
      status: 'Active',
      agentId: AGENTS_DATA[0]?.id,
      description: 'Newly staged property with premium features.',
      images: []
    });
    setEditingListing(null);
    setIsAddingProperty(true);
  };

  const handleOpenEdit = (listing: Listing) => {
    setFormData(listing);
    setEditingListing(listing);
    setIsAddingProperty(true);
  };

  const handleSubmit = () => {
    if (!formData.address || !formData.price || !formData.mlsNumber) return;

    if (editingListing) {
      onEditListing({ ...editingListing, ...formData } as Listing);
    } else {
      onAddListing(formData as Omit<Listing, 'id'>);
    }
    setIsAddingProperty(false);
    setEditingListing(null);
  };

  const generateAiDescription = async (id: string) => {
    setIsGeneratingDescription(id);
    try {
      const listing = listings.find(l => l.id === id);
      if (!listing) return;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a luxury real estate marketing description for this property:
        Address: ${listing.address}, ${listing.city}, ${listing.state}
        Price: ${formatCurrency(listing.price, currency)}
        Stats: ${listing.beds} beds, ${listing.baths} baths, ${listing.sqft} sqft
        MLS#: ${listing.mlsNumber}
        
        Focus on: High-end lifestyle, architectural details, and market exclusivity. Keep it under 150 words. Format with a catchy headline.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const description = response.text || "Failed to generate description.";
      
      onEditListing({
        ...listing,
        description
      });
    } catch (error) {
      console.error("AI Description Error:", error);
    } finally {
      setIsGeneratingDescription(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Listing Intelligence Center</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Cross-Border Portfolio Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-mid border border-gold/18 rounded-md px-3 py-1.5 self-start">
             <Filter className="w-3.5 h-3.5 text-gold mr-2" />
             <span className="text-[10px] font-bold text-slate uppercase tracking-widest">Filter: All Markets</span>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Post New Listing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {listings.map((property) => (
          <ListingCard 
            key={property.id} 
            property={property} 
            currency={currency}
            onGenerateDescription={generateAiDescription}
            onEdit={() => handleOpenEdit(property)}
            onDelete={() => onDeleteListing(property.id)}
            isGenerating={isGeneratingDescription === property.id}
            onViewDetails={() => handleOpenDetails(property)}
          />
        ))}
      </div>

      <PropertyDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        property={selectedProperty}
        currency={currency}
      />

      {isAddingProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-navy-mid border border-gold/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
           >
              <div className="p-6 border-b border-gold/10 bg-navy/40 flex items-center justify-between">
                 <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">{editingListing ? 'Edit Property Intel' : 'New Property Intel'}</h3>
                 <button onClick={() => setIsAddingProperty(false)} className="text-slate hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-[45deg]" />
                 </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                 <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Full Address</label>
                    <input 
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                      placeholder="Search address (US/Canada autocomplete)..." 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">City</label>
                    <input 
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                      placeholder="e.g. Toronto" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">State/Prov</label>
                    <input 
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                      placeholder="e.g. ON" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Price</label>
                    <input 
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                      placeholder="e.g. 1200000" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">MLS Number</label>
                    <input 
                      value={formData.mlsNumber}
                      onChange={e => setFormData({ ...formData, mlsNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                      placeholder="C884920" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Beds</label>
                    <input 
                      type="number"
                      value={formData.beds}
                      onChange={e => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Baths</label>
                    <input 
                      type="number"
                      value={formData.baths}
                      onChange={e => setFormData({ ...formData, baths: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Sqft</label>
                    <input 
                      type="number"
                      value={formData.sqft}
                      onChange={e => setFormData({ ...formData, sqft: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none appearance-none"
                    >
                       <option value="Active">Active</option>
                       <option value="Pending">Pending</option>
                       <option value="Sold">Sold</option>
                       <option value="Withdrawn">Withdrawn</option>
                    </select>
                 </div>
                 <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Listing Agent</label>
                    <select 
                      value={formData.agentId}
                      onChange={e => setFormData({ ...formData, agentId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none appearance-none"
                    >
                       {AGENTS_DATA.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                 </div>
              </div>
              <div className="p-6 bg-navy/40 border-t border-gold/10 flex justify-end gap-3">
                 <button onClick={() => setIsAddingProperty(false)} className="px-5 py-2 text-[11px] font-bold text-slate hover:text-white transition-colors uppercase tracking-widest">Cancel</button>
                 <button onClick={handleSubmit} className="px-6 py-2 bg-gold text-navy rounded text-[11px] font-bold uppercase tracking-widest shadow-lg">
                    {editingListing ? 'Update Listing' : 'Stage Listing'}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}

interface ListingCardProps {
  property: Listing;
  currency: Currency;
  onGenerateDescription: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  isGenerating: boolean;
  onViewDetails: () => void;
}

function ListingCard({ property, currency, onGenerateDescription, onEdit, onDelete, isGenerating, onViewDetails }: ListingCardProps) {
  const agent = AGENTS_DATA.find(a => a.id === property.agentId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-mid/60 border border-gold/18 rounded-lg overflow-hidden flex flex-col md:flex-row group hover:border-gold/30 transition-all shadow-xl"
    >
      {/* Visual Side */}
      <div className="w-full md:w-80 h-64 md:h-auto bg-navy relative border-r border-gold/10">
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
         <div className="absolute inset-0 flex items-center justify-center text-gold/20">
            <ImageIcon className="w-12 h-12" />
         </div>
         <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
              property.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
              property.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-slate/20 text-slate border border-slate/30'
            }`}>
              {property.status}
            </span>
         </div>
         <div className="absolute bottom-4 left-4 z-20">
            <div className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">MLS: {property.mlsNumber}</div>
            <div className="text-xl font-bold text-white font-serif">{formatCurrency(property.price, currency)}</div>
         </div>
      </div>

      {/* Info Side */}
      <div className="flex-1 p-6 flex flex-col">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-gold" /> {property.address}
               </h3>
               <p className="text-xs text-slate-light font-medium">{property.city}, {property.state} {property.zip}</p>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={onViewDetails}
                 className="p-2 bg-gold/10 rounded border border-gold/30 shadow-sm hover:bg-gold/20 transition-colors group/view"
                 title="Market Intelligence"
               >
                  <Eye className="w-4 h-4 text-gold group-hover/view:scale-110 transition-transform" />
               </button>
               <button 
                 onClick={onEdit}
                 className="p-2 bg-white/5 rounded border border-white/10 shadow-sm hover:bg-white/10 transition-colors"
               >
                  <Edit3 className="w-4 h-4 text-slate-light" />
               </button>
               <button 
                 onClick={onDelete}
                 className="p-2 bg-white/5 rounded border border-white/10 shadow-sm hover:bg-white/10 transition-colors text-red-400/80 hover:text-red-400"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>

         <div className="flex items-center gap-6 mb-6 py-4 border-y border-white/5 bg-white/2 p-4 rounded-xl">
            <div className="flex items-center gap-2">
               <Bed className="w-4 h-4 text-gold/60" />
               <span className="text-xs font-bold text-white">{property.beds} <span className="text-[10px] text-slate uppercase">Beds</span></span>
            </div>
            <div className="flex items-center gap-2">
               <Bath className="w-4 h-4 text-gold/60" />
               <span className="text-xs font-bold text-white">{property.baths} <span className="text-[10px] text-slate uppercase">Baths</span></span>
            </div>
            <div className="flex items-center gap-2">
               <Square className="w-4 h-4 text-gold/60" />
               <span className="text-xs font-bold text-white">{property.sqft.toLocaleString()} <span className="text-[10px] text-slate uppercase">Sqft</span></span>
            </div>
         </div>

         <div className="mb-6 flex-1">
            <div className="flex items-center justify-between mb-2">
               <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5" /> Market Description
               </h4>
               <button 
                 onClick={() => onGenerateDescription(property.id)}
                 disabled={isGenerating}
                 className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 rounded text-[9px] font-bold text-gold hover:bg-gold/20 transition-all disabled:opacity-50"
               >
                 {isGenerating ? <Zap className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                 AI Regenerate
               </button>
            </div>
            <div className="text-[11px] text-slate leading-relaxed bg-navy/20 p-3 rounded-lg border border-white/5 relative group/desc">
               {isGenerating && <div className="absolute inset-0 bg-navy/80 backdrop-blur-[1px] flex items-center justify-center text-gold text-[9px] font-bold uppercase tracking-widest animate-pulse">Neural Copywriter Working...</div>}
               {property.description}
            </div>
         </div>

         <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">
                  {agent?.avatar}
               </div>
               <div>
                  <div className="text-[10px] text-slate-light font-bold">Listing Agent</div>
                  <div className="text-xs text-white font-medium">{agent?.name}</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Tour Url
               </button>
               <button className="flex items-center gap-1.5 text-[11px] font-bold text-gold hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> View on IDX
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
