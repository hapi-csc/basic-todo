import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks!: Task[];
  filteredTasks!: Task[];
  private tasksSub!: Subscription;

  filterMode: string = 'all';

  constructor(private taskService: TaskService) {}

  restore(): void {
    this.taskService.restoreTasks();
  }

  filter(): void {
    switch(this.filterMode) {
      case 'In Progress':
        this.filteredTasks = this.tasks.filter((task) => task.isComplete === false);
        return;
      case 'Completed':
        this.filteredTasks = this.tasks.filter((task) => task.isComplete === true);
        return;
      default:
        this.filteredTasks = this.tasks;
        return;
    }
  }

  ngOnInit(): void {
    this.tasksSub = this.taskService.getTasks().subscribe(
      tasks => {
        this.tasks=tasks;
        this.filter();
      }
    );
  }
}
