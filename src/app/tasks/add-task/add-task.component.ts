import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  newTask: string = '';
  constructor(private taskService: TaskService) {}
  add() {
    const task: Task = {
      name: this.newTask,
      created: new Date().toLocaleString(),
      isDone: false,
    };
    this.taskService.add(task);
    this.newTask = '';
  }
  isLoading(): boolean {
    return localStorage.hasOwnProperty('isLoading');
  }
}
