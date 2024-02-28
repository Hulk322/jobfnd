import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  handle(token){
    this.set(token);
  }

  set(token){
    localStorage.setItem('token', token);
    localStorage.setItem("timer", "1");
  }

  get(){
    return localStorage.getItem('token');
  }

  remove(){
    localStorage.removeItem('token');
  }

  isValid(){
    const token = this.get();
    if(token){
      const payload = this.payload(token);
      if(payload){
        return true;
      }
    }
    return false;
  }

  payload(token){
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload){
    return JSON.parse(atob(payload));
  }

  loggedIn(){
    return this.isValid();
  }

  getTokenExpirationDate(token: string): Date {
    
    if (token === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(0.1);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.get();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }
}
