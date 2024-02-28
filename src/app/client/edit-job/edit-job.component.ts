import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgForm} from '@angular/forms';
import { ErrorService } from 'src/Services/shared/error.service';
import { JobService } from 'src/Services/vendor/job.service';
import { ClientJobService } from 'src/Services/client/job.service';
import { HelperUtilityService } from 'src/app/helper-utility.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {
  
  title  = 'Edit Job - ';
  placeholder="";

  default_dropdownList = [];
	dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};

  f: NgForm
	isLoading = false;
	job_types = [];
	pay_types = [];
	categories = [];
	currencies = [];
	skills = [];
	//other_skills = [];
	departments = [];
	cost_center_codes = [];
	billing_codes = [];
	hiring_managers = [];
	programs = [];
	experiences = [];
	fileToUpload: File = null;
	benefits = [];
	custom_fields = [];
	locations = [];
	locations_default = [];

  	job = {
		title:'',
		description: '',
		address: '',
		location_id: null,
		job_type: 'Direct Hire',
		currency:'USD',
	  	category_id: '',
	  	zipcode: null,
	  	skills:[],
	  	veteran_status:null,
	  //other_skills:[],
	  openings:null,
	  experience: '',
	  descriptions: [''],
		department_id: '',
		costcenter_id: '',
		billing_code_id: '',
		hiring_manager: {
			id: null
		},
		program_id: '',
		workflow_id: '',
		salary:null,
		min_rate:null,
		max_rate:null,
		pay_type:'',
	  salary_type: '',
		start_date:null,
		tentative_end_date:null,
		additional_detail:null,
	  reason_for_hire:'',
	  publish_to_supplier:null,
	  publish_to_portals:null,
	  broadbean: true,
	  zip_recruiter: false,
	  dice: false,
	  indeed: false,
	  career_builder: false,
	  portals: [],
	  is_published: 1,
	  benefits : []
	}; 
	
	id: number;
	private sub: any;
	keyword = 'name';
	dataTitles = [];

	jobCreateUrl = environment.baseApiUrlClient+"/client/jobs/create";
	job_post_url = environment.baseApiUrlClient+'/client/jobs/';
	get_skills_url = environment.baseApiUrlClient + '/client/jobs/skills';
	private matchTitlesUrl = environment.baseApiUrlClient + "/client/jobs/match-titles";

	exampleData = [];
	exampleData2 = [];
	options = {
		multiple: true
	}
	save_job_text = "Update Job";
  	publish_job_text = "Publish as Job";
  	uploaded_file_name: string;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private _ErrorService: ErrorService,
		private router: Router,
		private _helper: HelperUtilityService,
		private _JobService: JobService) { }

    private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };
    private formBuilder: FormBuilder
    

  ngOnInit() {

	this.dropdownSettings = {
		singleSelection: false,
		idField: 'id',
		textField: 'name',
		enableCheckAll: false,
		itemsShowLimit: 7,
		allowSearchFilter: true
	  };

		this.getJob();

		 this.http.get(this.jobCreateUrl, this.httpOptions ).subscribe(
			data  => this.handleSuccessCreate(data),
			error => this.handleError(error)
		); 
	}

	getJob(){
		this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._JobService.getClientJob(this.id)
      .subscribe( 
        data => this.handleJobGetSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });
	}

	focusOutFunction(){
		//alert(this.job.descriptions[0]);
		return this.http.post(this.get_skills_url, { description: this.job.description } , this.httpOptions ).subscribe(
			data =>this.handleSuccessGetSkills(data),
			error => this.handleErrorGetSkills(error)
		);
	}

	handleSuccessGetSkills(data){
		this.job.skills = data.data.skills;
	}

	handleErrorGetSkills(error){

	}

	getAddress(place: object) {
    	this.job.address = place['formatted_address'];
  }

  inputFormatDate(date) {
	var d;
	if (typeof (date) === "string") {
		d = new Date(date);
	} else {
		d = date;
	}

	if (d instanceof Date) {
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();
		var year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [month, day, year].join('/');
	} else {
		return null;
	}
}

