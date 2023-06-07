import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Task } from '../models/task';
import { HttpService } from './http.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

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
    if (authService.isLoggedIn) {
      this.getTasksFromDB();
    } else {
      console.log('TaskService: user is not logged In');
    }
  }

  getTasksList$(): Observable<Array<Task>> {
    return this.tasksList$.asObservable();
  }

  add(task: Task) {
    const tasksList = this.tasksList$.getValue();

    this.http.saveOneTask(task).subscribe((res) => {
      tasksList.push(task);
      this.tasksList$.next(tasksList);
      this.getTasksFromDB(); //need to reload list to Take Task ID
      this.notification.showSuccess(res.message, 'Success:');
    });
  }
  remove(task: Task) {
    const tasksList = this.tasksList$.getValue().filter((item) => item != task);
    this.tasksList$.next(tasksList);
    this.http.removeOneTask(task).subscribe((res) => {
      this.notification.showSuccess(res.message, 'Success:');
    });
  }
  done(task: Task) {
    task.end = new Date().toLocaleString();
    task.isDone = true;
    const tasksList = this.tasksList$.getValue();
    this.tasksList$.next(tasksList);
    this.http.updateOneTaskToDone(task).subscribe((res) => {
      console.log(res);
      this.notification.showSuccess(res.message, 'Success:');
    });
  }
  getTasksFromDB() {
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

  clearTasksList() {
    this.tasksList$.next([]);
  }
}
