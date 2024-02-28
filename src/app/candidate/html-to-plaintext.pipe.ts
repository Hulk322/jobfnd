import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlToPlaintext'
})
export class HtmlToPlaintextPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //return 'demo desc';
    return value ? String(value).replace(/<[^>]+>/gm, '') : '';
  }

}
