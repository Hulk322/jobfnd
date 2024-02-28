import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { VendorService } from 'src/Services/admin/vendor.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;

  isLoading = false;
  vendors = [];
  vendor = {
    id: null,
    first_name: null,
    last_name: null,
    password: '',
    password_confirmation: '',
    banned: false
  };

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

  search_keyword = '';  

  editVendorUrl =  environment.baseApiUrl+"/admin/users/vendors/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private _VendorService: VendorService,
    private http:HttpClient,
    private _ErrorService: ErrorService
  ) { }

  ngOnInit() {
    this.getVendors();
  }

  getVendors(){
    this.isLoading = true;
    this._VendorService.get(this.pageObj.page, this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }

  handleSuccess(data) {
    this.vendors = data.data.users.data;
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
    this.getVendors();
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

  editVendor(vendor){
    this.vendor = Object.assign({}, vendor);
  }

  updateVendor(){
    

    let formData = new FormData();
    
    for ( var key in this.vendor ) {
          formData.append(key, this.vendor[key]);
    }

    if(this.vendor.banned==true)
      formData.set('banned', '1');
    else
      formData.set('banned', '0');

    return this.http.post(this.editVendorUrl+this.vendor.id, formData, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data){
    var vendor = this.vendors.find(x => x.id === this.vendor.id);
    
    vendor.first_name = data.data.user.first_name;
    vendor.last_name = data.data.user.last_name;
    if(data.data.user.banned==1)
      vendor.banned = true;
    else
      vendor.banned = false;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		this.isLoading = false;
  }

  handleErrorPost(error){
    
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }

  deleteVendor(id, vendor) {
    var answer = confirm('Are you sure you want to delete this vendor?');
    if (answer) {
      this.isLoading = true;
      vendor.deleted = true;
      for (let i = 0; i < this.vendors.length; ++i) {
        if (this.vendors[i].id === id) {
          this._VendorService.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => this.handleError(err)
            );
        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.vendors.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

}
