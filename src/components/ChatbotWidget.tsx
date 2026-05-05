import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Calendar, User, Zap, RefreshCcw, CheckCircle2, MapPin, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'agent', 
      content: "Hello! I'm your Crescendo AI Assistant. I can help you find a property, value your home, or book a showing with Alina. What's on your mind today?", 
      agentLabel: 'Crescendo AI', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: getAiResponse(inputValue),
        agentLabel: 'Crescendo AI',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const getAiResponse = (input: string) => {
    const low = input.toLowerCase();
    if (low.includes('value') || low.includes('price')) return "I can certainly help with that. Would you like a preliminary AI valuation for a specific address in Canada or the US?";
    if (low.includes('showing') || low.includes('see')) return "I can check Alina's schedule for you. Which property are you interested in viewing, and do you have a preferred time this week?";
    if (low.includes('sell')) return "Selling is a strategic move in this market. Our A2A agents specialy in high-equity listings. Would you like to see our recent success stories in your neighborhood?";
    return "Understood. I'm surfacing the most relevant market data from our SmartZip and Lindy integrations to assist you better. Would you like to speak with a human agent, or shall we continue here?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[380px] h-[550px] bg-navy-mid border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-4"
          >
             {/* Header */}
             <div className="p-4 bg-navy/40 border-b border-gold/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center relative">
                      <Bot className="w-5 h-5 text-gold" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-navy-mid" />
                   </div>
                   <div>
                      <div className="text-sm font-serif font-bold text-white">Crescendo AI</div>
                      <div className="text-[9px] text-gold font-bold uppercase tracking-widest">Autonomous Qualification Hub</div>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             {/* Messages */}
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-navy/20">
                {messages.map((msg) => (
                   <motion.div 
                     key={msg.id}
                     initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                      <div className={`max-w-[85%] p-3 rounded-xl text-[11px] leading-relaxed ${
                        msg.role === 'user' ? 'bg-gold text-navy font-bold' : 'bg-navy-light/40 border border-white/5 text-cream'
                      }`}>
                         {msg.content}
                      </div>
                   </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-navy-light/40 border border-white/5 p-3 rounded-xl flex gap-1 items-center">
                        <div className="w-1 h-1 bg-gold rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                     </div>
                  </div>
                )}
             </div>

             {/* Suggestions */}
             <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gold/5 bg-navy/10">
                <button 
                  onClick={() => setInputValue('I want to book a showing')}
                  className="px-3 py-1 rounded-full border border-gold/20 text-[9px] font-bold text-gold whitespace-nowrap hover:bg-gold/10"
                >
                  Book Showing
                </button>
                <button 
                  onClick={() => setInputValue('What is my home worth?')}
                  className="px-3 py-1 rounded-full border border-gold/20 text-[9px] font-bold text-gold whitespace-nowrap hover:bg-gold/10"
                >
                  Home Valuation
                </button>
                <button 
                  onClick={() => setInputValue('Find properties in Toronto')}
                  className="px-3 py-1 rounded-full border border-gold/20 text-[9px] font-bold text-gold whitespace-nowrap hover:bg-gold/10"
                >
                  Search Listings
                </button>
             </div>

             {/* Input */}
             <div className="p-4 bg-navy-mid border-t border-gold/10 flex items-center gap-3">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Crescendo AI anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy hover:bg-gold-light transition-all active:scale-95 shadow-lg"
                >
                   <Send className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(201,168,76,0.3)] border border-gold/30 transition-all ${
          isOpen ? 'bg-navy-mid text-gold' : 'bg-gold text-navy'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-navy border-none shadow-sm">
            AI READY
          </div>
        )}
      </motion.button>
    </div>
  );
}
