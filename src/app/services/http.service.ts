import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { catchError, map, retry } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  //TASK requests
  getTasks(): Observable<Task[]> {
    const endpoint = 'tasks/myTasks';
    return this.http
      .get<Array<Task>>(this.apiUrl + endpoint, {
        responseType: 'json',
      })
      .pipe(
        retry(1)
        // catchError((err) => {
        //   throw err;
        // })
        //map((response) => response)
      );
  }
  async saveOneTask(task: Task): Promise<Observable<Task>> {
    const endpoint = 'tasks/create';
    return this.http.post<Task>(this.apiUrl + endpoint, task).pipe(
      retry(1),
      catchError((err) => {
        throw err;
      }),
      map((response) => response)
    );
  }
  async removeOneTask(task: Task): Promise<Observable<Task>> {
    const task_ID = task._id;
    const endpoint = 'tasks/removeTask/';
    return this.http.delete<Task>(this.apiUrl + endpoint + task_ID).pipe(
      retry(1),
      catchError((err) => {
        throw err;
      }),
      map((response) => response)
    );
  }
  async updateOneTaskToDone(task: Task): Promise<Observable<Task>> {
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
    return this.http
      .patch<Task>(this.apiUrl + endpoint + task_ID, updateBody)
      .pipe(
        retry(1),
        catchError((err) => {
          throw err;
        }),
        map((response) => response)
      );
  }

  //USER requests
  async signInRequest(user: User): Promise<Observable<User>> {
    const endpoint = 'user/login';
    return this.http
      .post<User>(this.apiUrl + endpoint, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        retry(1),
        catchError((err) => {
          throw err;
        }),
        map((response) => response)
      );
  }

  async signUpRequest(user: User): Promise<Observable<User>> {
    const endpoint = 'user/signup';
    const httpHeaders = new HttpHeaders();
    return this.http
      .post<User>(this.apiUrl + endpoint, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        retry(1),
        catchError((err) => {
          throw err;
        }),
        map((response) => response)
      );
  }
}
