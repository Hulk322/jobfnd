import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  private departmentsUrl = environment.baseApiUrlClient+"/client/departments";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getDepartments(){
    return this.http.get(this.departmentsUrl, this.httpOptions);
  }

  add(department){
    return this.http.post(this.departmentsUrl, department, this.httpOptions);
  }

  update(department){
    return this.http.put(this.departmentsUrl+"/"+department.id, department, this.httpOptions);
  }

  delete(department){
    return this.http.delete(this.departmentsUrl+"/"+department.id, this.httpOptions);
  }

}