import { Component, OnInit, ElementRef,Input, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {getUserData} from './account-setting.service'
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;
  @ViewChild('shownewpassword', { static: true }) new_password: ElementRef;
  @ViewChild('eye_show_new_password', { static: true }) eyeShowNewPassword: ElementRef;
  @Input() autocompleteInput: string;

  user = {
    old_password:null,
    password:null,
    password_confirmation:null
  };
  errors:any;
  success:any;
  isLoading = false;
  changePasswordUrl = environment.baseApiUrlClient+"/candidate/change-password";
  placeholder="Choose Location";
  place: any;
  name:any;
  addPlace: any = [];
  addLocationIndutires: any = [];
  selectedOption: any;
  currencyOption:any;
  selectedIndustries:any;
  selectedLocations:any;
  isActive: boolean;
  isdisabled: boolean;
  second_email: any;
  bucket_source: any;
  phone:any
  editMode:any;
  editModephone:any;
  isDuplicate: any;
  isIndustryDisabled: boolean;
  inudstriesData: any;
  deviceInfo: any;
  locationDetails:any
  user_detail = {
    'email': "",
  };
  accountMeta={
'second_email':"",
'currency':"",
'min_rate':"",
'max_rate':"",
'availability':"",
'phone':"",
'bucket_source' : '',
  };
  currencyValues: any = ['INR','Dollar'];
  emoji:any = ['']
  minRate:any ;
  maxRate:any;
  myDate:any;
  ipAddress:any;
  min8 = false;
  oneCapital = false;
  oneLower = false;
  oneNumeric = false;
  oneSpecial = false;
  spaceNotAllowed = false;
  ConfirmPasswordMatch = false;
  passwordDontmatch = true;
  

  constructor(
    private http:HttpClient,
    private getUserData: getUserData,
    private _ErrorService: ErrorService
    ) {  }
  
    private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };

  

  ngOnInit() {
    this.isdisabled;
    this.isIndustryDisabled
    this.isActive = false;
    this.editMode = false;
    this.editModephone =false;
    this.isDuplicate = false;
    this.deviceDetection()
    this.getIndustries();
  }


  showPassword(obj,event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var x = target.id === "old_password" ?  obj.password.nativeElement : obj.new_password.nativeElement;
    if ( (x.type === "password" && (target.id === "old_password" || target.id === "newPassword" ))) {
      target.innerHTML = "visibility_off";
      x.type = "text";
    } else {
      target.innerHTML = "visibility";
      x.type = "password";
    }
  }

  scroll(el: HTMLElement){
      el.scrollIntoView();
  }


  resetPassword(){
    this.isLoading = true;
    this.getUserData.resetPassword(this.user).subscribe(
      data =>this.handlePasswordUpdateSuccess(data),
      error => this.handleError(error)
    );
  }

  getIndustries(){
    this.getUserData.getIndustries().subscribe(data => this.handleSuccess(data),error => this.handleError(error));
  }

  handlePasswordUpdateSuccess(data){
    this.user = {old_password:null,password:null,password_confirmation:null};
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleSuccess(data){
    if(data.msg.success[0] !== ""){
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    }
    this.isLoading = false;
    this.user_detail = data.data.user;
    this.accountMeta = data.data.user.meta;
    this.inudstriesData = (data.data.industries).map(({id,name}) => ({id,name}));
    this.selectedIndustries = data.data.selected_industries.map(name => name);
    this.selectedLocations = data.data.locations.map(name => name);
    this.isdisabled = this.selectedLocations.length !==3 ? false:true;
    this.isIndustryDisabled = this.selectedIndustries.length !== 3 ? false:true;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    console.log(error.error);
    var output = '';
    error.error.msg.forEach(function (value) {
      output = output + " " + value;
    });
	  this.isLoading = false;
  }

  updateLocations(result,locations:any){
    if(result === true){
    let params = new HttpParams().set('location', locations);
    this.getUserData.updateLocation(params).subscribe(
      data =>this.updateSuccess(data),
      error => this.updateError(error)
    );
    } else{
      let error = {'error':'Duplicate Entry'};
      this.updateError(error);
      this.place = '';
    }
  }

  updateselectedIndustries(result,industries:any){
    if(result === true){
    let params = new HttpParams().set('industry_id', industries);
    this.getUserData.updateselectedIndustries(params).subscribe(
      data =>this.updateSuccess(data),
      error => this.updateError(error)
    );
    } else {
      let error = {'error':'Duplicate Entry'};
      this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    }
  }

  deleteLocations(locationID:any){
    this.getUserData.deleteLocations(locationID).subscribe(
      data =>this.updateSuccess(data),
      error => this.updateError(error)
    );
  }

  deleteIndustries(industriesID:any){
    this.getUserData.deleteIndustries(industriesID).subscribe(
      data =>this.updateSuccess(data),
      error => this.updateError(error)
    );
  }

  
  saveExpectedSalary(value){
    let currency = this.currencyOption !== undefined ? this.currencyOption : this.accountMeta.currency ;
    let minRate =  this.minRate !== undefined ? this.minRate : this.accountMeta.min_rate ;
    let maxRate =  this.maxRate !== undefined ? this.maxRate : this.accountMeta.max_rate ;
    let availableValue = (value !== undefined && typeof(value) !== "object") ? value : value.accountMeta.availability;
    let availability =  availableValue !== undefined ? availableValue : this.accountMeta.availability;
    let phone =  this.phone !== undefined ? this.phone : this.accountMeta.phone ;
    let second_email =  this.second_email !== undefined ? this.second_email : this.accountMeta.second_email ;
    let bucket_source =  this.bucket_source !== undefined ? this.bucket_source : this.accountMeta.bucket_source ;

  let  expectSalary = {
      currency: currency,
      min_rate: minRate,
      max_rate: maxRate,
      availability: availability ,
      phone: phone,
      second_email : second_email,
      bucket_source : bucket_source
    }
    
    this.getUserData.saveExpectedSalary(expectSalary).subscribe(
      data =>this.updateSuccess(data),
      error => this.updateError(error)
    )
    this.getIndustries();
  }




  updateSuccess(data){
    if(data.msg.success[0] !== ""){
      this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
      }
    this.isLoading = false;
    this.editMode = false;
    this.editModephone =false;
  }  

  updateError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    console.log(error.error);
    var output = '';
    if(error.error.msg){
    error.error.msg.forEach(function (value) {
      output = output + " " + value;
    });
  }
	  this.isLoading = false;
  }




  getAddress(place: object) {
    this.place = place['formatted_address'];
  }

  getAvailable(value: object){
    this.isActive = value['name']
  }

  addAddress(){
    this.addPlace.push(this.place);
    const checkLocation = this.place;
    this.isDuplicate = this.selectedLocations.map(function(name){
      const dulpicate = name.location;
      return dulpicate.includes(checkLocation);
    });
    const duplicate = this.isDuplicate.includes(true) ? false : true;
    this.updateLocations(duplicate,this.place);
    this.getIndustries();
    this.place = '';
  }
  removeAddress(index,place){
    this.selectedLocations.splice(index,1);
    this.deleteLocations(place.id);
    this.isdisabled = false;
  }


  addIndustry(){
    const checkLocation = this.selectedOption.name;
    this.isDuplicate = this.selectedIndustries.map(function(name){
      const dulpicate = name.name;
      return dulpicate.includes(checkLocation);
    });
    const duplicate = this.isDuplicate.includes(true) ? false : true;
    this.updateselectedIndustries(duplicate,this.selectedOption.id);
    this.getIndustries();
  }
  removeIndustry(index,industry){
    this.selectedIndustries.splice(index,1);
    this.deleteIndustries(industry.id);
    this.isIndustryDisabled = false;
  }
  
  deviceDetection() {
    this.getUserData.getLocation().subscribe(data => this.updateLocationSuccess(data),error => this.handleError(error));
    }

  updateLocationSuccess(data:any){
    this.deviceInfo = data.data.loging_histories.map(({login_at,ip,browser}) => ({login_at,ip,browser}));
     }

     validateRegex(password) {
      if (/^\S*$/.test(password)) {
        this.spaceNotAllowed = true;
      } else {
        this.spaceNotAllowed = false;
      }
  
      if (/\S{8}/.test(password)) {
        this.min8 = true;
      } else {
        this.min8 = false;
      }
  
      if (/[A-Z]{1}/.test(password)) {
        this.oneCapital = true;
      } else {
        this.oneCapital = false;
      }
  
      if (/[a-z]{1}/.test(password)) {
        this.oneLower = true;
      } else {
        this.oneLower = false;
      }
      if (/[0-9]{1}/.test(password)) {
        this.oneNumeric = true;
      } else {
        this.oneNumeric = false;
      }
      var Specialpattern = /(?=.*?[#?!@$%^&*-])/;
      if (Specialpattern.test(password)) {
        this.oneSpecial = true;
      } else {
        this.oneSpecial = false;
      }
  
      this.matchPassword(password);
  
      if (!this.min8 || !this.oneCapital || !this.oneLower  
          || !this.oneNumeric || !this.oneSpecial || !this.ConfirmPasswordMatch) {
        this.passwordDontmatch = true;
      } else {
        this.passwordDontmatch = false;
      }
  
    }
  
    matchPassword(password) {
  
      if (this.user.password != this.user.password_confirmation) {
        this.ConfirmPasswordMatch = false;
      } else {
        this.ConfirmPasswordMatch = true;
      }
  
      if(this.user.password=="" && this.user.password_confirmation  =="")
        this.ConfirmPasswordMatch=false;
  
    }
  
  }
