import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {

  constructor(private http: HttpClient) { }

  private customFieldsUrl = environment.baseApiUrlClient+"/client/custom-fields";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getList(){
    return this.http.get(this.customFieldsUrl, this.httpOptions);
  }

  add(field){
    return this.http.post(this.customFieldsUrl, field, this.httpOptions);
  }

  update(field){
    return this.http.post(this.customFieldsUrl+"/"+field.id, field, this.httpOptions);
  }

  delete(field){
    return this.http.delete(this.customFieldsUrl+"/"+field.id, this.httpOptions);
  }

}
