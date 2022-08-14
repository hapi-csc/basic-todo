export interface Task extends Record<string, any> {
  id: number,
  title: string,
  isComplete: boolean,
  description?: string,
  dueDate?: string,
}