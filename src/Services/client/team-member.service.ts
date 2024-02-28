import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

constructor(private http: HttpClient) { }

  private teamMembersUrl = environment.baseApiUrlClient+"/client/team-members";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getList(){
    return this.http.get(this.teamMembersUrl, this.httpOptions);
  }

  add(member){
    return this.http.post(this.teamMembersUrl, member, this.httpOptions);
  }

  update(member){
    return this.http.post(this.teamMembersUrl+"/"+member.id+"/update-access", member, this.httpOptions);
  }

  delete(member){
    return this.http.delete(this.teamMembersUrl+"/"+member.id, this.httpOptions);
  }

}
