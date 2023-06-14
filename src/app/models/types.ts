import { Task } from './task';
export type ResponseMessage = {
  message: string;
};

export type SignInResponse = {
  message: string;
  sessionToken: string;
};

export type ErrorMessage = {
  error: {
    message: string;
  };
};

export type TasksResponse = {
  tasks: Task[];
};

export type SessionToken = string;
export type SessionTime = string;
