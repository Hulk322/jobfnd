import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/Services/admin/candidate.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {

  isLoading = false;
  candidates = [];
  candidate = {
    id: null,
    first_name: null,
    last_name: null,
    banned: false,
    password: null
  };

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

  search_keyword = '';

  editCandidateUrl =  environment.baseApiUrl+"/admin/users/candidates/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private _CandidateService: CandidateService,
    private http:HttpClient,
    private _ErrorService: ErrorService
  ) { }

  ngOnInit() {
    this.getCandidates();  
  }

  getCandidates(){
    this.isLoading = true;
    this._CandidateService.get(this.pageObj.page, this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }

  handleSuccess(data) {
    this.candidates = data.data.users.data;
    this.pageObj.pageSize = data.data.users.per_page;
    this.pageObj.totalElements = data.data.users.total;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  pageChange(selectedPage){
    window.scroll(0, 0);
    this.pageObj.page = selectedPage;
    this.getCandidates();
  }

  deleteCandidate(id, candidate) {
    var answer = confirm('Are you sure you want to delete this candidate?');
    if (answer) {
      this.isLoading = true;
      candidate.deleted = true;
      for (let i = 0; i < this.candidates.length; ++i) {
        if (this.candidates[i].id === id) {
          this._CandidateService.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => this.handleError(err)
            );
        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.candidates.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  editCandidate(candidate){
    this.candidate = Object.assign({}, candidate);
  }

  updateCandidate(){
    

    let formData = new FormData();
    
    for ( var key in this.candidate ) {
          formData.append(key, this.candidate[key]);
    }

    if(this.candidate.banned==true)
      formData.set('banned', '1');
    else
      formData.set('banned', '0');

    return this.http.post(this.editCandidateUrl+this.candidate.id, formData, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleError(error)
    );
  }

  handleSuccessPost(data){
    var candidate = this.candidates.find(x => x.id === this.candidate.id);
    
    candidate.first_name = data.data.user.first_name;
    candidate.last_name = data.data.user.last_name;
    if(data.data.user.banned==1)
      candidate.banned = true;
    else
      candidate.banned = false;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		this.isLoading = false;
  }


}
