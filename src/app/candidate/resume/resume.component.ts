import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { ViewChild } from '@angular/core';
import { DataService } from "src/app/data.service";
import { JobsService } from 'src/Services/candidate/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent  implements OnInit,AfterViewInit {

  profileUrl = environment.baseApiUrl + "/candidate/profile/resume";
  uploadResumeUrl = environment.baseApiUrl+"/candidate/profile/resume/upload";
  basicInfoUrl = environment.baseApiUrl + "/candidate/profile/basic-info";
  aboutMeUrl = environment.baseApiUrl + "/candidate/profile/about-me";
  profileUrlSetup = environment.baseApiUrl + "/candidate/profile/setup";
  baseUrl = environment.baseApiUrl.replace('/api/v1', '');
  workHistoryUrl = environment.baseApiUrl + "/candidate/profile/resume/work-history";
  educationUrl = environment.baseApiUrl + "/candidate/profile/resume/education";
  experienceUrl = environment.baseApiUrl + "/candidate/profile/resume/other-details";
  referenceUrl = environment.baseApiUrl + "/candidate/profile/resume/reference";
  socialMediaUrl = environment.baseApiUrl + "/candidate/profile/resume/social-media";
  skillsUrl = environment.baseApiUrl + "/candidate/profile/resume/skills/update";
  checkResumeParsedUrl = environment.baseApiUrl + "/candidate/profile/resume/parsed";
  additionalskillsUrl = environment.baseApiUrl + "/candidate/profile/resume/additional-skills/update";

  fileToUpload: File = null;
  resumeFileToUpload: File = null;
  documentToUpload: File = null;
  resume_uploaded = false;
  isLoading = false;
  first_time_loading = false;
  placeholder='';
  today=new Date();
  full_name = "";
  profile_picture = "";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private http: HttpClient,
    private _ErrorService: ErrorService,
    private _JobService: JobsService,
    private data: DataService,
    private router: Router) { }

    job = {
      id: null,
      title:null,
      description:null
    };

    current_step = "";
    last_step = "basic_info";
    completed_steps = [];

  public form_data = {
    profile: {
      first_name: null,
      last_name: null,
      middle_name: null,
      meta: {
        profile_picture: null,
        profilePictureFullUrl: '',
        mobile: '',
        location:''
      }
    },
    resume: {
      id: null,
      path: '',
      about_me: '',
      gender: null,
      email: '',
      salary_amount: null,
      salary_type: null,
      title: '',
      last_step: 'basic_info',
      completed_setup: 0,
      dob: '',
      home_phone: '',
      full_address: '',
      willing_to_relocate: 0,
      educations: [],
      employments: [],
      experiences: [],
      references: [],
      skills: [],
      additional_skills : [],
      social_media: [],
      documents: []
    }
  }

  socialMedia = [];

  work_history = {
    id: '',
    title: '',
    employer: '',
    start_date: '',
    end_date: '',
    description: '',
    sort_order: 0
  }

  other_detail = {
    id: '',
    experience: '',
    industry: '',
    vetran_status: 0
  }

  social = {
    id: '',
    title: '',
    url: ''
  }

  document = {
    id: '',
    title: ''
  }

  reference = {
    id: '',
    name: '',
    title: '',
    employer: '',
    phone: '',
    email: ''
  }

  education = {
    id: '',
    degree_type: '',
    degree_direction: '',
    institute: '',
    start_date: '',
    end_date: ''
  }

  sample_skills = [];

  ngOnInit() {
    this.isLoading = true;
    this.first_time_loading = true;
    this.job.id = localStorage.getItem("job_id");
    this.job.title = localStorage.getItem("job_title");
    this.job.description = localStorage.getItem("job_description");
    this.full_name = localStorage.getItem("full_name"); 
    this.profile_picture = localStorage.getItem("profile_picture");
    this.getResume();
    
  }

  ngAfterViewInit(){
    this.inItDragDrop(this);
    
      setInterval( ()=>{
        if(this.is_resume_parsed==false){
          this.checkResumeParsed();
        }
        }, 7000);    
  }

  checkResumeParsed(){
    return this.http.get(this.checkResumeParsedUrl, this.httpOptions).subscribe(
      data => this.handleSuccessUploadResume(data),
      error => this.handleError(error)
    );
  }

  isAdvancedUpload = function()
    {
      var div = document.querySelector( '.dropzone-container' );
      return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
    };

  inItDragDrop(that) {

    // drag&drop files if the feature is available
    var form = document.querySelector( '.dropzone-container' );
    
    var filename = document.querySelector( '.filename' );
    var droppedFiles;
    var input     = document.querySelector( 'input[type="file"]' );
   

    if( this.isAdvancedUpload )
    {  
      
      form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

      [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
      {
        form.addEventListener( event, function( e )
        {
          // preventing the unwanted behaviours
          e.preventDefault();
          e.stopPropagation();
        });
      });

      [ 'dragover', 'dragenter' ].forEach( function( event )
      {
        form.addEventListener( event, function()
        {
          form.classList.add( 'is-dragover' );
        });
      });

      [ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
      {
        form.addEventListener( event, function()
        {
          form.classList.remove( 'is-dragover' );
        });
      });

      form.addEventListener( 'drop', function( DragEvent: DragEvent  )
      {  
        console.log(DragEvent); 
        droppedFiles = DragEvent.dataTransfer.files; // the files that were dropped
        if (droppedFiles) {
          that.fileToUpload = droppedFiles[0];
           var filename = document.querySelector( '.filename' );
           filename.textContent = droppedFiles[0].name  ;
           that.resumeFileToUpload = droppedFiles[0];
           that.uploaded_file_name = droppedFiles[0].name;
        }

      });

    }
  }

  oneClickApplyToJob(job_id){
    this._JobService.applyToJob(job_id)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
    //var job = this.jobs.find(x => x.id === data.data.job.id);
    //console.log(job);
    //job.hasApplied=true;
    localStorage.removeItem("job_title");
    localStorage.removeItem("job_description");
    this.job.id = null;
    this.job.title = null;
    this.job.description = null;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  id: number;
  custom_avator = false;
  addClass(id) {
    this.id = id;
    //this.custom_avator = false;
    var blob = null;
var xhr = new XMLHttpRequest(); 
xhr.open("GET", 'assets/images/avatar'+id+'.jpg'); // assets/images/avatar11.jpg;
//console.log(xhr);
xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
var self = this;
xhr.onload = function() 
{
    //console.log('in');
    blob = xhr.response;//xhr.response is now a blob object
    var file = new File([blob], 'logo.png', {type: 'image/png', lastModified: Date.now()});
    console.log(file);   
    self.fileToUpload = file;
}
xhr.send();

    //id = this.id? 'selectedImg' : 'null';
  }

  oldImageFirstTime: File = null;
  addClass2(id) {
    this.id = id;
    this.fileToUpload = this.oldImageFirstTime;
  }

  handleJobApplyError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

  @ViewChild('documentFile', { static: true }) myInputVariable: ElementRef;

  resetDocument() {
    this.document = { id: '', title: '' };
    this.documentToUpload = null;
    this.myInputVariable.nativeElement.value = '';
  }

  addDocument() {
    var form_data = new FormData();

    form_data.set('title', this.document.title);

    form_data.append('document', this.documentToUpload);

    return this.http.post(this.profileUrl + "/" + "upload-document", form_data, this.httpOptions).subscribe(
      data => this.handlePostDocumentSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostDocumentSuccess(data) {
    //this.form_data.resume.documents = data.data.updatedResume.documents;
    this.form_data.resume.documents.unshift(data.data.document);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    console.log(data);
  }

  fileName = 'Drop the file here or browse';
  uploaded_file_name: string;

  handleFileInput(files: FileList) {
    this.resumeFileToUpload = files.item(0);
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name;
    this.uploaded_file_name = files.item(0).name;

    if(this.uploaded_file_name) {
      this.isLoading = true;
      const formData: FormData = new FormData();
      formData.append('resume', this.resumeFileToUpload);
      return this.http.post(this.uploadResumeUrl, formData, this.httpOptions).subscribe(
        data => this.handleSuccessUploadResume(data),
        error => this.handleError(error)
      );
    }
  }

  uploadFileToActivity() {
    this.isLoading = true;
    const formData: FormData = new FormData();
    formData.append('resume', this.resumeFileToUpload);
    return this.http.post(this.uploadResumeUrl, formData, this.httpOptions).subscribe(
      data => this.handleSuccessUploadResume(data),
      error => this.handleError(error)
    );
  }

  is_resume_parsed = false;
  handleSuccessUploadResume(data) {
    this.resume_uploaded = true;

    if(data.data.resume.is_parsed == true){
    this.form_data = data.data;
    this.is_resume_parsed = true;
    this.current_step = "basic_info";
    this.last_step = "basic_info";
    this.completed_steps = data.data.resume.completed_steps;

    this.imgURL = this.form_data.profile.meta.profilePictureFullUrl;
    this.form_data.resume.dob = this.inputFormatDate(this.form_data.resume.dob);
    //skills
    for (var key in this.form_data.resume.skills) {
      var obj = this.form_data.resume.skills[key];
      obj.display = obj.name;
      obj.value = obj.id;
      //this.sample_skills.push({ display: obj.name, value: obj.id, });
    }
    localStorage.setItem('resume_uploaded', 'true');
    
  }
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  getResume() {
    return this.http.get(this.profileUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.is_resume_parsed = data.data.resume.is_parsed;
    this.form_data = data.data;
    this.last_step = this.form_data.resume.last_step;
    this.completed_steps = data.data.resume.completed_steps;

    if(this.completed_steps){
    var a = this.completed_steps.indexOf("resume");
    if(a==-1)
      this.resume_uploaded = false;
    else
      this.resume_uploaded = true;
    
    if(a!=-1 && this.last_step=='resume'){
      this.resume_uploaded = true;
      this.last_step = '';
      this.current_step = 'basic_info';
    }
  }
  else{
    this.resume_uploaded = false;
  }

    if(this.form_data.resume.completed_setup == 1 || this.form_data.resume.last_step=='skills')
      this.router.navigateByUrl('/candidate/resume');

    if(this.form_data.resume.last_step=='basic_info')
      this.current_step = "about_me";

    if(this.form_data.resume.last_step=='about_me')
      this.current_step = "work_history";

    if(this.form_data.resume.last_step=='work_history')
      this.current_step = "education";

    if(this.form_data.resume.last_step=='education')
      this.current_step = "skills";
    
    this.imgURL = this.form_data.profile.meta.profilePictureFullUrl;
    this.form_data.resume.dob = this.inputFormatDate(this.form_data.resume.dob);

    //skills
    for (var key in this.form_data.resume.skills) {
      var obj = this.form_data.resume.skills[key];
      obj.display = obj.name;
      obj.value = obj.id;
      //this.sample_skills.push({ display: obj.name, value: obj.id, });
    }
    for (var key in this.form_data.resume.additional_skills) {
      var obj = this.form_data.resume.additional_skills[key];
      obj.display = obj.name;
      obj.value = obj.id;
      //this.sample_skills.push({ display: obj.name, value: obj.id, });
    }

    this.socialMedia = data.data.socialMedia;
    this.first_time_loading = false;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  skipResumeStep(){
    this.resume_uploaded = true;
    this.current_step = "basic_info";
    this.last_step = "basic_info";
    this.completed_steps = ['resume'];
  }

  skill_add_placeholder = "+ Add New";

  addExperience() {
    if (this.other_detail.id == "") {
      this.other_detail.vetran_status = 1;
      return this.http.post(this.experienceUrl + "/" + "create" + "/" + this.form_data.resume.id, this.other_detail, this.httpOptions).subscribe(
        data => this.handlePostExperienceSuccess(data),
        error => this.handlePostError(error)
      );
    }
    else {
      return this.http.post(this.experienceUrl + "/" + "update", this.other_detail, this.httpOptions).subscribe(
        data => this.handlePostWorkHistoryUpdateSuccess(data),
        error => this.handlePostError(error)
      );
    }


  }

  handlePostExperienceSuccess(data) {
    this.form_data.resume.experiences.unshift(data.data.other_detail);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  editSkills() {

  }

  checkBasicInfo(){
    if(this.resume_uploaded==true && this.is_resume_parsed==true) 
        this.current_step='basic_info';
  }

  checkAboutMe(){
    if(this.last_step=='basic_info' 
      || this.last_step=='about_me' 
      || this.last_step=='work_history' 
      || this.last_step=='education' 
      || this.last_step=='skills' ) 

        this.current_step='about_me';
  }

  checkWorkHistory(){
    if( this.last_step=='about_me' 
      || this.last_step=='work_history' 
      || this.last_step=='education' 
      || this.last_step=='skills' ) 

        this.current_step='work_history';
  }

  checkEducation(){
    if(  this.last_step=='work_history' 
      || this.last_step=='education' 
      || this.last_step=='skills' ) 

        this.current_step='education';
  }

  checkSkills(){
    if(  
       this.last_step=='education' 
      || this.last_step=='skills' ) 

        this.current_step='skills';
  }

  formatDate(date) {
		var d;
		if(typeof(date) === "string"){
			d = new Date(date);
		}else{
			d = date;
		}
	
		if(d instanceof Date){
			var month = '' + (d.getMonth() + 1);
			var day = '' + d.getDate();
			var year = d.getFullYear();
	
			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
	
			return [year, month, day].join('-');
		}else{
			return null;
		}
	}

	inputFormatDate(date) {
		var d;
		if(typeof(date) === "string"){
			d = new Date(date);
		}else{
			d = date;
		}
	
		if(d instanceof Date){
			var month = '' + (d.getMonth() + 1);
			var day = '' + d.getDate();
			var year = d.getFullYear();
	
			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
	
			return [month, day, year].join('/');
		}else{
			return null;
		}
	}

  saveSkills(auto_step=true) {
    var form_data = new FormData();

    for (var key in this.form_data.resume.skills) {
      var obj = this.form_data.resume.skills[key];
      if (obj.name || obj.display) {
        if (obj.id)
          form_data.append('skills[' + key + '][id]', obj.id);

        if (obj.name)
          form_data.append('skills[' + key + '][name]', obj.name);

        if (obj.display)
          form_data.append('skills[' + key + '][name]', obj.display);
      }
    }

    return this.http.post(this.skillsUrl+ "/" + this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostSaveSkillsSuccess(data, auto_step),
      error => this.handlePostError(error)
    );
  }

  saveAdditionalSkills(auto_step=true) {
    var form_data = new FormData();

    for (var key in this.form_data.resume.additional_skills) {
      var obj = this.form_data.resume.additional_skills[key];
      if (obj.name || obj.display) {
        if (obj.id)
          form_data.append('additional_skills[' + key + '][id]', obj.id);

        if (obj.name)
          form_data.append('additional_skills[' + key + '][name]', obj.name);

        if (obj.display)
          form_data.append('additional_skills[' + key + '][name]', obj.display);
      }
    }

    return this.http.post(this.additionalskillsUrl+ "/" + this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostSaveSkillsSuccess(data, auto_step),
      error => this.handlePostError(error)
    );
  }

  handlePostSaveSkillsSuccess(data, auto_step) {

    if(auto_step==false)
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });

    else
    {
      var form_data = new FormData();
      
        form_data.append('current_step', 'skills');

      return this.http.post(this.profileUrlSetup, form_data, this.httpOptions).subscribe(
        data => this.handlePostSkillStepSuccess(data),
        error => this.handlePostError(error)
      );
    }
    
  }

  handlePostSkillStepSuccess(data){
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.current_step = "skills";
    this.last_step = 'skills';
    this.isLoading = false;
    this.router.navigateByUrl('/candidate/resume');
  }

  

  nextStep(current_step, step){
    this.isLoading = true;
    
    var form_data = new FormData();
    if(this.last_step=="about_me" && current_step=="work_history")
      form_data.append('current_step', current_step);

    if(this.last_step=="work_history" && current_step=="education")
      form_data.append('current_step', current_step);

    if(this.last_step=="education" && current_step=="skills")
      form_data.append('current_step', current_step);

    return this.http.post(this.profileUrlSetup, form_data, this.httpOptions).subscribe(
      data => this.handlePostNextStepSuccess(data, current_step, step),
      error => this.handlePostError(error)
    );

    
  }

  handlePostNextStepSuccess(data, current_step, step) {
    this.isLoading = false;
    this.current_step = step;
    this.last_step = current_step;
  }

  saveContactInfo(){
    var form_data = new FormData();
    form_data.set('email', this.form_data.resume.email);
    form_data.set('mobile', this.form_data.profile.meta.mobile);
    form_data.set('home_phone', this.form_data.resume.home_phone);
    form_data.set('full_address', this.form_data.resume.full_address);
    this.saveResume__(form_data);
  }

  addReference() {
    if (this.reference.id == "") {
      return this.http.post(this.referenceUrl + "/" + "create" + "/" + this.form_data.resume.id,
        this.reference, this.httpOptions).subscribe(
          data => this.handlePostReferenceSuccess(data),
          error => this.handlePostError(error)
        );
    }
    else {
      return this.http.post(this.referenceUrl + "/" + "update", this.reference, this.httpOptions).subscribe(
        data => this.handlePostEducationUpdateSuccess(data),
        error => this.handlePostError(error)
      );
    }
  }

  handlePostReferenceSuccess(data) {
    this.form_data.resume.references.unshift(data.data.reference);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }


  addWorkHistory() {
    this.isLoading = true;
    //console.log(this.work_history);
    if (this.work_history.id == "") {
      return this.http.post(this.workHistoryUrl + "/" + "create" + "/" + this.form_data.resume.id, this.work_history, this.httpOptions).subscribe(
        data => this.handlePostWorkHistorySuccess(data),
        error => this.handlePostError(error)
      );
    }
    else {
      this.work_history.start_date = this.formatDate(this.work_history.start_date);
		  this.work_history.end_date = this.formatDate(this.work_history.end_date);
      return this.http.post(this.workHistoryUrl + "/" + "update", this.work_history, this.httpOptions).subscribe(
        data => this.handlePostWorkHistoryUpdateSuccess(data),
        error => this.handlePostError(error)
      );
    }
  }

  handlePostWorkHistorySuccess(data) {
    this.form_data.resume.employments.unshift(data.data.workHistory);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handlePostWorkHistoryUpdateSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  addEducation() {

    if (this.education.id == "") {
      return this.http.post(this.educationUrl + "/" + "create" + "/" + this.form_data.resume.id, this.education, this.httpOptions).subscribe(
        data => this.handlePostEducationSuccess(data),
        error => this.handlePostError(error)
      );
    }
    else {
      this.education.start_date = this.formatDate(this.education.start_date);
		  this.education.end_date = this.formatDate(this.education.end_date);
      return this.http.post(this.educationUrl + "/" + "update", this.education, this.httpOptions).subscribe(
        data => this.handlePostEducationUpdateSuccess(data),
        error => this.handlePostError(error)
      );
    }
  }

  handlePostEducationSuccess(data) {
    this.form_data.resume.educations.unshift(data.data.education);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handlePostEducationUpdateSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  addSocial() {
    if (this.social.id == "") {
      return this.http.post(this.socialMediaUrl + "/" + "create" + "/" + this.form_data.resume.id,
        this.social, this.httpOptions).subscribe(
          data => this.handlePostSocialSuccess(data),
          error => this.handlePostError(error)
        );
    }
    else {
      return this.http.post(this.socialMediaUrl + "/" + "update", this.social, this.httpOptions).subscribe(
        data => this.handlePostEducationUpdateSuccess(data),
        error => this.handlePostError(error)
      );
    }



  }

  handlePostSocialSuccess(data) {
    this.form_data.resume.social_media.unshift(data.data.socialMedia);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  resetSocial() {
    this.social = { id: '', title: '', url: '' };
  }

  resetWorkHistory() {
    this.work_history = { id: '', title: '', employer: '', start_date: '', end_date: '', description: '', sort_order: 0 };
  }

  resetReference() {
    this.reference = { id: '', name: '', title: '', employer: '', phone: '', email: '' };
  }

  resetExperience() {
    this.other_detail = { id: '', experience: '', industry: '', vetran_status: 0 };
  }

  resetEducation() {
    this.education = { id: '', degree_type: '', degree_direction: '', institute: '', start_date: '', end_date: '' };
  }

  saveResume__(form_data){
    return this.http.post(this.profileUrl+"/update/"+this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostSuccess(data),
      error => this.handlePostError(error)
    );
  }

  imgURL: any;
  imgURL2: any;
  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);

    var reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  handleFileUploadFirstTime(files: FileList) {
    this.fileToUpload = files.item(0);
    this.oldImageFirstTime = this.fileToUpload;
    this.custom_avator = true;
    this.id = -100;

    var reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL2 = reader.result; 
    }
  }

  toggleSelection(event) {
    if (event.target.checked == true)
      this.work_history.end_date = null;
  }

  handleDocumentUpload(files: FileList) {
    this.documentToUpload = files.item(0);
  }

  getAddress(place: object) {
		this.form_data.profile.meta.location = place['formatted_address'];
	}

  isNull(value){
    if(value==null || value=='null')
      return true;
    else
      return false;
  }
  
  saveBasicInfo() {
    this.isLoading = true;
    var form_data = new FormData();
    form_data.set('first_name', this.form_data.profile.first_name);
    form_data.set('last_name', this.form_data.profile.last_name);
    if(!this.isNull(this.form_data.profile.middle_name))
      form_data.set('middle_name', this.form_data.profile.middle_name);
    form_data.append('profile_picture', this.fileToUpload);
    form_data.set('title', this.form_data.resume.title);
    form_data.set('gender', this.form_data.resume.gender);

    if(!this.isNull(this.form_data.profile.meta.location))
      form_data.set('location', this.form_data.profile.meta.location);

    if(!this.isNull(this.form_data.profile.meta.mobile))
      form_data.set('mobile', this.form_data.profile.meta.mobile);

    if(this.form_data.resume.dob != null && this.form_data.resume.dob != 'null' && this.form_data.resume.dob != '')
    {
      form_data.set('dob', this.inputFormatDate(this.form_data.resume.dob));
    }
    else
    form_data.set('dob', '');
    
   

    return this.http.post(this.basicInfoUrl, form_data, this.httpOptions).subscribe(
      data => this.handlePostBasicInfoSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostBasicInfoSuccess(data) {
    
    this.form_data.profile.meta = data.data.user.meta;
    localStorage.setItem('full_name', this.form_data.profile.first_name + " " + this.form_data.profile.last_name);
    localStorage.setItem('profile_picture', this.form_data.profile.meta.profilePictureFullUrl);
    this.data.changeMessage(this.form_data.profile.first_name + " " + this.form_data.profile.last_name);
    this.data.changeProfilePicture(this.form_data.profile.meta.profilePictureFullUrl);
    
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.updateStepForBasicInfo();
   
    
  }

  updateStepForBasicInfo(){
    var form_data = new FormData();
    if(this.last_step=="resume" || this.last_step==null || this.last_step==''){
      form_data.append('current_step', 'basic_info');
      return this.http.post(this.profileUrlSetup, form_data, this.httpOptions).subscribe(
        data => this.handlePostUpdateStepSuccessForBasicInfo(),
        error => this.handlePostError(error)
      );
    }
    else
      this.handlePostUpdateStepSuccessForBasicInfo();
  }

  handlePostUpdateStepSuccessForBasicInfo(){
    this.last_step = "basic_info";
    this.current_step = "about_me";
    this.isLoading = false;
  }

  saveAboutMe(){
    this.isLoading = true;
    var form_data = new FormData();
    form_data.set('about_me', this.form_data.resume.about_me);
    if (form_data.get('about_me') == null || form_data.get('about_me') == 'null' || form_data.get('about_me') == '') {
      form_data.set('about_me', ' ');
    }

    

    return this.http.post(this.aboutMeUrl, form_data, this.httpOptions).subscribe(
      data => this.handlePostSaveAboutMeSuccess(data),
      error => this.handlePostError(error)
    );

    
  }

  handlePostSaveAboutMeSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.updateStepForAboutMe();
  }

  updateStepForAboutMe(){
    var form_data = new FormData();
    if(this.last_step=="basic_info"){
      form_data.append('current_step', 'about_me');
      return this.http.post(this.profileUrlSetup, form_data, this.httpOptions).subscribe(
        data => this.handlePostUpdateStepSuccessForAboutMe(),
        error => this.handlePostError(error)
      );
    }
    else
      this.handlePostUpdateStepSuccessForAboutMe();
  }

  handlePostUpdateStepSuccessForAboutMe(){
    this.current_step="work_history";
    this.last_step = "about_me";
    this.isLoading = false;
  }

  saveSalary(){
    var form_data = new FormData();
    if (this.form_data.resume.salary_amount != 'null')
      form_data.set('salary_amount', this.form_data.resume.salary_amount);

    if (this.form_data.resume.salary_type != 'null')
      form_data.set('salary_type', this.form_data.resume.salary_type);
    this.saveResume__(form_data);
  }

  saveWillingToWork(){
    var form_data = new FormData();
    form_data.set('willing_to_relocate', this.form_data.resume.willing_to_relocate.toString());
    this.saveResume__(form_data);
  }

  handlePostSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handlePostError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    console.log(error);
    this.isLoading = false;
  }

  editExperience(experience) {
    //alert(experience.experience);
    this.other_detail = experience;
    console.log(this.other_detail);
  }

  editReference(reference) {
    this.reference = reference;
  }

  editWorkHistory(work_history) {
    console.log(work_history);
    this.work_history = work_history;
    this.work_history.start_date = this.inputFormatDate(this.work_history.start_date);
		this.work_history.end_date = this.inputFormatDate(this.work_history.end_date);
  }

  editEducation(education) {
    this.education = education;
    this.education.start_date = this.inputFormatDate(this.education.start_date);
		this.education.end_date = this.inputFormatDate(this.education.end_date);
  }

  editSocial(social) {
    this.social = social;
  }

  deleteSocial(id, social) {
    var answer = confirm('Are you sure you want to delete this social media icon?');
    if (answer) {
      social.deleted = true;
      for (let i = 0; i < this.form_data.resume.social_media.length; ++i) {
        if (this.form_data.resume.social_media[i].id === id) {

          return this.http.post(this.socialMediaUrl + "/" + "delete", { id: id, cv_id: this.form_data.resume.id }, this.httpOptions)
            .subscribe(
              data => this.handleDeleteSocialSuccess(data, i),
              error => this.handlePostError(error)
            );



        }
      }
    }
  }

  handleDeleteSocialSuccess(data, index) {
    this.form_data.resume.social_media.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  deleteWorkHistory(id, work_history) {
    var answer = confirm('Are you sure you want to delete this work history?');
    if (answer) {
      work_history.deleted = true;
      for (let i = 0; i < this.form_data.resume.employments.length; ++i) {
        if (this.form_data.resume.employments[i].id === id) {

          return this.http.post(this.workHistoryUrl + "/" + "delete", { id: id, cv_id: this.form_data.resume.id }, this.httpOptions)
            .subscribe(
              data => this.handleDeleteWorkHistorySuccess(data, i),
              error => this.handlePostError(error)
            );

        }
      }
    }
  }

  handleDeleteWorkHistorySuccess(data, index) {
    this.form_data.resume.employments.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  deleteEducation(id, education) {
    var answer = confirm('Are you sure you want to delete this education?');
    if (answer) {
      education.deleted = true;
      for (let i = 0; i < this.form_data.resume.educations.length; ++i) {
        if (this.form_data.resume.educations[i].id === id) {

          return this.http.post(this.educationUrl + "/" + "delete", { id: id, cv_id: this.form_data.resume.id }, this.httpOptions)
            .subscribe(
              data => this.handleDeleteEducationSuccess(data, i),
              error => this.handlePostError(error)
            );

        }
      }
    }
  }

  handleDeleteEducationSuccess(data, index) {
    this.form_data.resume.educations.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  deleteExperience(id, experience) {
    var answer = confirm('Are you sure you want to delete this education?');
    if (answer) {
      experience.deleted = true;
      for (let i = 0; i < this.form_data.resume.experiences.length; ++i) {
        if (this.form_data.resume.experiences[i].id === id) {

          return this.http.post(this.experienceUrl + "/" + "delete", { id: id, cv_id: this.form_data.resume.id }, this.httpOptions)
            .subscribe(
              data => this.handleDeleteExperienceSuccess(data, i),
              error => this.handlePostError(error)
            );



        }
      }
    }
  }

  handleDeleteExperienceSuccess(data, index) {
    this.form_data.resume.experiences.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  deleteReference(id, reference) {
    var answer = confirm('Are you sure you want to delete this reference?');
    if (answer) {
      reference.deleted = true;
      for (let i = 0; i < this.form_data.resume.references.length; ++i) {
        if (this.form_data.resume.references[i].id === id) {

          return this.http.post(this.referenceUrl + "/" + "delete", { id: id, cv_id: this.form_data.resume.id }, this.httpOptions)
            .subscribe(
              data => this.handleDeleteReferenceSuccess(data, i),
              error => this.handlePostError(error)
            );



        }
      }
    }
  }

  handleDeleteReferenceSuccess(data, index) {
    this.form_data.resume.references.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  deleteDocument(id, document) {
    var answer = confirm('Are you sure you want to delete this document?');
    if (answer) {
      document.deleted = true;
      for (let i = 0; i < this.form_data.resume.documents.length; ++i) {
        if (this.form_data.resume.documents[i].id === id) {

          return this.http.get(this.profileUrl + "/" + "delete-document" + "/" + id, this.httpOptions)
            .subscribe(
              data => this.handleDeleteDocumentSuccess(data, i),
              error => this.handlePostError(error)
            );

        }
      }
    }
  }

  handleDeleteDocumentSuccess(data, index) {
    this.form_data.resume.documents.splice(index, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    console.log(data);
  }

  isValidDate(dateString) {

    if (dateString == null) {
      return null
    }
    else
      return true;
    //var regEx = /^\d{4}-\d{2}-\d{2}$/;
    //return dateString.match(regEx) != null; test; 
  }

}