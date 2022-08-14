import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from './task';

//temp
import { TASKS } from './mock-tasks';

interface TaskResponse {
  tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb(): TaskResponse {
    const tasks: Task[] = TASKS;
    return {tasks};
  }
}
