import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { tap, take } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';

import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url: string = 'api/tasks';
  private tasksS$: Subject<Task[]>;
  private deleted$: Subject<Task[]>;
  private tasks$: Observable<Task[]> | undefined;

  constructor(private http: HttpClient) {
    this.tasksS$ = new ReplaySubject<Task[]>(1);
    this.deleted$ = new ReplaySubject<Task[]>(1);
    this.initTasks();
  }

  // GET: for an actual backend
  initTasks(): void {
    this.tasks$ = this.http.get<Task[]>(this.url).pipe(
      tap(_ => this.log('refreshTasks: get request')),
    );
    this.tasks$.subscribe({
      next: (tasks: Task[]) => {
        this.tasksS$.next(tasks);
        this.deleted$.next([]);}
      });
  }

/*
 *  local
 */

  // GET: all
  getTasks(): Observable<Task[]> {
    return this.tasksS$;
  }

  // GET: id
  getTask(id: number): Observable<any> {
    let idTask: Task | undefined;
    this.tasksS$.pipe(take(1),).subscribe(
      tasks => idTask = tasks.find(t => t.id === id)
    )
    return of(idTask);
  }

  // DELETE: id
  deleteTask(id: number): void {
    let deletedTask: Task | undefined;
    this.tasksS$.pipe(take(1),).subscribe(
      tasks => {
        deletedTask = tasks.find(t => t.id === id);
        this.tasksS$.next(tasks.filter(t => t.id !== id));
        });
    if (deletedTask !== undefined) {
      this.deleted$.pipe(take(1),).subscribe(
        tasks => {
          this.deleted$.next([...tasks, deletedTask!])
        }
      )
    }
  }

  // POST: task
  addTask(task: Task): void {
    this.tasksS$.pipe(take(1),).subscribe(
      tasks => this.tasksS$.next([...tasks, task])
    );
  }

  // POST: add deleted tasks back
  restoreTasks(): void {
    // let deletedTasks: Task[] | undefined;
    this.deleted$.pipe(take(1),).subscribe(
      deletedTasks => {
        if (deletedTasks !== undefined) {
          this.tasksS$.pipe(take(1),).subscribe(
            tasks => this.tasksS$.next([...tasks, ...deletedTasks]));
          this.deleted$.next([]);
        }
      }
    )
  }

  // PUT: update a task
  updateTask(task: Task): void {
    this.tasksS$.pipe(take(1),).subscribe(
      tasks => this.tasksS$.next([...tasks.filter(t => t.id !== task.id), task])
    );
  }


  /**
   * Handle errors in http requests
   * 
   * @param operation - operation that failed
   * @param result - additional output to handle
   * @returns - selector function for rxjs catchError
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<any> => {

      //implement logging
      console.log(`${operation} failed`);

      return of(result as T);
    }
  }

  /*
   * TODO 
   */
  private log<T>(operation: string, data?: T): void {
    console.log(operation);
    return;
  }
}
