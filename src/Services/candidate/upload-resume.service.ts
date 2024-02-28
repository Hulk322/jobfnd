import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadResumeService {

  constructor(private http:HttpClient) { }

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  postFile(fileToUpload: File) {
    const endpoint = environment.baseApiUrl+'/candidate/profile/resume/upload-resume';
    const formData: FormData = new FormData();
    formData.append('resume', fileToUpload);
    return this.http.post(endpoint, formData, this.httpOptions);    
  }
}
