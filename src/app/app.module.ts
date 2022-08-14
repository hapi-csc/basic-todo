import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { NewComponent } from './new/new.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskListComponent,
    NewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
