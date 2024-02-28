import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Hour12'
})
export class ConvertTo12HourPipe implements PipeTransform {

  transform(value: any): any {

    var time;
    // Check correct time format and split into components
    time = value.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }



}
