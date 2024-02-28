import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
  		 private http: HttpClient
  	) { }

   public jobs = [];
   private jobsUrl = environment.baseApiUrl+"/vendor/jobs";
   private jobUrl:any;
   private deleteSubmissionUrl = environment.baseApiUrl+"/vendor/submissions/delete/";
   private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

   getJobs(){

   		return	 this.http.get(this.jobsUrl, this.httpOptions);
		   	
   }

   getJob(id){
     this.jobUrl = environment.baseApiUrl+"/vendor/jobs/"+id;
    return	 this.http.get(this.jobUrl, this.httpOptions);
   }

   searchJobs(what){
    //console.log(what);
    return	 this.http.get(this.jobsUrl+"?what="+what, this.httpOptions);  
  }

   getClientJob(id){
    this.jobUrl = environment.baseApiUrlClient+"/client/jobs/"+id+"/edit";
    return	 this.http.get(this.jobUrl, this.httpOptions);
   }

   getJobPublic(id){
    this.jobUrl = environment.baseApiUrlClient+"/jobs/"+id;
    return	 this.http.get(this.jobUrl, this.httpOptions);
   }

   deleteSubmission(id){
    return	 this.http.get(this.deleteSubmissionUrl+id, this.httpOptions);
   }

}
