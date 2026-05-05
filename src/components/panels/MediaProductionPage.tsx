import { Video, Camera, Mic, Music, Layout, Download, Play, Plus, Image as ImageIcon, Sparkles, Filter, CheckCircle2, Loader2, Send, RefreshCw, Layers, Edit3, Trash2, Globe, Settings as SettingsIcon, X, Check, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Listing, VideoProject } from '../../types';
import { LISTINGS_DATA } from '../../constants';

export default function MediaProductionPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'projects'>('create');
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [activeAgent, setActiveAgent] = useState<string>('Orchestrator');
  const [judgeStatus, setJudgeStatus] = useState<'IDLE' | 'VALIDATING' | 'APPROVED' | 'REJECTED'>('IDLE');
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [projects, setProjects] = useState<VideoProject[]>([
    {
      id: 'v1',
      propertyId: '1',
      propertyName: '4820 Stone Canyon Ave',
      status: 'completed',
      formats: ['16:9', '9:16'],
      aiSettings: {
        engine: 'AutoReel',
        motion: 'Dolly Zoom',
        stagingStyle: 'Luxury',
        voiceover: 'Female',
        music: 'Cinematic'
      },
      createdAt: '2024-05-01'
    }
  ]);

  const [settings, setSettings] = useState<VideoProject['aiSettings'] & { branding: boolean, captions: boolean, upscale: boolean, fps: number }>({
    engine: 'AutoReel',
    motion: 'Dolly Zoom',
    stagingStyle: 'Luxury',
    voiceover: 'Female',
    music: 'Cinematic',
    branding: true,
    captions: true,
    upscale: true,
    fps: 60
  });

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleSyncMLS = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setProjects(projects.map(p => p.id === id ? { ...p, status: 'synced' } : p));
      setIsSyncing(null);
    }, 2000);
  };

  const handleUpdateProject = (updated: VideoProject) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
  };

  const applyPreset = (preset: 'cinematic' | 'reels' | 'lux') => {
    switch(preset) {
      case 'cinematic':
        setSettings({
          engine: 'Google Veo 3.1',
          motion: 'Dolly Zoom',
          stagingStyle: 'Modern',
          voiceover: 'Female',
          music: 'Upbeat',
          branding: true,
          captions: true,
          upscale: true,
          fps: 24
        });
        break;
      case 'reels':
        setSettings({
          engine: 'AutoReel',
          motion: 'Orbital',
          stagingStyle: 'Modern',
          voiceover: 'Male',
          music: 'Upbeat',
          branding: true,
          captions: true,
          upscale: false,
          fps: 60
        });
        break;
      case 'lux':
        setSettings({
          engine: 'Luma Dream Machine',
          motion: 'Hybrid',
          stagingStyle: 'Luxury',
          voiceover: 'Female',
          music: 'Cinematic',
          branding: true,
          captions: false,
          upscale: true,
          fps: 60
        });
        break;
    }
  };

  const handleGenerate = () => {
    if (!selectedProperty) return;
    setIsGenerating(true);
    setGenerationProgress(0);
    setJudgeStatus('IDLE');
    
    const steps = [
      { msg: 'MLS Data Agent: Fetching Listing Record...', progress: 15, agent: 'MLS Data Agent' },
      { msg: `AI Integration: Initialising ${settings.engine} Pipeline...`, progress: 30, agent: 'AI Integration Agent' },
      { msg: 'CRM Builder: Constructing Neural Framing...', progress: 50, agent: 'CRM Builder Agent' },
      { msg: 'Marketing Agent: Applying Segmentation Filters...', progress: 70, agent: 'Marketing Agent' },
      { msg: 'Judge Agent: Final Security & Schema Audit...', progress: 90, agent: 'Judge Agent' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep].msg);
        setGenerationProgress(steps[currentStep].progress);
        setActiveAgent(steps[currentStep].agent);
        
        if (steps[currentStep].agent === 'Judge Agent') {
          setJudgeStatus('VALIDATING');
        }
        
        currentStep++;
      } else {
        clearInterval(interval);
        setJudgeStatus('APPROVED');
        setTimeout(() => {
          const newProject: VideoProject = {
            id: Math.random().toString(36).substr(2, 9),
            propertyId: selectedProperty.id,
            propertyName: selectedProperty.address,
            status: 'completed',
            formats: ['16:9', '9:16'],
            aiSettings: { ...settings },
            createdAt: new Date().toISOString().split('T')[0]
          };
          setProjects([newProject, ...projects]);
          setIsGenerating(false);
          setActiveTab('projects');
        }, 800);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-mid/60 p-6 rounded-2xl border border-gold/18">
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-1 flex items-center gap-2">
            <Video className="w-6 h-6 text-gold" /> AI Cinematic Videographer
          </h2>
          <p className="text-xs text-slate-light font-bold uppercase tracking-widest italic">Professional Property Tours & Virtual Staging</p>
        </div>
        <div className="flex bg-navy p-1 rounded-lg border border-white/5 relative group">
           <button 
             onClick={() => setActiveTab('create')}
             className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
           >
             New Production
           </button>
           <button 
             onClick={() => setActiveTab('projects')}
             className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
           >
             Project Library
           </button>
           <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light text-right">
              <span className="text-gold font-bold uppercase block mb-1">Orchestrator Agent:</span> Manages transaction pipeline & document milestones.
           </div>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="bg-gold/5 border border-gold/20 p-4 rounded-xl flex flex-wrap items-center gap-4">
           <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] px-2 flex items-center gap-1.5 border-r border-gold/20 pr-4">
             <Filter className="w-3 h-3" /> Smart Presets
           </span>
           <button 
             onClick={() => applyPreset('cinematic')}
             className="group relative px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/50 transition-all text-[9px] font-bold text-cream uppercase bg-navy/40"
           >
             60s Cinematic Tour
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light leading-snug normal-case font-normal text-center">
                <span className="text-blue-400 font-bold uppercase tracking-widest">MLS Data Agent:</span> Load listing record & linked contacts.
             </div>
           </button>
           <button 
             onClick={() => applyPreset('reels')}
             className="group relative px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/50 transition-all text-[9px] font-bold text-cream uppercase bg-navy/40"
           >
             High-Energy Reel
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light leading-snug normal-case font-normal text-center">
                <span className="text-purple-400 font-bold uppercase tracking-widest">Lead Intelligence Agent:</span> Social hook + 3 bullets.
             </div>
           </button>
           <button 
             onClick={() => applyPreset('lux')}
             className="group relative px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/50 transition-all text-[9px] font-bold text-cream uppercase bg-navy/40"
           >
             Ultra-Luxe Feature
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light leading-snug normal-case font-normal text-center">
                <span className="text-green-400 font-bold uppercase tracking-widest">AI Integration Agent:</span> Luxury staging + AVM overlay.
             </div>
           </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'create' ? (
          <motion.div 
            key="create-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Step 1: Resource Loading */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-navy-mid/60 border border-gold/18 rounded-2xl p-6">
                  <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <ImageIcon className="w-4 h-4" /> 1. Select Asset Source
                  </h3>
                  
                  <div className="space-y-3">
                     <label className="block text-[10px] font-bold text-slate uppercase tracking-widest mb-2">Internal Property Index</label>
                     <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/20">
                        {LISTINGS_DATA.map(property => (
                           <button 
                             key={property.id}
                             onClick={() => setSelectedProperty(property)}
                             className={`group relative p-3 rounded-xl border text-left transition-all ${selectedProperty?.id === property.id ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'bg-navy/40 border-white/5 hover:border-white/20'}`}
                           >
                              <div className="text-[11px] font-bold text-white truncate">{property.address}</div>
                              <div className="text-[9px] text-slate mt-1">{property.city}, {property.state}</div>
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-[7px] font-bold text-gold uppercase tracking-tighter bg-navy px-1 rounded border border-gold/20">MLS Data Agent</div>
                           </button>
                        ))}
                     </div>
                     
                     <div className="pt-4 border-t border-white/5 mt-4">
                        <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gold/20 rounded-xl text-gold/60 hover:text-gold hover:bg-gold/5 transition-all text-[10px] font-bold uppercase tracking-widest">
                           <Plus className="w-4 h-4" /> Upload External Raw Media
                        </button>
                     </div>
                  </div>
               </div>

               <div className="bg-navy-mid/60 border border-gold/18 rounded-2xl p-6">
                  <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4">Branding & Identity</h3>
                  <div className="space-y-4">
                     <div className="p-3 bg-navy/40 border border-white/5 rounded-lg mb-4">
                        <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-2 text-center">Master Brand Logo</div>
                        <div className="h-12 border-2 border-dashed border-gold/10 rounded flex items-center justify-center text-gold/30 text-[8px] font-bold uppercase tracking-widest">
                           [Click to Update Logo]
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-light uppercase tracking-widest">Automated CTA Outro</span>
                        <button 
                          onClick={() => setSettings(s => ({ ...s, branding: !s.branding }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${settings.branding ? 'bg-gold' : 'bg-navy'}`}
                        >
                           <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.branding ? 'right-1' : 'left-1'}`} />
                        </button>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-light uppercase tracking-widest">Smart Captioning</span>
                        <button 
                          onClick={() => setSettings(s => ({ ...s, captions: !s.captions }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${settings.captions ? 'bg-gold' : 'bg-navy'}`}
                        >
                           <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.captions ? 'right-1' : 'left-1'}`} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Step 2: AI Directing */}
            <div className="lg:col-span-8 bg-navy-mid/60 border border-gold/18 rounded-2xl p-8 relative overflow-hidden">
               {/* Ambient Background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none rounded-full" />
               
               <div className="relative z-10 space-y-10">
                  <div>
                    <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                       <Sparkles className="w-4 h-4" /> 2. Neural Director Configuration
                    </h3>

                    {/* AI Engine Selection */}
                    <div className="mb-10 space-y-6">
                       <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream underline decoration-gold/30 underline-offset-4">
                          <Zap className="w-4 h-4" /> Real Estate AI Engine
                       </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                             { id: 'AutoReel', desc: 'Real Estate Specialist. Best for quick turnaround & high-energy reels.', icon: RefreshCw, agent: 'AI Integration Agent' },
                             { id: 'Luma Dream Machine', desc: 'Hyper-Realistic. Best for ultra-luxury cinematics & lighting.', icon: Sparkles, agent: 'AI Integration Agent' },
                             { id: 'Google Veo 3.1', desc: 'Enterprise Grade. Best for text-to-video accuracy & consistency.', icon: Globe, agent: 'Orchestrator + Judge' }
                          ].map((engine) => (
                             <button 
                               key={engine.id}
                               onClick={() => setSettings(s => ({ ...s, engine: engine.id as any }))}
                               className={`p-4 rounded-2xl border text-left transition-all group relative overflow-hidden ${settings.engine === engine.id ? 'bg-gold/10 border-gold shadow-lg' : 'bg-navy/40 border-white/5 hover:border-white/10'}`}
                             >
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-[11px] font-bold text-white">{engine.id}</div>
                                   <engine.icon className={`w-3.5 h-3.5 ${settings.engine === engine.id ? 'text-gold' : 'text-slate'}`} />
                                </div>
                                <div className="text-[9px] text-slate leading-relaxed mb-2">{engine.desc}</div>
                                <div className="text-[8px] font-bold text-gold/60 uppercase tracking-widest border-t border-white/5 pt-2">
                                   {engine.agent}
                                </div>
                                {settings.engine === engine.id && (
                                   <div className="absolute top-0 right-0 p-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C9A84C]" />
                                   </div>
                                )}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Motion & Camera */}
                       <div className="space-y-6">
                          <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream underline decoration-gold/30 underline-offset-4">
                             <Camera className="w-4 h-4" /> Cinematic Pathfinding
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                             {[
                                { id: 'Dolly Zoom', desc: 'Dramatic focal length shift creating 3D depth perception.' },
                                { id: 'Orbital', desc: '360° fluid rotations around master suite & kitchen nodes.' },
                                { id: 'Hybrid', desc: 'Dynamic blend of tracking and sweeping drone-style shots.' }
                             ].map((opt) => (
                                <button 
                                  key={opt.id}
                                  onClick={() => setSettings(s => ({ ...s, motion: opt.id as any }))}
                                  className={`p-4 rounded-2xl border text-left transition-all group ${settings.motion === opt.id ? 'bg-gold/10 border-gold shadow-lg' : 'bg-navy/40 border-white/5 hover:border-white/10'}`}
                                >
                                   <div className="text-[11px] font-bold text-white mb-1">{opt.id} Movement</div>
                                   <div className="text-[10px] text-slate leading-relaxed">{opt.desc}</div>
                                </button>
                             ))}
                          </div>
                       </div>

                       {/* Staging & Style */}
                       <div className="space-y-6">
                          <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream underline decoration-gold/30 underline-offset-4">
                             <Layers className="w-4 h-4" /> Virtual Staging Engine
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                             {[
                                { id: 'Luxury', desc: 'High-end contemporary textures and minimal gold accents.' },
                                { id: 'Modern', desc: 'Sleek industrial elements with neutral color palettes.' },
                                { id: 'Scandinavian', desc: 'Warm wood tones and bright natural light optimization.' }
                             ].map((opt) => (
                                <button 
                                  key={opt.id}
                                  onClick={() => setSettings(s => ({ ...s, stagingStyle: opt.id as any }))}
                                  className={`p-4 rounded-2xl border text-left transition-all ${settings.stagingStyle === opt.id ? 'bg-gold/10 border-gold shadow-lg' : 'bg-navy/40 border-white/5 hover:border-white/10'}`}
                                >
                                   <div className="text-[11px] font-bold text-white mb-1">{opt.id} Aesthetic</div>
                                   <div className="text-[10px] text-slate leading-relaxed">{opt.desc}</div>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     {/* Advanced Rendering */}
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream">
                           <Sparkles className="w-4 h-4 text-gold" /> Advanced AI Rendering
                        </label>
                      <div className="flex items-center justify-between p-3 bg-navy/40 border border-white/5 rounded-xl group relative cursor-help">
                         <span className="text-[10px] font-bold text-slate-light uppercase tracking-widest">Neural 4K Upscale</span>
                         <button 
                           onClick={() => setSettings(s => ({ ...s, upscale: !s.upscale }))}
                           className={`w-10 h-5 rounded-full relative transition-colors ${settings.upscale ? 'bg-gold' : 'bg-navy'}`}
                         >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.upscale ? 'right-1' : 'left-1'}`} />
                         </button>
                         <div className="absolute right-full mr-4 top-0 w-40 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light border-r-2 border-r-gold">
                            <span className="text-gold font-bold uppercase block mb-1">CRM Builder Agent:</span> Enhances photos before MLS publish.
                         </div>
                      </div>
                     </div>
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream">
                           <RefreshCw className="w-4 h-4 text-gold" /> Performance Target (FPS)
                        </label>
                        <div className="flex gap-2">
                           {[30, 60].map(fps => (
                              <button 
                                key={fps}
                                onClick={() => setSettings(s => ({ ...s, fps }))}
                                className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all group relative ${settings.fps === fps ? 'bg-gold text-navy border-gold' : 'bg-navy/40 border-white/5 text-slate'}`}
                              >
                                 {fps} FPS
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light border-b-2 border-b-gold">
                                    <span className="text-gold font-bold uppercase block mb-1">{fps === 60 ? 'Orchestrator + Judge' : 'Orchestrator Agent'}</span>
                                    {fps === 60 ? 'Real-time alert sync active.' : 'Standard 30s refresh rate.'}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     {/* Audio Pipeline */}
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream">
                           <Mic className="w-4 h-4" /> Voiceover Synthesis
                        </label>
                        <div className="flex gap-2">
                           {['Male', 'Female'].map(vo => (
                              <button 
                                key={vo}
                                onClick={() => setSettings(s => ({ ...s, voiceover: vo as any }))}
                                className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all group relative ${settings.voiceover === vo ? 'bg-gold text-navy border-gold' : 'bg-navy/40 border-white/5 text-slate'}`}
                              >
                                 {vo} Voice
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light border-b-2 border-b-gold">
                                    <span className="text-gold font-bold uppercase block mb-1">AI Integration Agent</span>
                                    Convin AI {vo.toLowerCase()} profile.
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-serif font-bold text-cream">
                           <Music className="w-4 h-4" /> Acoustic Layering
                        </label>
                        <div className="flex gap-2">
                           {['Cinematic', 'Upbeat', 'Acoustic'].map(mu => (
                              <button 
                                key={mu}
                                onClick={() => setSettings(s => ({ ...s, music: mu as any }))}
                                className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all group relative ${settings.music === mu ? 'bg-gold text-navy border-gold' : 'bg-navy/40 border-white/5 text-slate'}`}
                              >
                                 {mu}
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-navy border border-gold/20 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[8px] text-slate-light border-b-2 border-b-gold">
                                    <span className="text-gold font-bold uppercase block mb-1">{mu === 'Acoustic' ? 'Lead Intel Agent' : 'CRM Builder Agent'}</span>
                                    {mu === 'Acoustic' ? 'Post-sale referral requests.' : mu === 'Cinematic' ? 'High-value lead alerts.' : 'Standard nurture profile.'}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Export Formats */}
                  <div className="p-6 bg-navy/60 border border-gold/10 rounded-3xl">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                           <div className="flex items-center gap-3">
                              <Layout className="w-5 h-5 text-gold" />
                              <div>
                                 <div className="text-[10px] font-bold text-white uppercase tracking-widest">Multi-Channel Export</div>
                                 <div className="text-[9px] text-slate mt-1">16:9 Youtube + 9:16 Reels/TikTok</div>
                              </div>
                           </div>
                           <div className="h-10 w-px bg-white/5" />
                           <div className="flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-gold" />
                              <div>
                                 <div className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Upscaling</div>
                                 <div className="text-[9px] text-slate mt-1">AI-Powered 4K Master Export</div>
                              </div>
                           </div>
                        </div>

                        <button 
                          onClick={handleGenerate}
                          disabled={!selectedProperty || isGenerating}
                          className={`px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl transition-all flex flex-col items-center gap-1 leading-none ${!selectedProperty ? 'bg-slate/20 text-slate grayscale cursor-not-allowed' : 'bg-gold text-navy hover:scale-105 active:scale-95'}`}
                        >
                           {isGenerating ? (
                              <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" /> Orchestrating Agents...
                              </div>
                           ) : (
                              <>
                                <div className="flex items-center gap-3">
                                   <Send className="w-5 h-5" /> Start Neural Batch
                                </div>
                                <div className="text-[7px] font-bold tracking-[0.3em] opacity-60">All Specialists Ready</div>
                              </>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="projects-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
               <div key={project.id} className="bg-navy-mid/60 border border-gold/18 rounded-2xl overflow-hidden group relative">
                  {/* Action Menu Overlays */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => setEditingProject(project)}
                       className="p-2 bg-navy/80 backdrop-blur-md border border-white/10 rounded-lg text-slate hover:text-gold transition-all"
                     >
                        <Edit3 className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => handleDelete(project.id)}
                       className="p-2 bg-navy/80 backdrop-blur-md border border-white/10 rounded-lg text-slate hover:text-red-400 transition-all"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="aspect-video bg-navy relative">
                     <div className="absolute inset-0 flex items-center justify-center text-gold/10 group-hover:scale-110 transition-transform">
                        <Video className="w-16 h-16" />
                     </div>
                     {project.status === 'rendering' ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                           <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                           <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Neural Rendering</div>
                           <p className="text-[9px] text-slate mt-1">Vectorizing orbital camera paths...</p>
                        </div>
                     ) : (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all flex items-center justify-center">
                           <button className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                           </button>
                        </div>
                     )}
                     <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                          project.status === 'synced' ? 'bg-blue-500/20 text-blue-400' :
                          project.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-gold/20 text-gold animate-pulse'
                        }`}>
                           {project.status}
                        </span>
                     </div>
                  </div>
                  <div className="p-6">
                     <h4 className="text-sm font-bold text-white truncate mb-1">
                        {project.customName || project.propertyName}
                     </h4>
                     <div className="flex items-center gap-2 mb-4">
                        <div className="text-[8px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 uppercase tracking-widest flex items-center gap-1">
                           <Zap className="w-2.5 h-2.5" /> {project.aiSettings.engine}
                        </div>
                        <div className="text-[9px] text-slate font-bold uppercase tracking-widest">
                           {project.aiSettings.motion} • {project.aiSettings.stagingStyle}
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleSyncMLS(project.id)}
                             disabled={project.status !== 'completed' || isSyncing === project.id}
                             className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy border border-white/10 text-[8px] font-bold uppercase tracking-widest transition-all ${
                               project.status === 'synced' ? 'text-green-400 border-green-500/20' : 
                               project.status === 'completed' ? 'text-gold hover:border-gold/40' : 'text-slate opacity-50'
                             }`}
                           >
                              {isSyncing === project.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                              {project.status === 'synced' ? 'Synced to MLS' : 'Sync to MLS'}
                           </button>
                        </div>
                        <div className="flex gap-1.5">
                           <button className="p-2 text-slate hover:text-white transition-colors bg-navy border border-white/10 rounded">
                              <Download className="w-3.5 h-3.5" />
                           </button>
                           <button className="p-2 text-slate hover:text-white transition-colors bg-navy border border-white/10 rounded">
                              <SettingsIcon className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-navy-mid border border-gold/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(201,168,76,0.15)]"
             >
                <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-navy/40">
                   <div>
                      <h3 className="text-xl font-serif font-bold text-white tracking-tight">Project Management</h3>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Refine Neural Directing Parameters</p>
                   </div>
                   <button onClick={() => setEditingProject(null)} className="p-2 text-slate hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate uppercase tracking-widest">Production Title</label>
                      <input 
                        type="text"
                        value={editingProject.customName || editingProject.propertyName}
                        onChange={(e) => setEditingProject({...editingProject, customName: e.target.value})}
                        className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream focus:border-gold/40 focus:outline-none transition-all"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-gold" /> AI Engine
                         </label>
                         <select 
                           value={editingProject.aiSettings.engine}
                           onChange={(e) => setEditingProject({...editingProject, aiSettings: {...editingProject.aiSettings, engine: e.target.value as any}})}
                           className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream appearance-none focus:border-gold/40"
                         >
                            <option value="AutoReel">AutoReel</option>
                            <option value="Luma Dream Machine">Luma AI</option>
                            <option value="Google Veo 3.1">Google Veo 3.1</option>
                         </select>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2">
                            <Camera className="w-3 h-3 text-gold" /> Camera Path
                         </label>
                         <select 
                           value={editingProject.aiSettings.motion}
                           onChange={(e) => setEditingProject({...editingProject, aiSettings: {...editingProject.aiSettings, motion: e.target.value as any}})}
                           className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream appearance-none focus:border-gold/40"
                         >
                            <option value="Dolly Zoom">Dolly Zoom</option>
                            <option value="Orbital">Orbital</option>
                            <option value="Hybrid">Hybrid Drone</option>
                         </select>
                      </div>
                      <div className="space-y-4 col-span-2">
                         <label className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-3 h-3 text-gold" /> Virtual Staging Aesthetic
                         </label>
                         <select 
                           value={editingProject.aiSettings.stagingStyle}
                           onChange={(e) => setEditingProject({...editingProject, aiSettings: {...editingProject.aiSettings, stagingStyle: e.target.value as any}})}
                           className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream appearance-none focus:border-gold/40"
                         >
                            <option value="Luxury">Ultra Luxury</option>
                            <option value="Modern">Contemporary Modern</option>
                            <option value="Scandinavian">Scandinavian</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-6 bg-gold/5 border border-gold/10 rounded-2xl flex items-center justify-between">
                      <div>
                         <div className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Re-Render</div>
                         <div className="text-[9px] text-slate mt-1">Applying new parameters will trigger a core re-render.</div>
                      </div>
                      <button 
                        onClick={() => handleUpdateProject(editingProject)}
                        className="px-6 py-3 bg-gold text-navy rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                         <Check className="w-4 h-4" /> Save & Re-Render
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generation Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/90 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-lg text-center"
             >
                <div className="mb-12 relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 border-2 border-gold/10 rounded-full border-t-gold shadow-[0_0_50px_rgba(201,168,76,0.1)]"
                      />
                   </div>
                   <div className="relative z-10 w-48 h-48 mx-auto flex items-center justify-center">
                      <Video className="w-12 h-12 text-gold animate-pulse" />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex flex-col items-center">
                      <h3 className="text-2xl font-serif font-bold text-white mb-2 tracking-tight">AI Cinematic Videographer</h3>
                      <div className="flex items-center gap-4">
                         <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] font-mono">{settings.engine} Active</p>
                         <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                         <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] font-mono">Agent: {activeAgent}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${generationProgress}%` }}
                           className="h-full bg-gold shadow-[0_0_20px_#C9A84C]"
                         />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate">
                         <motion.div 
                           key={generationStep}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="flex items-center gap-2 text-white"
                         >
                            <span className="text-gold group-hover:animate-pulse">●</span>
                            {generationStep}
                         </motion.div>
                         <span className="font-mono">{generationProgress}%</span>
                      </div>
                   </div>

                   {/* A2A Protocol Monitor */}
                   <div className="p-4 bg-navy-mid/60 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                         <div className="text-[9px] font-bold text-slate uppercase tracking-widest">A2A Protocol Monitor</div>
                         <div className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 ${
                           judgeStatus === 'APPROVED' ? 'bg-green-500/10 text-green-400' : 
                           judgeStatus === 'VALIDATING' ? 'bg-red-500/10 text-red-500 animate-pulse' : 
                           'bg-white/5 text-slate'
                         }`}>
                            <Shield className="w-3 h-3" />
                            Judge: {judgeStatus}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <div className="text-[8px] text-slate font-bold uppercase">Orchestrator Path</div>
                            <div className="text-[9px] text-gold font-mono truncate">A2A_AUTH_SUCCESS_V3.1</div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[8px] text-slate font-bold uppercase">Security Hash</div>
                            <div className="text-[9px] text-white font-mono truncate">7F8X-P9L0-A2A1</div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-navy/40 border border-white/5 rounded-xl">
                         <div className="text-[8px] text-slate uppercase font-bold mb-1">FPS Target</div>
                         <div className="text-xs font-bold text-white">{settings.fps}</div>
                      </div>
                      <div className="p-3 bg-navy/40 border border-white/5 rounded-xl">
                         <div className="text-[8px] text-slate uppercase font-bold mb-1">Resolution</div>
                         <div className="text-xs font-bold text-white">4K Neural</div>
                      </div>
                      <div className="p-3 bg-navy/40 border border-white/5 rounded-xl">
                         <div className="text-[8px] text-slate uppercase font-bold mb-1">Bitrate</div>
                         <div className="text-xs font-bold text-white">Lossless</div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
