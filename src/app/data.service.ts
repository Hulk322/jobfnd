import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  private picturePath = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  currentPicturePath = this.picturePath.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeProfilePicture(path: string){
    this.picturePath.next(path);
  }

}