import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task';
import { TaskService } from '../task.service';

const DEFAULT = 0;
const DETAIL = 1;
const EDIT = 2;
const LOADING = 3;
const LOADERROR = 4;
const DYING = 5;

const MODES: Record<number, string> = {
  0: 'default',
  1: 'detail',
  2: 'edit',
  3: 'loading',
  4: 'loaderror',
  5: 'dying',
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {

  task?: Task;
  @Input() id?: number;
  @Input() deleteCallback?: (id: number) => void;

  // flag to display a div for display information
  showInfoFlag: boolean = false;
  // string specifiying how the task component is displayed in the UI
  // maybe 'displayMode' would be a better name
  private mode: string = MODES[DEFAULT];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute, 
  ) { }

  getMode(m?: number): string {
    return (m === undefined) ? this.mode : MODES[m];
  }

  setMode(m: number): void {
    if (MODES[m] === this.mode) {
      return;
    }
    this.mode = MODES[m];
  }

  move(): void {
    // TODO probably callback from task list
  }

  edit(): void {
    this.setMode(EDIT);
  }

  delete(): void {
    this.taskService.deleteTask(this.id!);
  }

  save(args: Record<string, any>): void {
    if (this.task === undefined) {
      return;
    }
    this.task.title = args['title'];
    this.task.description = args['description'];
    this.task.dueDate = args['dueDate'];
    this.taskService.updateTask(this.task);
    this.setMode(DETAIL);
  }

  detail(): void {
    (this.mode !== MODES[DETAIL]) ? this.setMode(DETAIL) : this.setMode(DEFAULT);
  }

  getTitle(): string {
    return (this.task) ? this.task.title : '';
  }

  getDescription(): string {
    return (this.task?.description) ? this.task.description.trim() : '';
  }

  getDueDate(): string {
    return (this.task?.dueDate) ? this.task.dueDate.trim() : '';
  }

  isComplete(): boolean {
    if(this.task) {
      return this.task?.isComplete;
    }
    //TODO NO TASK
    return false;
  }

  setIsComplete(value?: boolean): void {
    if(this.task) {
      if(value === undefined) {
        this.task.isComplete = !this.task.isComplete;
        return;
      }
      this.task.isComplete = value;
    }
  }

  ngOnInit(): void {
    this.initTask();
  }

  private initTask(): void {
    const id = (this.id === undefined) ? Number(this.route.snapshot.paramMap.get('id')) : this.id;
    this.setMode(LOADING);
    this.taskService.getTask(id).subscribe(
      t => {
        console.log(t);
        this.task = t;
        if (this.task === undefined) {
          this.setMode(LOADERROR);
          return;
        } 
        this.setMode(DEFAULT);
      }
    );
  }

/*
 * Utility
 */

  stringToNum(input: string): number {
    const output = Number(input);
    return (MODES[output] !== undefined) ? output : 0;
  }

  redirect(a: string): void {
    this.router.navigate(['task/', a])
    .then(_ => this.initTask());
  }

}
