import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private http: HttpClient) { }

  private allInterviewsUrl = environment.baseApiUrlClient + "/candidate/interviews";
  private storeUrl = environment.baseApiUrlClient + "/candidate/submissions";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllInterviews(page) {
    return this.http.get(`${this.allInterviewsUrl}?page=${page}`, this.httpOptions)
  }

  getTodayInterviews() {
    return this.http.get(this.allInterviewsUrl+"?limit=today", this.httpOptions)
  }

  getWeekInterviews() {
    return this.http.get(this.allInterviewsUrl+"?limit=week", this.httpOptions)
  }

  getSortAscInterviews() {
    return this.http.get(this.allInterviewsUrl+"?sort=asc", this.httpOptions)
  }

  getSortDescInterviews() {
    return this.http.get(this.allInterviewsUrl+"?sort=desc", this.httpOptions)
  }

  getInterviewsByStatus(status) {
    return this.http.get(this.allInterviewsUrl+"?status[0]="+status, this.httpOptions)
  }

  getInterviewsByKeyword(keywrod) {
    return this.http.get(this.allInterviewsUrl+"?what="+keywrod, this.httpOptions)
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
