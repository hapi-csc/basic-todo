import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  num = 1;

  tasks: Task[] = [];

  titleStyle = 'task-title-no-wrap';

  updateTitleStyle(): void {
    if (this.titleStyle === 'task-title-no-wrap') {
      this.titleStyle = 'task-title-wrap';
      return;
    }
    this.titleStyle = 'task-title-no-wrap';
  }

  filterModes: string[] = ['All', 'In Progress', 'Completed',];
  @Input() filterMode = this.filterModes[0];
  filteredTasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.initTasks();
  }

  initTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.initSelectedTasks(...tasks);
        this.initShowDetails(...tasks);
        this.sort();
        this.filter();
      }
    );
  }

  sort(): void {
    this.tasks.sort((a: Task, b: Task) => {return a.id - b.id});
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

  refresh(): void {
    this.sort();
    this.filter();
  }

  //Apply f to each task in the current filter with 'select' true
  fToSelected(f: (id: number) => void): void {

    const filteredIds = this.filteredTasks.map(t => t.id);
    const selectedIds = this.selectedTasks
      .filter((task) => filteredIds.includes(task.id))
      .filter((task) => task.selected === true)
      .map(task => task.id)

    //TODO show message to user that there are no tasks selected
    if(selectedIds.length === 0) {
      return;
    }
    selectedIds.map(id => f.call(this, id));

    if(this.filteredTasks.length === 0) {
      this.fToSelected(this.setSelectTask);
    }
  }

  /*
   * SELECT functions
   */

  initSelectedTasks(...selectedTasks: Task[]): void {
    selectedTasks.map((task) => {
      this.selectedTasks.push({id: task.id, selected: false} as TaskSelect);
    });
  }

  isSelected(id: number): boolean {
    let t = this.selectedTasks.find((t) => t.id === id);
    if (t === undefined) {
      console.log(`isSelected: couldn't find task id=${id}`);
      return false;
    }
    return t.selected;
  }

  setSelectTask(id: number): void {
    let t = this.selectedTasks.find((t) => t.id === id);
    if (t === undefined) {
      return;
    }
    t.selected = !t.selected;
  }

  selectAllTasks(): void {
    this.filteredTasks.map((t) => this.setSelectTask(t.id));
  }

  /*
   * DETAILS functions
   */

  initShowDetails(...tasks: Task[]): void {
    tasks.map((task) => {
      this.showDetails.push({id: task.id, showDetails: false} as ShowTaskDetails);
    });
  }

  isShowDetails(id: number): boolean {
    let t = this.showDetails.find(t => t.id === id);
    if (t === undefined) {
      //TODO message
      console.log(`isShowDetail: couldn't find task id=${id}`);
      return false;
    }
    return t.showDetails;
  }

  setShowDetails(id: number, b?: boolean): void {
    let t = this.showDetails.find(t => t.id === id);
    if(t === undefined) {
      return;
    }
    if(b !== undefined) {
      t.showDetails = b;
      return;
    }
    t.showDetails = !t.showDetails;
    this.updateTitleStyle();
  }

  isDueDate(id: number): boolean {
    let t = this.filteredTasks.find(t => t.id === id);
    if (t === undefined) {
      //TODO message
      console.log(`isDueDate: couldn't find task id=${id}`);
      return false;
    }
    if (t.dueDate === undefined) {
      return false;
    }
    return true;
  }

  /*
   * Other functions
   */

  delete(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    // this.taskService.deleteTask(id).subscribe();
    this.refresh();
  }

  edit(id: number): void {
    this.setShowDetails(id, true);
  }

  markComplete(id: number): void {
    let task = this.tasks.find(task => task.id === id);
    if (task) {
      task.isComplete = !task.isComplete;
      this.refresh();
    }
  }
}
