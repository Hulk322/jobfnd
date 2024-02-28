import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { ViewChild } from '@angular/core';
import { DataService } from "src/app/data.service";
import { JobsService } from 'src/Services/candidate/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery:any;

@Component({
  selector: 'app-completed-resume',
  templateUrl: './completed-resume.component.html',
  styleUrls: ['./completed-resume.component.css']
})
export class CompletedResumeComponent implements OnInit {
  
  profileUrl = environment.baseApiUrl + "/candidate/profile/resume";
  pictureUrl = environment.baseApiUrl + "/candidate/profile/picture";
  baseUrl = environment.baseApiUrl.replace('/api/v1', '');
  workHistoryUrl = environment.baseApiUrl + "/candidate/profile/resume/work-history";
  educationUrl = environment.baseApiUrl + "/candidate/profile/resume/education";
  experienceUrl = environment.baseApiUrl + "/candidate/profile/resume/other-details";
  referenceUrl = environment.baseApiUrl + "/candidate/profile/resume/reference";
  socialMediaUrl = environment.baseApiUrl + "/candidate/profile/resume/social-media";
  skillsUrl = environment.baseApiUrl + "/candidate/profile/resume/skills/update";
  additionalskillsUrl = environment.baseApiUrl + "/candidate/profile/resume/additional-skills/update";
  fileToUpload: File = null;
  documentToUpload: File = null;
  newActionCount = 0;
  isLoading = false;
  salaryPattern = "^[0-9]+$"

  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
  @ViewChild('completeSocialModal', { static: true }) completeSocialModal: ElementRef;
  @ViewChild('completeworkhistoryModal', { static: true }) completeworkhistoryModal: ElementRef;
  @ViewChild('completeEducationModal', { static: true }) completeEducationModal: ElementRef;
  @ViewChild('completeReferenceModal', { static: true }) completeReferenceModal: ElementRef;
  @ViewChild('completeDocumentModal', { static: true }) completeDocumentModal: ElementRef;
  @ViewChild('completesaveAboutModal', { static: true }) completesaveAboutModal: ElementRef;
  @ViewChild('completesaveContactInfoModal', { static: true }) completesaveContactInfoModal: ElementRef;
  @ViewChild('completesaveSalaryModal', { static: true }) completesaveSalaryModal: ElementRef;
  @ViewChild('completeExperienceModal', { static: true }) completeExperienceModal: ElementRef;
  @ViewChild('completesaveBasicInfoModal', { static: true }) completesaveBasicInfoModal: ElementRef;

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private http: HttpClient,
    private _ErrorService: ErrorService,
    private _JobService: JobsService,
    private router: Router,
    private data: DataService) { }

    job = {
      id: null,
      title:null,
      description:null,
      slug:null
    }

  public form_data = {
    profile: {
      first_name: null,
      last_name: null,
      email: null,
      meta: {
        profile_picture: null,
        profilePictureFullUrl: ''
      }
    },
    profileCompleteness: {
      score:0
    },
    resume: {
      id: null,
      path: '',
      about_me: '',
      gender: null,
      email: '',
      salary_amount: null,
      salary_type: null,
      mobile: '',
      title: '',
      dob: '',
      home_phone: '',
      full_address: '',
      willing_to_relocate: 0,
      educations: [],
      employments: [],
      experiences: [],
      references: [],
      skills: [],
      additional_skills: [],
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
    this.job.id = localStorage.getItem("job_id");
    this.job.title = localStorage.getItem("job_title");
    this.job.description = localStorage.getItem("job_description");
    this.job.slug = localStorage.getItem("job_slug");
    this.getResume();
  }

  oneClickApplyToJob(jobSlug){

    this.router.navigate(['/candidate/job-questions/'+jobSlug]);

    /*this._JobService.applyToJob(job_id)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );*/

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
    this.isLoading = true;
    var form_data = new FormData();

    form_data.set('title', this.document.title);

    form_data.append('document', this.documentToUpload);

    return this.http.post(this.profileUrl + "/" + "upload-document", form_data, this.httpOptions).subscribe(
      data => this.handlePostDocumentSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostDocumentSuccess(data) {
    jQuery(this.completeDocumentModal.nativeElement).modal('hide'); 
    this.form_data.resume.documents.unshift(data.data.document);
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
    //if(data.data.resume.completed_setup==0)
      //this.router.navigateByUrl('/candidate/profile');

    this.form_data = data.data;

    this.form_data.resume.dob = this.inputFormatDate(this.form_data.resume.dob);

    this.form_data.resume.employments.length==0 ? this.newActionCount++ : '';
    this.form_data.resume.educations.length==0 ? this.newActionCount++ : '';
    (this.form_data.resume.title==null || this.form_data.resume.title=='') ? this.newActionCount++ : '';
    (this.form_data.resume.about_me==null || this.form_data.resume.about_me=='') ? this.newActionCount++ : '';
    
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
    console.log(this.form_data.resume.skills);

    this.socialMedia = data.data.socialMedia;
    this.isLoading = false;
    //console.log(data);
  }

  handleError(error) {
    //console.log(error);
  }

  addExperience() {
    this.isLoading = true;
    if (this.other_detail.id == "") {
      this.other_detail.vetran_status = 1;
      return this.http.post(this.experienceUrl + "/" + "create" + "/" + this.form_data.resume.id, this.other_detail, this.httpOptions).subscribe(
        data => this.handlePostExperienceSuccess(data),
        error => this.handlePostError(error)
      );
    }
    else {
      return this.http.post(this.experienceUrl + "/" + "update", this.other_detail, this.httpOptions).subscribe(
        data => this.handleUpdateExperienceSuccess(data),
        error => this.handlePostError(error)
      );
    }


  }

  handlePostExperienceSuccess(data) {
    jQuery(this.completeExperienceModal.nativeElement).modal('hide'); 
    this.form_data.resume.experiences.unshift(data.data.other_detail);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleUpdateExperienceSuccess(data) {
    jQuery(this.completeExperienceModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  editSkills() {

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

  saveSkills() {
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
      data => this.handlePostSuccess(data),
      error => this.handlePostError(error)
    );
  }

  // Additional Skill
  saveAdditionalSkills() {
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
      data => this.handlePostSuccess(data),
      error => this.handlePostError(error)
    );
  }

  showControls(form: any){
    let formDate =  (form && form.controls['about_me'] &&
    form.controls['about_me'].value) || (form && form.controls['title'] &&
    form.controls['title'].value)
  }

  saveAboutMe(){
    this.isLoading = true;
    var form_data = new FormData();
    form_data.set('about_me', this.form_data.resume.about_me);
    if (form_data.get('about_me') == null || form_data.get('about_me') == 'null' || form_data.get('about_me') == '') {
      form_data.set('about_me', ' ');
    }
    // this.saveResume__(form_data);
    return this.http.post(this.profileUrl+"/update/"+this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostsaveAboutMeSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostsaveAboutMeSuccess(data) {
    jQuery(this.completesaveAboutModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  saveContactInfo(){
    this.isLoading = true;
    var form_data = new FormData();
    //form_data.set('email', this.form_data.resume.email);
    form_data.set('mobile', this.form_data.resume.mobile);
    form_data.set('home_phone', this.form_data.resume.home_phone);
    form_data.set('full_address', this.form_data.resume.full_address);
    // this.saveResume__(form_data);
    return this.http.post(this.profileUrl+"/update/"+this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostsaveContactInfoSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostsaveContactInfoSuccess(data) {
    jQuery(this.completesaveContactInfoModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  skill_add_placeholder = "+ Add New";
  onTextChange($event){
    alert(1);
  }

  addReference() {
    this.isLoading =  true;
    if (this.reference.id == "") {
      return this.http.post(this.referenceUrl + "/" + "create" + "/" + this.form_data.resume.id,
        this.reference, this.httpOptions).subscribe(
          data => this.handlePostReferenceSuccess(data),
          error => this.handlePostError(error)
        );
    }
    else {
      return this.http.post(this.referenceUrl + "/" + "update", this.reference, this.httpOptions).subscribe(
        data => this.handleUpdateReferenceSuccess(data),
        error => this.handlePostError(error)
      );
    }
  }

  handlePostReferenceSuccess(data) {
    jQuery(this.completeReferenceModal.nativeElement).modal('hide'); 
    this.form_data.resume.references.unshift(data.data.reference);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleUpdateReferenceSuccess(data) {
    jQuery(this.completeReferenceModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }



  addWorkHistory() {
    this.isLoading = true;
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
    jQuery(this.completeworkhistoryModal.nativeElement).modal('hide'); 
    this.form_data.resume.employments.unshift(data.data.workHistory);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handlePostWorkHistoryUpdateSuccess(data) {
    jQuery(this.completeworkhistoryModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  addEducation() {
    this.isLoading = true;
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
    jQuery(this.completeEducationModal.nativeElement).modal('hide'); 
    this.form_data.resume.educations.unshift(data.data.education);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handlePostEducationUpdateSuccess(data) {
    jQuery(this.completeEducationModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  addSocial() {
    this.isLoading = true;
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
    jQuery(this.completeSocialModal.nativeElement).modal('hide'); 
    this.form_data.resume.social_media.unshift(data.data.socialMedia);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
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

  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  end_date_disabled = false;
  today;
  toggleSelection(event) {
    if (event.target.checked == true){
      this.end_date_disabled = true;
      //this.today=new Date();
      this.work_history.end_date = null;
    }
    else
      this.end_date_disabled = false;
  }

  handleDocumentUpload(files: FileList) {
    this.documentToUpload = files.item(0);
  }

  saveBasicInfo() {
    this.isLoading = true;
    var form_data = new FormData();
    form_data.set('first_name', this.form_data.profile.first_name);
    form_data.set('last_name', this.form_data.profile.last_name);
    form_data.append('profile_picture', this.fileToUpload);

    return this.http.post(this.pictureUrl, form_data, this.httpOptions).subscribe(
      data => this.handlePostBasicInfoSuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostBasicInfoSuccess(data) {
    this.form_data.profile.meta = data.data.user.meta;
    var form_data = new FormData();
    form_data.set('title', this.form_data.resume.title);
    form_data.set('gender', this.form_data.resume.gender);

    if(this.form_data.resume.dob != null && this.form_data.resume.dob != 'null' && this.form_data.resume.dob != '')
    {
      form_data.set('dob', this.inputFormatDate(this.form_data.resume.dob));
    }
    else
    form_data.set('dob', '');
    
    return this.http.post(this.profileUrl+"/update/"+this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostSuccessForProfileData(data),
      error => this.handlePostError(error)
    );
    this.isLoading = false;
    //this.saveResume__(form_data);
  }

  handlePostSuccessForProfileData(data) {
    jQuery(this.completesaveBasicInfoModal.nativeElement).modal('hide'); 
    localStorage.setItem('full_name', this.form_data.profile.first_name + " " + this.form_data.profile.last_name);
    localStorage.setItem('profile_picture', this.form_data.profile.meta.profilePictureFullUrl);
    this.data.changeMessage(this.form_data.profile.first_name + " " + this.form_data.profile.last_name);
    this.data.changeProfilePicture(this.form_data.profile.meta.profilePictureFullUrl);
    
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  saveSalary(){
    this.isLoading = true;
    var form_data = new FormData();
    if (this.form_data.resume.salary_amount != 'null')
      form_data.set('salary_amount', this.form_data.resume.salary_amount);

    if (this.form_data.resume.salary_type != 'null')
      form_data.set('salary_type', this.form_data.resume.salary_type);
    return this.http.post(this.profileUrl+"/update/"+this.form_data.resume.id, form_data, this.httpOptions).subscribe(
      data => this.handlePostsaveSalarySuccess(data),
      error => this.handlePostError(error)
    );
  }

  handlePostsaveSalarySuccess(data) {
    jQuery(this.completesaveSalaryModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }
  saveWillingToWork(){
    this.isLoading = true;
    var form_data = new FormData();
    form_data.set('willing_to_relocate', this.form_data.resume.willing_to_relocate.toString());
    this.saveResume__(form_data);
  }

  handlePostSuccess(data) {
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handlePostError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
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
    //return dateString.match(regEx) != null;
  }

  isPdf(path){
    let index = path.indexOf(".pdf");
    if(index==-1) {
      return  false;
    }
    return true;
  }
}
