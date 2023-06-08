import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Task } from '../models/task';
import { NotificationService } from './notification.service';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  //USER SignUp request
  public signUp(_user: User): Observable<{ message: string }> {
    this.notification.showInfo('Please wait...', 'INFO:');
    const endpoint = 'user/signup';
    return this.http.post<{ message: string }>(this.apiUrl + endpoint, {
      email: _user.email,
      password: _user.password,
    });
  }

  //TASK requests
  public getTasks(): Observable<Task[]> {
    const endpoint = 'tasks/myTasks';
    return this.http.get<Array<Task>>(this.apiUrl + endpoint, {
      responseType: 'json',
    });
  }
  public saveOneTask(task: Task): Observable<{ message: string }> {
    const endpoint = 'tasks/create';
    return this.http.post<{ message: string }>(this.apiUrl + endpoint, task);
  }
  public removeOneTask(task: Task): Observable<{ message: string }> {
    const task_ID = task._id;
    const endpoint = 'tasks/removeTask/';
    return this.http.delete<{ message: string }>(
      this.apiUrl + endpoint + task_ID
    );
  }
  public updateOneTaskToDone(task: Task): Observable<{ message: string }> {
    const endpoint = 'tasks/updateTask/';
    const task_ID = task._id;
    const updateBody = [
      {
        propName: 'isDone',
        value: true,
      },
      {
        propName: 'end',
        value: task.end,
      },
    ];
    return this.http.patch<{ message: string }>(
      this.apiUrl + endpoint + task_ID,
      updateBody
    );
  }
}
