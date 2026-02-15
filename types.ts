
export type ProjectPartId = 'GENERAL' | 'PART_1' | 'PART_2' | 'PART_3';

export interface PartConfig {
  id: ProjectPartId;
  label: string;
  color: string;
}

export type PartConfigs = Record<ProjectPartId, PartConfig>;

export enum TaskStatus {
  PENDING = 'ממתין',
  COMPLETED = 'הסתיים'
}

export interface Assignee {
  name: string;
  role: string;
}

export interface SupervisorSettings {
  email: string;
  phone: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  partId: ProjectPartId;
  createdAt: string;
  followUpDate: string; // ISO String for Date
  reminderTime: string; // HH:mm format
  assignee: Assignee;
  status: TaskStatus;
}
