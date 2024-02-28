import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from 'src/Services/shared/error.service';

import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })


  export class getUserData{
    constructor(private http: HttpClient,
        private errorService: ErrorService) { }

     isLoading = false;

     user_detail: any;
     inudstriesData: any;
     selectedIndustries: any;
     selectedLocations: any;
     isdisabled: any;
     isIndustryDisabled: any;
     userData: any;
     changePasswordUrl = environment.baseApiUrlClient+"/candidate/change-password";
     industriesUrl = environment.baseApiUrlClient+"/candidate/account-settings";
     locationSave = environment.baseApiUrlClient+"/candidate/account-settings/pref_locations/store?="
     industrySave = environment.baseApiUrlClient+"/candidate/account-settings/pref_industries/store?="
     expectedSalary =  environment.baseApiUrlClient+"/candidate/account-settings";
     getLocationDetails = environment.baseApiUrlClient+"/loging/history";

     resetPassword(user){
        return this.http.post(this.changePasswordUrl, user);
     }

     getIndustries(){
        return this.http.get(this.industriesUrl);
      }

     updateLocation(params:any){
        return this.http.post(this.locationSave ,params);
     }

     updateselectedIndustries(params: any){
        return this.http.post(this.industrySave, params);
     }

     deleteLocations(locationID: any){
        return this.http.delete(this.industriesUrl+"/pref_locations/"+locationID);
     }

     deleteIndustries(industriesID: any){
        return this.http.delete(this.industriesUrl+"/pref_industries/"+industriesID);
     }

     saveExpectedSalary(params:any){
      return this.http.post(this.expectedSalary, params);
     }

     getLocation(){
      return this.http.get(this.getLocationDetails);
     }

  }

