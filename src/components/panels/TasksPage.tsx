import { useState } from 'react';
import { Task, PanelId } from '../../types';
import { CheckSquare, Calendar, Filter, Plus, Search, MoreHorizontal, Clock, Zap, Flag } from 'lucide-react';
import { motion } from 'motion/react';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  onNavigate?: (panel: PanelId) => void;
}

export default function TasksPage({ tasks, onAddTask, onToggleTask, onNavigate }: TasksPageProps) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('Pending');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <CheckSquare className="w-5 h-5 text-gold" />
             <h3 className="text-sm font-semibold text-white">Task Management</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate?.('calendar')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/18 rounded-md text-[11px] font-medium text-slate-light hover:text-gold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Calendar
            </button>
            <button 
              onClick={onAddTask}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-colors shadow-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-white/5 flex items-center gap-4 bg-navy/20">
           <div className="flex bg-black/20 rounded-md p-1 border border-white/5">
              <Tab active={filter === 'All'} label="All Tasks" onClick={() => setFilter('All')} />
              <Tab active={filter === 'Pending'} label={`Pending (${tasks.filter(t => t.status === 'Pending').length})`} onClick={() => setFilter('Pending')} />
              <Tab active={filter === 'Completed'} label="Completed" onClick={() => setFilter('Completed')} />
           </div>
           
           <div className="ml-auto relative">
              <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-white/5 border border-gold/18 rounded-md pl-9 pr-4 py-1.5 text-xs text-cream focus:outline-none focus:border-gold transition-colors w-64"
              />
           </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-navy/40">
                <th className="w-10 px-5 py-3"></th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Task Details</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3 text-center">Due date</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3 text-center">Priority</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3 text-center">Category</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3 text-right">Linked Rec.</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate italic text-sm">No tasks found in this category.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
           <h4 className="text-xs font-bold text-gold uppercase tracking-[2px] mb-4 flex items-center gap-2">
             <Zap className="w-3.5 h-3.5" /> AI Priority Engine
           </h4>
           <p className="text-sm text-slate-light mb-4">A2A Cognitive Analysis has prioritized these tasks based on lead probability and imminent deadlines.</p>
           <div className="space-y-3">
              <PriorityPrompt 
                title="Thompson CMA — Overdue" 
                desc="Market change detected: 3 new listings in their neighborhood. Send updated CMA now to capture interest." 
              />
              <PriorityPrompt 
                title="Follow up: Mitchell Listing" 
                desc="Lead score increased to 94%. Cognitive analysis suggests a phone call between 5-6pm today." 
              />
           </div>
        </div>

        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
           <h4 className="text-xs font-bold text-white uppercase tracking-[2px] mb-4">Task Categories Distribution</h4>
           <div className="space-y-4">
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                    <span>Inbound Lead Nurture</span>
                    <span className="text-gold">65%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: '65%' }} />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                    <span>Admin & Docusign</span>
                    <span className="text-blue-400">20%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '20%' }} />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                    <span>Marketing & Ads</span>
                    <span className="text-green-400">15%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: '15%' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all ${
        active ? 'bg-gold text-navy shadow-lg' : 'text-slate hover:text-cream'
      }`}
    >
      {label}
    </button>
  );
}

function TaskRow({ task, onToggle }: { task: Task, onToggle: () => void, key?: string }) {
  const isPending = task.status === 'Pending';
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-5 py-4">
        <button 
          onClick={onToggle}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
            isPending ? 'border-gold/30 hover:border-gold' : 'bg-gold border-gold'
          }`}
        >
          {!isPending && <CheckSquare className="w-3.5 h-3.5 text-navy fill-navy" />}
        </button>
      </td>
      <td className="px-5 py-4">
         <div className={`text-sm font-medium transition-all ${isPending ? 'text-white' : 'text-slate line-through opacity-50'}`}>
           {task.title}
         </div>
      </td>
      <td className="px-5 py-4 text-center">
         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
           task.dueDate.includes('Today') || task.dueDate.includes('Due') 
             ? 'text-orange-400 bg-orange-400/10 border border-orange-400/20' 
             : 'text-slate bg-white/5'
         }`}>
           <Clock className="w-3 h-3" /> {task.dueDate}
         </div>
      </td>
      <td className="px-5 py-4 text-center">
         <div className={`text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 ${
           task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-gold' : 'text-slate'
         }`}>
           <Flag className="w-3 h-3" /> {task.priority}
         </div>
      </td>
      <td className="px-5 py-4 text-center">
         <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-slate-light font-bold uppercase tracking-wider group-hover:border-gold/20 transition-all">
           {task.category}
         </span>
      </td>
      <td className="px-5 py-4 text-right">
         <span className="text-[11px] text-gold font-medium group-hover:underline cursor-pointer">{task.linkedTo || '—'}</span>
      </td>
    </tr>
  );
}

function PriorityPrompt({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-3 bg-white/5 border border-white/5 rounded-lg border-l-2 border-l-gold group hover:bg-white/[0.08] transition-all cursor-pointer">
       <div className="text-xs font-bold text-white mb-1">{title}</div>
       <div className="text-[10px] text-slate leading-relaxed mb-2">{desc}</div>
       <div className="flex items-center gap-2">
          <button className="text-[9px] font-bold text-gold uppercase hover:underline">Execute Now</button>
          <span className="text-slate/20 text-[9px]">|</span>
          <button className="text-[9px] font-bold text-slate uppercase hover:text-white">Ignore</button>
       </div>
    </div>
  );
}
