import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { catchError, map, retry } from 'rxjs/operators';
import { Task } from '../models/task';
import { UserService } from './user.service';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  //USER requests
  async signInRequest(user: User): Promise<Observable<User>> {
    console.log('SignIn Request.');
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
    console.log('SignUp Request.');
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

  //TASK requests
  getTask(): Observable<Array<Task>> {
    const endpoint = 'tasks/myTasks';
    return this.http.get<Array<Task>>(this.apiUrl + endpoint, {
      responseType: 'json',
    });
  }
  saveOneTask(task: Task) {
    const endpoint = 'tasks/create';
    this.http.post(this.apiUrl + endpoint, task).subscribe((response) => {
      console.log(response);
    });
  }
  removeOneTask(task: Task) {
    const task_ID = task._id;
    const endpoint = 'tasks/removeTask/';
    this.http.delete(this.apiUrl + endpoint + task_ID).subscribe((response) => {
      console.log(response);
    });
  }
  updateOneTaskToDone(task: Task) {
    const endpoint = 'tasks/updateTask/';
    const task_ID = task._id;
    const updateBody = {
      propName: 'isDone',
      value: true,
    };
    this.http
      .patch(this.apiUrl + endpoint + task_ID, updateBody)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
