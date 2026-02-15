
import { ProjectPartId, PartConfigs, Task, TaskStatus } from './types';

export const DEFAULT_PART_CONFIGS: PartConfigs = {
  GENERAL: { id: 'GENERAL', label: 'כללי', color: '#6366f1' },
  PART_1: { id: 'PART_1', label: 'פרויקט מגן', color: '#f59e0b' },
  PART_2: { id: 'PART_2', label: 'פרויקט בית ניר', color: '#10b981' },
  PART_3: { id: 'PART_3', label: 'פרויקט כוכב הירדן', color: '#ec4899' },
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'הגדרת דרישות מערכת',
    description: 'כתיבת מסמך אפיון מפורט לכל חלקי הפרויקט',
    partId: 'GENERAL',
    createdAt: new Date().toISOString(),
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    // Fixed: Removed 'email' and 'phone' as they are not part of the Assignee type
    assignee: {
      name: 'ישראל ישראלי',
      role: 'מנהל מוצר'
    },
    status: TaskStatus.PENDING,
    reminderTime: '09:00'
  }
];
