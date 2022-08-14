import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: '', redirectTo:'task-list', pathMatch: 'full'},
  { path: 'task/:id', title: 'Task', component: TaskComponent},
  { path: 'task-list', title: 'Task-List', component: TaskListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
