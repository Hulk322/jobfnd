import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appendText'
})
export class AppendTextPipe implements PipeTransform {

  transform(value: any, text: any): any {
    return value+" "+text;
  }

}
