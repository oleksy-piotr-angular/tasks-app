import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Task } from '../models/task';
import { NotificationService } from './notification.service';
import { ResponseMessage } from '../models/types';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  //USER SignUp request
  public signUp(_user: User): Observable<ResponseMessage> {
    this.notification.showInfo('Please wait...', 'INFO:');
    const endpoint = 'user/signup';
    return this.http.post<ResponseMessage>(this.apiUrl + endpoint, {
      email: _user.email,
      password: _user.password,
    });
  }

  //TASK requests
  public getTasks(): Observable<Task[]> {
    const endpoint = 'tasks/myTasks';
    return this.http.get<Task[]>(this.apiUrl + endpoint, {
      responseType: 'json',
    });
  }
  public saveOneTask(
    task: Pick<Task, 'name' | 'created' | 'isDone'>
  ): Observable<ResponseMessage> {
    const endpoint = 'tasks/create';
    return this.http.post<ResponseMessage>(this.apiUrl + endpoint, task);
  }
  public removeOneTask(task: Pick<Task, '_id'>): Observable<ResponseMessage> {
    const task_ID = task._id;
    const endpoint = 'tasks/removeTask/';
    return this.http.delete<ResponseMessage>(this.apiUrl + endpoint + task_ID);
  }
  public updateOneTaskToDone(
    task: Pick<Task, '_id' | 'end'>
  ): Observable<ResponseMessage> {
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
    return this.http.patch<ResponseMessage>(
      this.apiUrl + endpoint + task_ID,
      updateBody
    );
  }
}
