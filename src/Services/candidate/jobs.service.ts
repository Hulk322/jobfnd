import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(
    private http: HttpClient
 ) { }

private jobsUrl = environment.baseApiUrlClient+"/candidate/jobs";
private savedJobsUrl = environment.baseApiUrlClient+"/candidate/jobs/saved";
private recommendedJobsUrl = environment.baseApiUrlClient+"/candidate/profile/recommended-jobs";
private appliedJobsUrl = environment.baseApiUrlClient+"/candidate/submissions/jobs";
private acceptedJobsUrl = environment.baseApiUrlClient+"/candidate/submissions/jobs/accepted";
private appliedJobDetailsUrl = environment.baseApiUrlClient+"/candidate/jobs";
private statsUrl = environment.baseApiUrlClient+"/candidate/profile/stats";
private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
private httpOptions = {
 headers: this.headers_object
};

  getJobs(){
    return	 this.http.get(this.jobsUrl, this.httpOptions);  
  }

  getSavedJobs(page){
    return	 this.http.get(`${this.savedJobsUrl}?page=${page}`, this.httpOptions);  
  }

  getSimilarJobs(job_id){
    return this.http.get(this.jobsUrl+"/"+job_id+"/similar-jobs", this.httpOptions); 
  }

  getRecommendedJobs(job_id){
    return this.http.get(this.recommendedJobsUrl, this.httpOptions); 
  }

  getAppliedJobs(page){
    return	 this.http.get(`${this.appliedJobsUrl}?page=${page}`, this.httpOptions); 
  }

  getAcceptedJobs(page){
    return	 this.http.get(`${this.acceptedJobsUrl}?page=${page}`, this.httpOptions); 
  }

  getAppliedJobDetails(id){
    return	 this.http.get(this.appliedJobDetailsUrl+"/"+id, this.httpOptions);
  }

  getStats(){
    return	 this.http.get(this.statsUrl, this.httpOptions); 
    
  }

  getJob(job_id){
    return	 this.http.get(this.jobsUrl+"/"+job_id, this.httpOptions);
  }

  searchJobs(what, where, job_type_0, job_type_1, company_size, categories, sort='desc'){
    console.log(what);
    return	 this.http.get(this.jobsUrl+"?what="+what+"&where="+where+"&job_types[0]="
                          +job_type_0+"&job_types[1]="+job_type_1+"&company_size="+company_size+
                          "&categories="+categories+"&orderType="+sort, this.httpOptions);  
  }

  applyToJob(job_id, answers?){
    if(answers!=null)
      return  this.http.post(this.jobsUrl+"/"+job_id+"/quick-apply", { id:job_id, answers: answers}, this.httpOptions);  
    else
      return  this.http.post(this.jobsUrl+"/"+job_id+"/quick-apply", { id:job_id}, this.httpOptions);  
  }

  toggleSavedJob(job_id){
      return  this.http.get(this.jobsUrl+"/"+job_id+"/save", this.httpOptions);  
  }

}