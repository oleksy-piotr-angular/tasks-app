import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.css'],
})
export class TodoTaskComponent {
  tasksList: Array<Task> = [];
  constructor(private tasksService: TaskService) {
    this.tasksService.getTasksList$().subscribe((tasks: Task[]) => {
      this.tasksList = tasks.filter((t) => t.isDone === false).slice();
    });
  }
  remove(task: Task) {
    this.tasksService.remove(task);
  }
  done(task: Task) {
    this.tasksService.done(task);
  }
  getColor(): string {
    return this.tasksList.length >= 5 ? 'red' : 'green';
  }
}