demo_title = "xx";
	handleJobGetSuccess(data){
		//this.handleSuccessCreate(data);
		this.job = data.data.job;
		this.demo_title = this.job.title;
		console.log(this.demo_title);
		this.title = 'Edit Job - '+this.job.title+' [ '+this.job.job_type+' ]';
		
		this.job.start_date = this.inputFormatDate(this.job.start_date);
		this.job.tentative_end_date = this.inputFormatDate(this.job.tentative_end_date);
		if(this.job.hiring_manager != null)
			this.job.hiring_manager = this.job.hiring_manager.id;

		
		
		this.uploaded_file_name = data.data.job.description_document;
		
		
		this.job.descriptions = data.data.descriptions;

		this.custom_fields = data.data.customFields;
		for ( var key in this.custom_fields ) {
			var obj = this.custom_fields[key];
			//console.log(obj);
			if(obj.pivot)
				obj.answer = obj.pivot.value;
			else
				obj.answer = obj.default_value;

			 if(obj.type=='date')
        		obj.answer = this.inputFormatDate(obj.answer);	
		  }

		  for ( var key in this.job.portals ) {
			var obj = this.job.portals[key];
			 if(obj.portal == 'broadbean')
				this.job.broadbean = true;	
				
			if(obj.portal == 'dice')
				this.job.dice = true;	

			if(obj.portal == 'indeed')
				this.job.indeed = true;	
				
			if(obj.portal == 'career_builder')
				this.job.career_builder = true;	
				
			if(obj.portal == 'zip_recruiter')
        		this.job.zip_recruiter = true;	
		  }

		//console.log(this.job);
	}

	addDescription(){
		this.job.descriptions.push('');
	}

	trackByIndex(index: number, obj: any): any {
    return index;
	}
	
	
	
	handleSuccessCreate(data){
		this.job_types = data.data.job_types;
		this.currencies = this._helper.convertToSelect2(data.data.currencies);
		this.pay_types = this._helper.convertToSelect2(data.data.pay_types);
		this.categories = this._helper.convertToSelect2(data.data.categories);
		this.locations_default = data.data.locations;
		this.locations = this._helper.convertToSelect2(data.data.locations, 'location', 'location');

		//this.skills = data.data.skills;
		for (var key in data.data.skills) {
			var obj = data.data.skills[key];
			this.dropdownList.push({
				id: obj.id,
				name: obj.name
			});
		}
		this.skills = this.dropdownList;
		this.default_dropdownList = this.dropdownList;
		this.benefits = data.data.benefits;
		for ( var key in data.data.benefits ) {
			var obj = data.data.benefits[key];
			var benefit = this.job.benefits.find(x => x.id === obj.id);
			if(benefit)
				obj.checked = true;
		}

		this.departments = this._helper.convertToSelect2(data.data.departments, 'id', ':name ( :code )');
		this.cost_center_codes = this._helper.convertToSelect2(data.data.cost_center_codes, 'id', ':name ( :cost_code )');
		this.billing_codes = this._helper.convertToSelect2(data.data.billing_codes, 'id', ':name ( :code )');
		this.hiring_managers = this._helper.convertToSelect2(data.data.hiring_managers, 'id', ':first_name  :last_name');
		this.programs = this._helper.convertToSelect2(data.data.programs);
		this.experiences = data.data.experience_levels;
	}

	
	msg_array = [];
	form_type = 'job';
	
   onSubmit(f){

	this.msg_array = [];

		if( this.job.title == '')
    {
      this.msg_array.push('Job Title is required.');
	}
	
	if( this.job.category_id == '')
    {
      this.msg_array.push('Job Category is required.');
	}

	if( this.job.address == '' || this.job.address == null)
    {
      this.msg_array.push('Job Location is required.');
	}

	if( this.job.job_type == 'Full Time' && this.job.salary=='')
    {
      this.msg_array.push('Job Salary is required.');
	}

	if( this.job.job_type == 'Temp Hire' && ( this.job.min_rate == '' || this.job.max_rate == '' ))
    {
      this.msg_array.push('Job Min & Max Rate is required.');
	}
	
	if( this.job.tentative_end_date == '' && this.job.job_type=='Temp Hire')
    {
      this.msg_array.push('Job End Date is required.');
	}

		if( ( (this.formatDate(this.job.tentative_end_date) < this.formatDate(this.job.start_date)) && this.job.tentative_end_date != '' ) && this.job.job_type=='Temp Hire' )
		{
			this.msg_array.push('End date cannot be earlier than start date.');
		}

		if(this.msg_array.length>0)
    {
      
      var msg = {
      data: [],
      msg: this.msg_array,
      messages: []
      };

      this._ErrorService.flashMessage({ 'type': 'error', 'messages': msg });
      return true;
    }

		
	if(this.form_type=='draft')
	this.onPublish();
else{
	   this.isLoading = true;
	   this.save_job_text = "Updating..."
	   let formData = new FormData();
	   if( this.job.address !='' && this.job.address != null ){
			var location = this.locations_default.find(x => x.id === this.job.address);
			if(location!=null)
				this.job.location_id = location.id;
	   }

	   for (var key in this.job) {
		   formData.append(key, this.job[key]);
	   }
	   formData.set('start_date', this.formatDate(this.job.start_date));
	   formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));
	   if(this.fileToUpload){
	   	formData.append('description_document', this.fileToUpload);
	   }

	   for (var key in this.job.skills) {
		   var obj = this.job.skills[key];

		   if (obj) {
			   formData.append('skills[]', obj.id);
		   }
	   }

	   //benefits
		for (var key in this.benefits) {
			var obj = this.benefits[key];
			if(obj.checked==true)
				formData.append("benefits[]", obj.id);
		}

		var custom_fields = [];
		var x=0;
		for ( var key in this.custom_fields ) {
			var obj = this.custom_fields[key];
			//console.log(obj);
			//custom_fields.push({'id' : obj.id, 'value': obj.answer });
			formData.append('custom_fields['+x+'][id]', obj.id);
			 if(obj.type=='date')
			 	formData.append('custom_fields['+x+'][value]', this.formatDate(obj.answer));
			 else
				formData.append('custom_fields['+x+'][value]', obj.answer);
			x++;
		  }


		  //formData.delete('customFields');

   	return this.http.post(this.job_post_url+this.id+"/edit", formData , this.httpOptions ).subscribe(
	   	  data =>this.handleSuccess(data),
	   	  error => this.handleError(error)
	   	);
	   }
	}

	formatDate(date) {
		var d;
		if (typeof (date) === "string") {
			d = new Date(date);
		} else {
			d = date;
		}

		if (d instanceof Date) {
			var month = '' + (d.getMonth() + 1);
			var day = '' + d.getDate();
			var year = d.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');
		} else {
			return null;
		}
	}


	handleSuccess(data){
	 
	  this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
	  //this.reserFormJobData();
		this.isLoading = false;
		this.router.navigateByUrl('/client/jobs', data.msg.msg);
	}

	handleError(error){
	 	 console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.save_job_text = "Update Job";
	  this.publish_job_text = "Publish";
	  this.isLoading = false;
	}

	selectEvent(event, item) {
		// do something with selected item
		console.log(item);
		this.job.title = item.name;
		//console.log("job title => "+this.job.title);
	  }
	
	  onChangeSearch(search: string) {
		// fetch remote data from here
		// And reassign the 'data' which is binded to 'data' property.
		return this.http.get(this.matchTitlesUrl+"?title="+search, this.httpOptions).subscribe(
			data => this.handleSuccessMatchTitles(data),
			error => this.handleError(error)
		);
	  }

	  handleSuccessMatchTitles(data) {
				this.dataTitles = [];
				console.log(data.data);
				for (var key in data.data.titles) {
					var obj = data.data.titles[key];
					console.log(obj);
					this.dataTitles.push({
						id: 1,
						name: obj
					});
				}
				
				
		
			 }
	
	  onFocused(e) {
		// do something
	  }

	onPublish(){
	   this.isLoading = true;
	   this.publish_job_text = "Publishing..."
	   let formData = new FormData();
	   if( this.job.address !='' && this.job.address != null ){
	   var location = this.locations_default.find(x => x.location === this.job.address);
	   if(location!=null)
			this.job.location_id = location.id;
	   }

	   for (var key in this.job) {
		   formData.append(key, this.job[key]);
	   }
	   formData.set('start_date', this.formatDate(this.job.start_date));
	   formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));
	   formData.set('is_published', '1');

	   for (var key in this.job.skills) {
		   var obj = this.job.skills[key];

		   if (obj) {
			   formData.append('skills[]', obj);
		   }
	   }
	   if(this.fileToUpload){
	   	formData.append('description_document', this.fileToUpload);
	   }

	   if (this.job.publish_to_supplier == true)
			formData.set('publish_to_supplier', '1');
		else
			formData.set('publish_to_supplier', '0');

		if (this.job.publish_to_portals == true)
			formData.set('publish_to_portals', '1');
		else
			formData.set('publish_to_portals', '0');

			if (this.job.broadbean == true)
			formData.set('broadbean', '1');
		else
			formData.set('broadbean', '0');

		if (this.job.zip_recruiter == true)
			formData.set('zip_recruiter', '1');
		else
			formData.set('zip_recruiter', '0');

		if (this.job.dice == true)
			formData.set('dice', '1');
		else
			formData.set('dice', '0');

		if (this.job.indeed == true)
			formData.set('indeed', '1');
		else
			formData.set('indeed', '0');

		if (this.job.career_builder == true)
			formData.set('career_builder', '1');
		else
			formData.set('career_builder', '0');

	   this.http.post(this.job_post_url+this.id+"/edit", formData , this.httpOptions ).subscribe(
	   	  data =>this.handleSuccess(data),
	   	  error => this.handleError(error)
	   	);
	}
	handleFileUpload(files: FileList) {
		this.fileToUpload = files.item(0);
		this.uploaded_file_name = files.item(0).name; 
	}

	FieldsChange(values:any){
		if(values.currentTarget.checked==false)
			{
				//this.job.broadbean = false;
				this.job.zip_recruiter = false;
				this.job.dice = false;
				this.job.indeed = false;
				this.job.career_builder = false;
			}
		console.log(values.currentTarget.checked);
		}

		BroadbeanChange(values:any){
			if(values.currentTarget.checked==false)
				{
					this.job.dice = false;
					this.job.career_builder = false;
				}
			
			}

			onItemSelect(item: any) {
				console.log(item);
			  }
			  onSelectAll(items: any) {
				console.log(items);
			  }
		
			  onFilterChange(event){
				if(event.length>2){
					this.http.get(environment.baseApiUrlClient + "/client/skills/"+event).subscribe(
						data => this.handleSuccessMatchSkills(data),
						error => this.handleError(error)
					);
				}
		
				if(event.length==0){
					this.skills = this.default_dropdownList;
				}
		
			  }
		
			  handleSuccessMatchSkills(data) {
				//this.skills = data.data.skills;
				this.dropdownList = [];
				for (var key in data.data.skills) {
					var obj = data.data.skills[key];
					this.dropdownList.push({
						id: obj.id,
						name: obj.name
					});
				}
				if(data.data.skills.length>0)
					this.skills = this.dropdownList;
				
				
		
			 }

}
