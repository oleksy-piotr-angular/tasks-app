import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-done-task',
  templateUrl: './done-task.component.html',
  styleUrls: ['./done-task.component.css'],
})
export class DoneTaskComponent {
  public tasksDone: Task[] = [];
  constructor(private taskService: TaskService) {
    this.taskService.getTasksList$().subscribe((tasks: Task[]) => {
      this.tasksDone = tasks.filter((item) => item.isDone === true);
    });
  }
}
