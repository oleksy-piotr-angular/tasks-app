import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { ResponseMessage, TasksResponse } from '../models/types';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  //TASK requests
  public getTasks(): Observable<TasksResponse> {
    const endpoint = 'tasks/myTasks';
    return this.http.get<TasksResponse>(this.apiUrl + endpoint, {
      responseType: 'json',
    });
  }
  public saveOneTask(
    task: Pick<Task, 'name' | 'created' | 'isDone'>
  ): Observable<ResponseMessage> {
    const endpoint = 'tasks/create';
    return this.http.post<ResponseMessage>(this.apiUrl + endpoint, task);
  }
  public removeOneTask(_task: Pick<Task, '_id'>): Observable<ResponseMessage> {
    //const task_ID = ;
    const endpoint = 'tasks/removeTask/';
    return this.http.delete<ResponseMessage>(
      this.apiUrl + endpoint + _task._id
    );
  }
  public updateOneTaskToDone(
    _task: Pick<Task, '_id' | 'end' | 'isDone'>
  ): Observable<ResponseMessage> {
    const endpoint = 'tasks/updateTask/';
    const updateBody = [
      {
        propName: 'isDone',
        value: _task.isDone,
      },
      {
        propName: 'end',
        value: _task.end,
      },
    ];
    return this.http.patch<ResponseMessage>(
      this.apiUrl + endpoint + _task._id,
      updateBody
    );
  }
}
