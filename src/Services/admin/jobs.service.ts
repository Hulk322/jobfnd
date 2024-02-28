import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }

  private jobUrl = environment.baseApiUrlClient+"/admin/jobs";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
   };

  get(page, search=''){
    return this.http.get(`${this.jobUrl}?page=${page}&search=${search}`, this.httpOptions);
  }

   delete(id, job_delete) {
    return this.http.post(this.jobUrl+"/"+id+"/delete", job_delete, this.httpOptions);
  }

}
