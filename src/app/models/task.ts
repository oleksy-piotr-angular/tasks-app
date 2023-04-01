export interface Task {
  _id?: { $oid: string };
  name: string;
  created: string;
  end?: string;
  isDone: boolean;
}
