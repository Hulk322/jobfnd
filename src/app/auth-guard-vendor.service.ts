import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuardVendor implements CanActivate, CanActivateChild {

  canActivate() {
    return true;
    console.log('i am checking to see if you are logged in as Vendor');
    if(localStorage.getItem('is_vendor'))
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