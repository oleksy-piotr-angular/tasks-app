import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Task } from '../models/task';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList$ = new BehaviorSubject<Array<Task>>([]);

  constructor(
    private http: HttpService,
    private user: AuthService,
    private toastr: ToastrService
  ) {
    if (user.isLoggedIn()) {
      this.getTasksFromDB();
    }
  }

  getTasksList$(): Observable<Array<Task>> {
    return this.tasksList$.asObservable();
  }

  async add(task: Task) {
    localStorage.setItem('isLoading', 'yes');
    const tasksList = this.tasksList$.getValue();
    tasksList.push(task);
    this.tasksList$.next(tasksList);
    await this.saveOneTaskInDB(task)
      .then(async (response) => {
        this.toastr.clear();
        this.toastr.success('Successfully saved.');
      })
      .catch((err) => {
        const errorMessage = err.error[Object.keys(err.error)[0]]; //extract Error Message
        this.toastr.clear();
        this.toastr.error(errorMessage);
      });

    this.getTasksFromDB(); //need to reload list to Take Task ID
  }
  async remove(task: Task) {
    localStorage.setItem('isLoading', 'yes');
    const tasksList = this.tasksList$.getValue().filter((item) => item != task);
    this.tasksList$.next(tasksList);
    await this.removeOneTaskInDB(task)
      .then((_response) => {
        this.toastr.clear();
        const response = Object.values(_response);
        this.toastr.success(response[0]); //message Response
      })
      .catch((err) => {
        const errorMessage = err.error[Object.keys(err.error)[0]]; //extract Error Message
        this.toastr.clear();
        this.toastr.error(errorMessage);
      });
    localStorage.removeItem('isLoading');
  }
  async done(task: Task) {
    localStorage.setItem('isLoading', 'yes');
    task.end = new Date().toLocaleString();
    task.isDone = true;
    const tasksList = this.tasksList$.getValue();
    this.tasksList$.next(tasksList);
    await this.updateOneTaskInDB(task)
      .then((_response) => {
        this.toastr.clear();
        const response = Object.values(_response);
        this.toastr.success(response[0]); //message Response
      })
      .catch((err) => {
        const errorMessage = err.error[Object.keys(err.error)[0]]; //extract Error Message
        this.toastr.clear();
        this.toastr.error(errorMessage);
      });
    localStorage.removeItem('isLoading');
  }

  //Async functions with API Requests
  async updateOneTaskInDB(task: Task) {
    try {
      const responseData$ = await this.http.updateOneTaskToDone(task);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw err;
    }
  }
  async removeOneTaskInDB(task: Task) {
    try {
      const responseData$ = await this.http.removeOneTask(task);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw err;
    }
  }
  async saveOneTaskInDB(task: Task) {
    try {
      const responseData$ = await this.http.saveOneTask(task);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw err;
    }
  }
  getTasksFromDB() {
    localStorage.setItem('isLoading', 'yes');
    this.toastr.info('Loading...');
    //try {
    this.http.getTasks().subscribe((tasks) => {
      const responseArray = Object.values(tasks);
      const listOfTasks: Task[] = Object.values(responseArray[0]);
      this.tasksList$.next(listOfTasks);
      this.toastr.clear();
      localStorage.removeItem('isLoading');
    });
    // } catch (err) {
    //   localStorage.removeItem('isLoading');
    //   throw err;
    // }
  }

  clearTasksList() {
    this.tasksList$.next([]);
  }
}
