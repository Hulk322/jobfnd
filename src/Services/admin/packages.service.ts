import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  constructor(private http: HttpClient) { }

  private packagesUrl = environment.baseApiUrlClient+"/admin/packages";
  private packagesCreateUrl = environment.baseApiUrlClient+"/admin/packages/create";

  get(page){
    return this.http.get(`${this.packagesUrl}?page=${page}`);
  }
    add(form){
    return this.http.post(this.packagesCreateUrl, form);
  }
  //  update(package_form){
  //   return this.http.put(this.packagesUrl+"/" + package_form.id+"/edit", package_form);
  // }
    delete(id) {
    return this.http.delete(this.packagesUrl + "/" + id);
  }
}
