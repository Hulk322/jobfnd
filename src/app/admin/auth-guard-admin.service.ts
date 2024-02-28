import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate, CanActivateChild {

  canActivate() {
    console.log('i am checking to see if you are logged in as Candidate');
    if(localStorage.getItem('is_admin'))
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
