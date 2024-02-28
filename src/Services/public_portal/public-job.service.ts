import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicJobService {

  constructor(private http: HttpClient) { }

  HttpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  }
  private jobsUrl = environment.baseApiUrlClient+"/jobs";
  private homeFiltersUrl = environment.baseApiUrlClient+"/home";
  private filtersUrl = environment.baseApiUrlClient+"/jobs/filters";
  private jobUrl = environment.baseApiUrlClient+"/jobs/";

  getJobsPublic(page) {
    return this.http.get(`${this.jobsUrl}?page=${page}`);
  }

  getSimilarJobs(page, job_slug) {
    return this.http.get(`${this.jobsUrl}/${job_slug}/similar-jobs?page=${page}`);
  }

  getJob(slug){
    return this.http.get(`${this.jobUrl}${slug}`);
  }

  getHomeFilters(){
    return this.http.get(this.homeFiltersUrl).toPromise();
  }

  getFilters(){
    return this.http.get(this.filtersUrl).toPromise();
  }

  searchJobs(what, where, job_type_0, job_type_1, company_size, categories){
    console.log(what);
    return	 this.http.get(this.jobsUrl+"?what="+what+"&where="+where+"&job_types[0]="+job_type_0+"&job_types[1]="+job_type_1+"&company_size="+company_size+"&categories="+categories);  
  }

  searchJobsByFilters(filters){
    return this.http.get(`${this.jobsUrl}${filters}`).toPromise();
  }

  applyForJob(jobId,form){
    let input = new FormData();
    input.append('first_name', form.first_name);
    input.append('last_name', form.last_name);
    input.append('email', form.email);
    input.append('country_code',form.country_code);
    input.append('mobile',form.mobile);
    input.append('resume',form.resume);
    return this.http.post(`${this.jobsUrl}/${jobId}/apply`, input).toPromise();
  }

  applyToJob(job_slug, answers?){
    if(answers!=null)
      return  this.http.post(this.jobsUrl+"/"+job_slug+"/post-questions", { uuid:localStorage.getItem('uuid'), answers: answers});  
    else
      return  this.http.post(this.jobsUrl+"/"+job_slug+"/post-questions", { uuid:localStorage.getItem('uuid')});  
  }

  applyWithApplicationJobQuestions(job_slug, submission_id, answers){
    
      return  this.http.post(this.jobsUrl+"/"+job_slug+"/post-engaged-questions/"+submission_id, { answers: answers});  
    
  }

  sendEmail(job_slug, name, email){
    return  this.http.post(this.jobsUrl+"/"+job_slug+"/send", { 'name': name, 'email': email });  
  }

  subscribeToJob(job_slug, name, email){
    return  this.http.post(this.jobsUrl+"/"+job_slug+"/subscribe", { 'name': name, 'email': email });  
  }

}
