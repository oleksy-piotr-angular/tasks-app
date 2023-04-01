import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTask',
})
export class TransformTaskPipe implements PipeTransform {
  transform(value: string, args: string = ''): unknown {
    return value.charAt(0).toUpperCase() + value.slice(1) + args;
  }
}
