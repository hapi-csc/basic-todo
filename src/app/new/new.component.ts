import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Task } from '../task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  @Input() title!: string;
  @Input() description?: string;
  @Input() hasDescription: boolean = false;
  @Input() dueDate?: string;
  @Input() hasDueDate: boolean = false;

  private id!: number;

  constructor(
    private taskService: TaskService,
    private location: Location,
  ) {
    this.setNewId();
   }

  setNewId(): void {
    this.taskService.getTasks().pipe(take(1),).subscribe(
      tasks => this.id = Math.max(...tasks.map(t => t.id)) + 1
    );
  }

  setHasDueDate(): void {
    this.hasDueDate = !this.hasDueDate;
  }

  setHasDescription(): void {
    this.hasDescription = !this.hasDescription;
  }

  add(): void {
    this.setNewId();
    const task: Task = {
      id: this.id,
      title: this.title,
      isComplete: false,
      description: this.hasDescription ? this.description : undefined,
      dueDate: this.hasDueDate ? this.dueDate : undefined,
    }
    console.log(task);
    this.taskService.addTask(task);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
  }

}
