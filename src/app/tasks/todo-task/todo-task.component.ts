import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { NotificationService } from 'src/app/services/notification.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.css'],
})
export class TodoTaskComponent {
  tasksList: Task[] = [];
  constructor(
    private tasksService: TaskService,
    private notification: NotificationService
  ) {
    this.tasksService.getTasksList$().subscribe((tasks: Task[]) => {
      this.tasksList = tasks.filter((t) => t.isDone === false);
    });
  }
  remove(task: Task) {
    this.notification.showInfo(
      'The task is going to be removed from DataBase... Please wait',
      'INFO:'
    );
    this.tasksService.remove(task);
  }
  done(task: Task) {
    this.notification.showInfo(
      'The task is going to be updated in DataBase... Please wait',
      'INFO:'
    );
    this.tasksService.done(task);
  }
  getColor(): string {
    return this.tasksList.length >= 5 ? 'red' : 'chartreuse';
  }
}
