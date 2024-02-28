import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuardClient implements CanActivate, CanActivateChild {

  canActivate() {
    console.log('i am checking to see if you are logged in as Client');
    if(localStorage.getItem('is_client'))
      return true;
    else
    {
      this.router.navigateByUrl('login');
      return false;
    }
  }

  constructor(private router:Router){

  }

  canActivateChild() {
    console.log('checking child route access');
    return true;
  }

}