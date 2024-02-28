import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(
    private http: HttpClient
  ) { }

  private templatesUrl = environment.baseApiUrlClient + "/client/jobs/template";
  private deleteUrl = environment.baseApiUrl + "/client/jobs/template/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getTemplates() {
    return this.http.get(this.templatesUrl, this.httpOptions);
  }

  get(id){
    return this.http.get(this.templatesUrl+"/"+id, this.httpOptions);
  }

  delete(id) {
    return this.http.delete(this.deleteUrl + id, this.httpOptions);
  }

  getTemplate(id){
    return this.http.get(this.templatesUrl + "/" + id + "/edit", this.httpOptions);
  }


}
