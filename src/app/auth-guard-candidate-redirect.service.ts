import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router';
import {TokenService} from '../Services/token.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardCandidateRedirectService implements CanActivate, CanActivateChild {

  canActivate() {
    console.log('i am checking to see if you are logged in as Candidate');

    if(localStorage.getItem('is_candidate') && localStorage.getItem('token') )
      this.router.navigateByUrl('/candidate/dashboard');
    else if(localStorage.getItem('is_client') && localStorage.getItem('token') )
      this.router.navigateByUrl('/client/dashboard');
    else if(localStorage.getItem('is_vendor') && localStorage.getItem('token') )
      this.router.navigateByUrl('/vendor/dashboard');
    else if(localStorage.getItem('is_admin') && localStorage.getItem('token') )
      this.router.navigateByUrl('/admin/dashboard');
    else
    {
      //this.router.navigateByUrl('login');
      return true;
    }
  }

  constructor(private router:Router,
    private authService : TokenService){

  }

  canActivateChild() {
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
