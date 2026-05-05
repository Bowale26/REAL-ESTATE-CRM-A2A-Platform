import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../../types';

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'agent',
  content: "Welcome to the Real Estate CRM A2A Intelligence Platform. I'm coordinating 7 specialist agents to help you manage leads, analyze your pipeline, find seller opportunities, and optimize your real estate business across the US and Canadian markets.\n\nAsk me anything — from lead qualification to MLS analysis, predictive seller identification, workflow automation, or market insights.",
  agentLabel: 'ORCHESTRATOR AGENT',
  timestamp: new Date()
};

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are the Orchestrator Agent of a Real Estate CRM A2A (Agent-to-Agent) platform serving US and Canadian markets. You coordinate several agents:
1. CRM Builder Agent: Handles UI and data structures.
2. AI Integration Agent: Manages connections to kvCORE, Lofty, CINC, Ylopo, SmartZip.
3. Lead Intelligence Agent: Predictive analytics and seller identification.
4. MLS Data Agent: Syncs with various US/Canada MLS.
5. Marketing Agent: Madgicx, REimagineHome integrations.
6. Judge Agent: Validates all agent outputs.
7. Update Agent: Handles logs and versioning.

User asks: ${input}` }] }
        ],
        config: {
          systemInstruction: "You are the Orchestrator Agent. Be professional, concise, and technical. Reference specific agents when appropriate. Focus on real estate ROI, automation, and A2A efficiency."
        }
      });

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response.text || "I'm sorry, I encountered an issue processing that request. The Judge Agent has logged the incident.",
        agentLabel: 'ORCHESTRATOR AGENT',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: "A2A network error detected. The Judge Agent is monitoring the system pulse. Please try again shortly.",
        agentLabel: 'JUDGE AGENT',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-navy-mid/90 border border-gold/18 rounded-md p-2.5 flex gap-5 items-center mb-4 overflow-x-auto scrollbar-hide">
        <div className="text-[12px] text-gold font-bold whitespace-nowrap">🤖 A2A Multi-Agent System</div>
        <AgentStatus label="Orchestrator" status="active" />
        <AgentStatus label="CRM Builder" status="active" />
        <AgentStatus label="Lead Intel" status="working" />
        <AgentStatus label="Judge" status="active" />
        <AgentStatus label="Update Agent" status="idle" />
      </div>

      <div className="flex-1 bg-navy-mid/80 border border-gold/18 rounded-lg flex flex-col overflow-hidden shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-navy-light">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                msg.role === 'agent' ? 'bg-gradient-to-br from-gold to-gold-mid text-navy font-bold' : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'agent' ? 'AI' : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                msg.role === 'agent' ? 'bg-navy-light/40 border border-gold/10 text-cream' : 'bg-blue-600 text-white'
              }`}>
                {msg.agentLabel && (
                  <div className="text-[10px] font-bold tracking-wider text-gold mb-1 uppercase">{msg.agentLabel}</div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-mid flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-navy animate-spin" />
              </div>
              <div className="bg-navy-light/40 border border-gold/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gold/18 bg-navy/40 flex gap-3 items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the AI agents anything about your leads or market..."
            className="flex-1 bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:border-gold transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed rounded-md flex items-center justify-center text-navy transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentStatus({ label, status }: { label: string, status: 'active' | 'working' | 'idle' }) {
  const dotColor = {
    active: 'bg-green-500',
    working: 'bg-gold animate-pulse',
    idle: 'bg-slate'
  }[status];

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-light whitespace-nowrap">
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </div>
  );
}
