import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';
import { HttpService } from './http.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList$ = new BehaviorSubject<Array<Task>>([]);

  constructor(
    private http: HttpService,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    if (this.authService.isSignedIn) {
      this.getTasksFromDB();
    }
  }

  public getTasksList$(): Observable<Array<Task>> {
    return this.tasksList$.asObservable();
  }

  public add(_task: Pick<Task, 'created' | 'isDone' | 'name'>) {
    const tasksList: Task[] = this.tasksList$.getValue();

    this.http.saveOneTask(_task).subscribe({
      next: (res) => {
        this.notification.showSuccess(res.message, 'Success:');
        this.getTasksFromDB(); //need to reload list to Take Task ID
      },
      error: (err) => {
        this.notification.showWarning(
          'Task cannot be saved. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public remove(task: Task) {
    this.http.removeOneTask(task).subscribe({
      next: (res) => {
        this.notification.showSuccess(res.message, 'Success:');
        const tasksList = this.tasksList$
          .getValue()
          .filter((item) => item != task);
        this.tasksList$.next(tasksList);
      },
      error: (err) => {
        this.notification.showWarning(
          'Task cannot be updated in DB. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public done(task: Task) {
    task.end = new Date().toLocaleString();
    task.isDone = true;
    this.http.updateOneTaskToDone(task).subscribe({
      next: (res) => {
        this.notification.showSuccess(res.message, 'Success:');
        const tasksList = this.tasksList$.getValue();
        this.tasksList$.next(tasksList);
      },
      error: (err) => {
        this.notification.showWarning(
          'Task cannot be updated. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public getTasksFromDB() {
    this.http.getTasks().subscribe({
      next: (tasks) => {
        const responseArray = Object.values(tasks);
        const listOfTasks: Task[] = Object.values(responseArray[0]);
        this.tasksList$.next(listOfTasks);
        this.notification.showSuccess(
          'Tasks has been reloaded from DB',
          'SUCCESS: '
        );
      },
      error: (err) => {
        this.notification.showSuccess(
          'Tasks from DB cannot be reloaded',
          'ERROR: '
        );
      },
    });
  }

  public clearTasksList() {
    this.tasksList$.next([]);
  }
}
