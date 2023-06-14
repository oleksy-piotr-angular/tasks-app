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
  public newTask: string = '';
  constructor(
    private taskService: TaskService,
    private notification: NotificationService
  ) {}
  public add(): void {
    if (this.newTask) {
      this.notification.showInfo(
        'The Task is going to be add to DataBase... Please wait',
        'INFO:'
      );
      const task: Pick<Task, 'name' | 'created' | 'isDone'> = {
        name: this.newTask,
        created: new Date().toLocaleString(),
        isDone: false,
      };
      this.taskService.add(task);
      this.newTask = '';
    } else {
      this.notification.showWarning(
        'We cannot add an empty Task in this app. Please fill the content in this field with your Task',
        'WARNING:'
      );
    }
  }
}
