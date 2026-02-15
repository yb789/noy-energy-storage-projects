
import React, { useState, useEffect, useMemo } from 'react';
import { Task, ProjectPartId, TaskStatus, PartConfigs, PartConfig, SupervisorSettings } from './types';
import { INITIAL_TASKS, DEFAULT_PART_CONFIGS } from './constants';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Stats from './components/Stats';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('noy_agira_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [partConfigs, setPartConfigs] = useState<PartConfigs>(() => {
    const saved = localStorage.getItem('noy_agira_parts');
    return saved ? JSON.parse(saved) : DEFAULT_PART_CONFIGS;
  });

  const [supervisor, setSupervisor] = useState<SupervisorSettings>(() => {
    const saved = localStorage.getItem('noy_agira_supervisor');
    return saved ? JSON.parse(saved) : { email: 'ylbeck@gmail.com', phone: '' };
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectPartId | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('noy_agira_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('noy_agira_parts', JSON.stringify(partConfigs));
  }, [partConfigs]);

  useEffect(() => {
    localStorage.setItem('noy_agira_supervisor', JSON.stringify(supervisor));
  }, [supervisor]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesPart = filter === 'ALL' || task.partId === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPart && matchesSearch;
    }).sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime());
  }, [tasks, filter, searchTerm]);

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: TaskStatus.PENDING
    };
    setTasks(prev => [...prev, newTask]);
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING } : t
    ));
  };

  const deleteTask = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdatePartName = (id: ProjectPartId, newLabel: string) => {
    setPartConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], label: newLabel }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight text-right">פרויקטי <span className="text-indigo-600">נוי אגירה</span></h1>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="הגדרות"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="חיפוש..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-100 border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-indigo-500 w-48 text-sm"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                משימה חדשה
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Stats tasks={tasks} configs={partConfigs} />

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
          >
            הכל
          </button>
          {(Object.values(partConfigs) as PartConfig[]).map(config => (
            <button 
              key={config.id}
              onClick={() => setFilter(config.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${filter === config.id ? 'shadow-md ring-2' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              style={{ 
                backgroundColor: filter === config.id ? config.color : 'white', 
                color: filter === config.id ? 'white' : '#4b5563',
                borderColor: config.color
              }}
            >
              {config.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                configs={partConfigs}
                supervisor={supervisor}
                onToggleStatus={toggleTaskStatus} 
                onDelete={deleteTask}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-400">אין משימות להצגה</h3>
            </div>
          )}
        </div>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal 
          configs={partConfigs}
          onClose={() => setIsModalOpen(false)} 
          onSave={addTask} 
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 text-right">הגדרות מערכת</h2>
            
            <section className="mb-8">
              <h3 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-widest text-right">פרטי מנהל (לקבלת תזכורות)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 text-right">מייל לקבלת תזכורות</label>
                  <input 
                    type="email" 
                    value={supervisor.email}
                    onChange={(e) => setSupervisor({ ...supervisor, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 text-right">מספר וואטסאפ (בינלאומי, ללא +)</label>
                  <input 
                    type="tel" 
                    value={supervisor.phone}
                    onChange={(e) => setSupervisor({ ...supervisor, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                    placeholder="972501234567"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-widest text-right">שמות פרויקטים/חלקים</h3>
              <div className="space-y-4">
                {(Object.values(partConfigs) as PartConfig[]).map(config => (
                  <div key={config.id}>
                    <label className="block text-xs font-bold text-gray-400 mb-1 text-right uppercase">מזהה: {config.id}</label>
                    <div className="flex gap-2">
                      <div className="w-2 rounded shrink-0" style={{ backgroundColor: config.color }} />
                      <input 
                        type="text" 
                        value={config.label}
                        onChange={(e) => handleUpdatePartName(config.id, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end pt-8">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                שמור וסגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
