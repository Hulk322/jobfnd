import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http:HttpClient) { }

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  postFile(fileToUpload: File, job_id) {
    const endpoint = environment.baseApiUrl+'/vendor/jobs/'+job_id+'/submission/upload-resume';
    const formData: FormData = new FormData();
    formData.append('resume', fileToUpload);

    
    

    return this.http.post(endpoint, formData, this.httpOptions);

    
}

postFilePublic(fileToUpload: File, job_id) {
  const endpoint = environment.baseApiUrl+'/'+job_id+'/submission/upload-resume';
  const formData: FormData = new FormData();
  formData.append('resume', fileToUpload);

  
  

  return this.http.post(endpoint, formData, this.httpOptions);

  
}

postResumeToJob(resume:File,job_slug){
 const endpoint = environment.baseApiUrl+'/jobs/'+job_slug+'/upload-resume';
  const formData: FormData = new FormData();
  formData.append('resume', resume);
  return this.http.post(endpoint, formData, this.httpOptions);
}

postResumeToJobNew(resume:File, job_slug, first_name, last_name, email){
  const endpoint = environment.baseApiUrl+'/jobs/'+job_slug+'/upload-resume';
   const formData: FormData = new FormData();
   formData.append('first_name', first_name);
   formData.append('last_name', last_name);
   formData.append('email', email);
   formData.append('resume', resume);

   if(sessionStorage.getItem('utm_source')!='' && sessionStorage.getItem('utm_source')!=null && sessionStorage.getItem('utm_source')!='undefined')
      formData.append('utm_source', sessionStorage.getItem('utm_source'));
   
   if(sessionStorage.getItem('utm_medium')!='' && sessionStorage.getItem('utm_medium')!=null && sessionStorage.getItem('utm_medium')!='undefined')
      formData.append('utm_medium', sessionStorage.getItem('utm_medium'));

   if(sessionStorage.getItem('utm_campaign')!='' && sessionStorage.getItem('utm_campaign')!=null && sessionStorage.getItem('utm_campaign')!='undefined')
    formData.append('utm_campaign', sessionStorage.getItem('utm_campaign'));

   return this.http.post(endpoint, formData, this.httpOptions);
 }
 

}
