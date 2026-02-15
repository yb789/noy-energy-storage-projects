
import React, { useState } from 'react';
import { Task, TaskStatus, PartConfigs, SupervisorSettings } from '../types';
import { generateFollowUpMessage } from '../services/geminiService';

interface TaskCardProps {
  task: Task;
  configs: PartConfigs;
  supervisor: SupervisorSettings;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, configs, supervisor, onToggleStatus, onDelete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const config = configs[task.partId];

  const handleFollowUp = async (type: 'whatsapp' | 'email') => {
    setIsGenerating(true);
    // Passing null for assignee context in prompt might need update in service
    const message = await generateFollowUpMessage(task, configs, type);
    setIsGenerating(false);

    if (type === 'whatsapp') {
      const phone = supervisor.phone || '';
      const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      const subject = encodeURIComponent(`תזכורת למעקב משימה: ${task.title}`);
      const body = encodeURIComponent(message);
      const url = `mailto:${supervisor.email}?subject=${subject}&body=${body}`;
      window.location.href = url;
    }
  };

  const isOverdue = new Date(task.followUpDate) < new Date() && task.status === TaskStatus.PENDING;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-r-4 p-5 transition-all hover:shadow-md flex flex-col ${task.status === TaskStatus.COMPLETED ? 'opacity-75' : ''}`}
         style={{ borderRightColor: config.color }}>
      <div className="flex justify-between items-start mb-3">
        <div className="text-right">
          <span className="text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}>
            {config.label}
          </span>
          <h3 className={`text-lg font-bold text-gray-800 ${task.status === TaskStatus.COMPLETED ? 'line-through' : ''}`}>
            {task.title}
          </h3>
        </div>
        <input 
          type="checkbox" 
          checked={task.status === TaskStatus.COMPLETED}
          onChange={() => onToggleStatus(task.id)}
          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-right">{task.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 text-right">
        <div>
          <p className="font-semibold text-gray-400">תאריך מעקב:</p>
          <p className={`${isOverdue ? 'text-red-500 font-bold' : ''} flex flex-col`}>
            <span>{new Date(task.followUpDate).toLocaleDateString('he-IL')}</span>
            <span className="text-[10px] text-indigo-400">בשעה: {task.reminderTime || '--:--'}</span>
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-400">נוצרה ב:</p>
          <p>{new Date(task.createdAt).toLocaleDateString('he-IL')}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between mb-3 flex-row-reverse">
          <div className="flex items-center space-x-2 space-x-reverse flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
              {task.assignee.name.charAt(0)}
            </div>
            <div className="mr-2 text-right">
              <p className="text-sm font-bold text-gray-700">{task.assignee.name}</p>
              <p className="text-[10px] text-gray-400">{task.assignee.role}</p>
            </div>
          </div>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
            title="מחק משימה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>

        {task.status === TaskStatus.PENDING && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-400 text-center mb-1">שלח תזכורת למנהל:</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleFollowUp('whatsapp')}
                disabled={isGenerating}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-1 rounded flex items-center justify-center gap-1 transition-colors disabled:opacity-50 font-bold"
              >
                תזכורת בוואטסאפ
              </button>
              <button
                onClick={() => handleFollowUp('email')}
                disabled={isGenerating}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-2 px-1 rounded flex items-center justify-center gap-1 transition-colors disabled:opacity-50 font-bold"
              >
                תזכורת במייל
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
