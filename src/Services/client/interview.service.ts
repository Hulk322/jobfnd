import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private http: HttpClient) { }

  private allInterviewsUrl = environment.baseApiUrlClient + "/client/interviews";
  private storeUrl = environment.baseApiUrlClient + "/client/submissions";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllInterviews(page) {
    return this.http.get(this.allInterviewsUrl+"?page="+page, this.httpOptions)
  }

  getTodayInterviews(page) {
    return this.http.get(this.allInterviewsUrl+"?limit=today&page="+page, this.httpOptions)
  }

  getWeekInterviews(page) {
    return this.http.get(this.allInterviewsUrl+"?limit=week&page="+page, this.httpOptions)
  }

  getSortAscInterviews(page) {
    return this.http.get(this.allInterviewsUrl+"?sort=asc&page="+page, this.httpOptions)
  }

  getSortDescInterviews(page) {
    return this.http.get(this.allInterviewsUrl+"?sort=desc&page="+page, this.httpOptions)
  }

  getInterviewsByStatus(status, page) {
    return this.http.get(this.allInterviewsUrl+"?status[0]="+status+"&page="+page, this.httpOptions)
  }

  getInterviewsByKeyword(keywrod, page) {
    return this.http.get(this.allInterviewsUrl+"?what="+keywrod+"&page="+page, this.httpOptions)
  }

  getCreateData(submission_id){
    return this.http.get(this.storeUrl+"/"+submission_id+"/interviews"+"/create", this.httpOptions);
  }

  store(submission_id, interview){
    return this.http.post(this.storeUrl+"/"+submission_id+"/interviews", interview, this.httpOptions)
  }

  delete(id) {
    return this.http.delete(this.allInterviewsUrl + "/" + id, this.httpOptions);
  }

}