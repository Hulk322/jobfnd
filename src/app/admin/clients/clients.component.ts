import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { ClientsService } from 'src/Services/admin/clients.service';
import { Router } from '@angular/router';
declare var jQuery:any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;
  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  isLoading = false;
  clients = [];
  client = {
    id: null,
    first_name: null,
    last_name: null,
    password: '',
    password_confirmation: '',
    banned: false
  };

  clientForm = {
    first_name: null,
    last_name: null,
    email: null,
    type:'client',
    company_name: null,
    activate: 0,
  }

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

  search_keyword = '';

  editClientUrl =  environment.baseApiUrl+"/admin/users/client/";
  addClientUrl = environment.baseApiUrl+"/admin/create-user";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private _ClientsService: ClientsService,
    private http:HttpClient,
    private _ErrorService: ErrorService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getClients();
  }

  getClients(){
    this.isLoading = true;
    this._ClientsService.get(this.pageObj.page, this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }

  handleSuccess(data) {
    
    this.clients = data.data.users.data;
    this.pageObj.pageSize = data.data.users.per_page;
    this.pageObj.totalElements = data.data.users.total;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  createClient() {
      this.isLoading = true;
      this.http.post(this.addClientUrl, this.clientForm, this.httpOptions).subscribe(
          data => this.handlSuccessCreate(data),
          error => this.handleError(error),
        )
  }

  handlSuccessCreate(data){
    jQuery(this.completeModal.nativeElement).modal('hide');
    this.clientForm = { first_name: null, last_name:null, email: null, company_name:null, type:'client', activate:0};
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  pageChange(selectedPage){
    window.scroll(0, 0);
    this.pageObj.page = selectedPage;
    this.getClients();
  }

  showPassword(obj) {
    //console.log(obj);
    
    var x = this.password.nativeElement;
  	if (x.type === "password") {
      this.eyeShowPassword.nativeElement.classList.remove("fa-eye");
      this.eyeShowPassword.nativeElement.classList.add("fa-eye-slash");
      x.type = "text";
  } else {
    this.eyeShowPassword.nativeElement.classList.remove("fa-eye-slash");
    this.eyeShowPassword.nativeElement.classList.add("fa-eye");
    x.type = "password";
    }
	}

  editClient(client){
    this.client = Object.assign({}, client);
  }

  updateClient(){
    console.log(this.client);

    let formData = new FormData();
    
    for ( var key in this.client ) {
          formData.append(key, this.client[key]);
    }

    if(this.client.banned==true)
      formData.set('banned', '1');
    else
      formData.set('banned', '0');

    return this.http.post(this.editClientUrl+this.client.id, formData, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data){
    var client = this.clients.find(x => x.id === this.client.id);
    //client = data.data.client;
    client.first_name = data.data.user.first_name;
    client.last_name = data.data.user.last_name;
    if(data.data.user.banned==1)
      client.banned = true;
    else
      client.banned = false;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		this.isLoading = false;
  }

  handleErrorPost(error){
    console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }

  deleteClient(id, client) {
    var answer = confirm('Are you sure you want to delete this client?');
    if (answer) {
      this.isLoading = true;
      client.deleted = true;
      for (let i = 0; i < this.clients.length; ++i) {
        if (this.clients[i].id === id) {
          this._ClientsService.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => this.handleError(err)
            );
        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.clients.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  selectClientInterview(id) {
    // alert(id);
    this.router.navigate(['admin/interviews/clients'+"/"+id], {queryParams:{'type':'client_interviews'}});
  }

  selectClientSubmission(id) {
    this.router.navigate(['admin/submissions/clients'+"/"+id], {queryParams:{'type':'client_submissions'}});
  }
  selectClientOffer(id) {
    this.router.navigate(['admin/offers/clients'+"/"+id], {queryParams:{'type':'client_offers'}});
  }

}
