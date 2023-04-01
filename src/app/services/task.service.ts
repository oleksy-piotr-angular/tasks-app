import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList$ = new BehaviorSubject<Array<Task>>([]);

  constructor(private http: HttpService) {
    this.getTasksFromDB();
  }

  getTasksList$(): Observable<Array<Task>> {
    return this.tasksList$.asObservable();
  }

  getTasksFromDB() {
    this.http.getTask().subscribe((tasks) => {
      const requestArray = Object.values(tasks);
      const listOfTasks: Task[] = Object.values(requestArray[0]);
      this.tasksList$.next(listOfTasks);
      console.log(listOfTasks);
    });
  }
  add(task: Task) {
    const tasksList = this.tasksList$.getValue();
    tasksList.push(task);
    this.tasksList$.next(tasksList);
    this.saveOneTaskInDB(task);
    this.getTasksFromDB();
  }
  remove(task: Task) {
    const tasksList = this.tasksList$.getValue().filter((item) => item != task);
    this.tasksList$.next(tasksList);
    this.removeOneTaskInDB(task);
  }
  done(task: Task) {
    task.end = new Date().toLocaleString();
    task.isDone = true;
    const tasksList = this.tasksList$.getValue();
    this.tasksList$.next(tasksList);
    this.updateOneTaskInDB(task);
  }
  saveOneTaskInDB(task: Task) {
    this.http.saveOneTask(task);
  }
  updateOneTaskInDB(task: Task) {
    this.http.updateOneTaskToDone(task);
  }
  removeOneTaskInDB(task: Task) {
    this.http.removeOneTask(task);
  }
}
