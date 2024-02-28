import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(input: any, character: string = '', type: string): any {
   if (!Array.isArray(input)) {
      return input;
    }
    if(type=="skills") {
    	let flaten = "";
    	input.map((skill)=>{
    		flaten += skill.name+","
    	})
    	return flaten;
    }else{
    	return input.join(character);
    }
  }

}
