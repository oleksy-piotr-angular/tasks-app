import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';
import { HttpService } from './http.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { ResponseMessage, TasksResponse } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList$ = new BehaviorSubject<Task[]>([]);

  constructor(
    private http: HttpService,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    if (this.authService.isSignedIn) {
      this.getTasksFromDB();
    }
  }

  public getTasksList$(): Observable<Task[]> {
    return this.tasksList$.asObservable();
  }

  public add(_task: Pick<Task, 'created' | 'isDone' | 'name'>): void {
    this.http.saveOneTask(_task).subscribe({
      next: (res: ResponseMessage) => {
        this.notification.showSuccess(res.message + ' in DataBase', 'Success:');
        this.getTasksFromDB(); //need to reload list to Take a new Task ID from Mongo DB
      },
      error: (err) => {
        this.notification.showWarning(
          'The Task cannot be saved. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public remove(_task: Pick<Task, '_id'>): void {
    this.http.removeOneTask(_task).subscribe({
      next: (res: ResponseMessage) => {
        this.notification.showSuccess(
          res.message + ' from DataBase',
          'Success:'
        );
        const tasksList = this.tasksList$
          .getValue()
          .filter((item) => item != _task);
        this.tasksList$.next(tasksList);
      },
      error: (err) => {
        this.notification.showWarning(
          'The Task cannot be updated in DB. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public done(_task: Pick<Task, '_id' | 'end' | 'isDone'>): void {
    _task.end = new Date().toLocaleString();
    _task.isDone = true;
    this.http.updateOneTaskToDone(_task).subscribe({
      next: (res: ResponseMessage) => {
        this.notification.showSuccess(res.message + ' in DataBase', 'Success:');
        const tasksList = this.tasksList$.getValue();
        this.tasksList$.next(tasksList);
      },
      error: (err) => {
        this.notification.showWarning(
          'The Task cannot be updated. Please reload App and try again.',
          'Warning'
        );
      },
    });
  }
  public getTasksFromDB(): void {
    this.http.getTasks().subscribe({
      next: (tasksResponse: TasksResponse) => {
        this.tasksList$.next(tasksResponse.tasks);
        this.notification.showSuccess(
          'Tasks have been reloaded from DB',
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

  public clearTasksList(): void {
    this.tasksList$.next([]);
  }
}
