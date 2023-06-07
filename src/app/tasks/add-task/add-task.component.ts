import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { NotificationService } from 'src/app/services/notification.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  newTask: string = '';
  constructor(
    private taskService: TaskService,
    private notification: NotificationService
  ) {}
  add() {
    if (this.newTask) {
      this.notification.showInfo(
        'The task is going to be add... Please wait',
        'INFO:'
      );
      const task: Task = {
        name: this.newTask,
        created: new Date().toLocaleString(),
        isDone: false,
      };
      this.taskService.add(task);
      this.newTask = '';
    } else {
      this.notification.showWarning(
        "We can't add an empty task in this app. Please fill in this field with your Task",
        'WARNING:'
      );
    }
  }
}
