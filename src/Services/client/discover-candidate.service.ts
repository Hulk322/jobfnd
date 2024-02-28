import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscoverCandidateService {

  constructor(
    private http: HttpClient
  ) { }

  private discoverCandidatesUrl = environment.baseApiUrlClient + "/client/jobs/";
  private compareCandidatesUrl = environment.baseApiUrlClient + "/client/talents/";
  private dismissMatchingCandidateUrl = environment.baseApiUrlClient + "/client/talents/";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getCandidates(job_id) {
    return this.http.get(this.discoverCandidatesUrl+job_id+'/talent', this.httpOptions);
  }

  filterCandidates(job_id, skills, titles){
    return this.http.get(this.discoverCandidatesUrl+job_id+'/search-talents?Employers='+skills+'&Titles='+titles, this.httpOptions);
  }

  compareCandidates(job_id, resume_id_1, resume_id_2, resume_id_3){
    if(resume_id_3==undefined)
      return this.http.post(this.compareCandidatesUrl+job_id+'/compare?resume_id='+resume_id_1+','+resume_id_2, this.httpOptions);
    else
      return this.http.post(this.compareCandidatesUrl+job_id+'/compare?resume_id='+resume_id_1+','+resume_id_2+','+resume_id_3, this.httpOptions);      
  }

  compareCandidatesSampleRequest(job_id=207, resume_id_3,
                                   resume_id_1='simp-r-1589530294-x-tp-cxpfqnpizshtgnkzis5hna', 
                                   resume_id_2='simp-r-1589530515-x-tp-3xvuxmnkjdguzjtqc44k7g'){
    return this.http.get(this.compareCandidatesUrl+job_id+'/compare?resume_id='+resume_id_1+','+resume_id_2+','+resume_id_3, this.httpOptions);
  }

  loadMore(moreUrl) {
    return this.http.get(moreUrl, this.httpOptions);
  }

  inviteToJob(job_id, talent_id){
    return this.http.post(this.discoverCandidatesUrl+job_id+'/talent/'+talent_id, this.httpOptions);
  }

  dismiss(job_id, talent_id, type, matched_talent_id=0){
    if(type=='by_job_id')
      return this.http.post(this.discoverCandidatesUrl+job_id+'/talent/'+talent_id+'/dismiss', this.httpOptions);
    if(type=='by_talent_id_similar')
      return this.http.post(this.dismissMatchingCandidateUrl + talent_id + '/' +
                                    matched_talent_id+'/dismiss', this.httpOptions);
  }

}
