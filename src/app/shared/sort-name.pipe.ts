import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task';

@Pipe({
  name: 'sortName',
})
export class SortNamePipe implements PipeTransform {
  transform(value: Array<Task>, args?: any): Task[] {
    return value.sort((a, b) => {
      //we can to do comparison in this way
      // if (a.name.toLocaleLowerCase() > b.name.toLowerCase()) {
      //   return 1;
      // } else {
      //   return -1;
      // }
      //or much shorter
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
}
