
import React, { useState } from 'react';
import { ProjectPartId, Task, PartConfigs, PartConfig } from '../types';

interface TaskModalProps {
  configs: PartConfigs;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ configs, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    partId: 'GENERAL' as ProjectPartId,
    followUpDate: new Date().toISOString().split('T')[0],
    reminderTime: '09:00',
    assigneeName: '',
    assigneeRole: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      partId: formData.partId,
      followUpDate: new Date(formData.followUpDate).toISOString(),
      reminderTime: formData.reminderTime,
      assignee: {
        name: formData.assigneeName,
        role: formData.assigneeRole
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 text-right">משימה חדשה</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">כותרת המשימה</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right" 
                placeholder="לדוגמה: בדיקת תוכניות מגן"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">תיאור המשימה</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-24 text-right" 
                placeholder="פירוט המשימה..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">שיוך לפרויקט</label>
              <select 
                value={formData.partId}
                onChange={e => setFormData({...formData, partId: e.target.value as ProjectPartId})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
              >
                {(Object.values(configs) as PartConfig[]).map(config => (
                  <option key={config.id} value={config.id}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">אחראי המשימה</label>
              <input required type="text" placeholder="שם האחראי" value={formData.assigneeName} onChange={e => setFormData({...formData, assigneeName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">תאריך למעקב</label>
              <input 
                required
                type="date" 
                value={formData.followUpDate}
                onChange={e => setFormData({...formData, followUpDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">שעת קבלת התזכורת</label>
              <input 
                required
                type="time" 
                value={formData.reminderTime}
                onChange={e => setFormData({...formData, reminderTime: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-right">תפקיד האחראי</label>
              <input required type="text" placeholder="תפקיד (למשל: מהנדס שטח)" value={formData.assigneeRole} onChange={e => setFormData({...formData, assigneeRole: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">ביטול</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-bold">שמור משימה</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
