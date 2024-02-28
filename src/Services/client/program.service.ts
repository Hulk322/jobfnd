import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient) { }

  private programsUrl = environment.baseApiUrlClient+"/client/programs";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getPrograms(){
    return this.http.get(this.programsUrl, this.httpOptions);
  }

  add(program){
    return this.http.post(this.programsUrl, program, this.httpOptions);
  }

  update(program){
    return this.http.post(this.programsUrl+"/"+program.id, program, this.httpOptions);
  }

  delete(program){
    return this.http.delete(this.programsUrl+"/"+program.id, this.httpOptions);
  }
}
