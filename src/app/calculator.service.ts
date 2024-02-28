import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() { }

  add(x, y){
    return x+y;
  }

  subtract(x, y){
    return x-y;
  }

}
