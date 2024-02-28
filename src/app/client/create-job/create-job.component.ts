import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ErrorService } from 'src/Services/shared/error.service';
import { ClientJobService } from 'src/Services/client/job.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { HelperUtilityService } from 'src/app/helper-utility.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
	selector: 'app-create-job',
	templateUrl: './create-job.component.html',
	styleUrls: ['./create-job.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class CreateJobComponent implements OnInit {

	@ViewChild('auto', { static: true }) auto: ElementRef;

	default_dropdownList = [];
	dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};

	f: NgForm
	isLoading = false;
	logged_user_id;
	job_types = [];
	pay_types = [];
	currencies = [];
	categories = [];
	skills = [];
	other_skills = [];
	departments = [];
	cost_center_codes = [];
	billing_codes = [];
	hiring_managers = [];
	programs = [];
	experiences = [];
	benefits = [];
	custom_fields = [];

	fileToUpload: File = null;
	step1_done = true;
	create_from_type = "template";
	templates = [];
	private templatesUrl = environment.baseApiUrlClient + "/client/jobs/template";
	private matchTitlesUrl = environment.baseApiUrlClient + "/client/jobs-template/match-titles";
	save_draft_text = "Save to Drafts";
	save_template_text = "Save to Template";
	publish_job_text = "Publish Job";
	placeholder="Choose Location"; 

	business_setup: {
		default_currency: '',
		business_category: ''
	};

	locations = [];
	locations_default = [];

	job = {
		title: '',
		job_type: 'Full Time',
		category_id: null,
		zipcode: null,
		skills: [],
		veteran_status: null,
		other_skills: [],
		openings: 1,
		experience: '',
		description: '',
		address: '',
		location_id: null,
		is_published: 1,
		department_id: '',
		costcenter_id: '',
		billing_code_id: '',
		hiring_manager: '',
		program_id: '',
		workflow_id: '',
		salary: '',
		min_rate: '',
		max_rate: '',
		currency: 'USD',
		salary_type: '',
		pay_type: '',
		start_date: null,
		tentative_end_date: null,
		additional_detail: null,
		reason_for_hire: null,
		publish_to_supplier: true,
		publish_to_portals: true,
		broadbean: true,
		zip_recruiter: false,
		dice: false,
		indeed: false,
		career_builder: false,
		benefits : []
	};

	
	exampleData2 = [];

	options = {
		multiple: true
	}

	job_id: any;
	 uploaded_file_name: string; 

	 keyword = 'name';
	 dataTitles = [];
	 


	jobCreateUrl = environment.baseApiUrlClient + "/client/jobs/create";
	job_post_url = environment.baseApiUrlClient + '/client/jobs/create';
	template_post_url = environment.baseApiUrlClient + '/client/jobs/template';
	get_skills_url = environment.baseApiUrlClient + '/client/jobs/skills';


	constructor(private route: ActivatedRoute,
		private http: HttpClient,
		private _ErrorService: ErrorService,
		private _JobService: ClientJobService,
		private confirmationDialogService: ConfirmationDialogService,
		private _helper: HelperUtilityService,
		private router: Router) { }

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

		this.logged_user_id = localStorage.getItem("id");
		this.nextStep();
		/*return this.http.get(this.templatesUrl, this.httpOptions).subscribe(
			data => this.handleSuccessTemplates(data),
			error => this.handleError(error)
		);*/

	}

	public openConfirmationDialog(item) {
		//alert(this.job.description);
		if( this.job.description.trim() =='' )
			this.getTemplate(item.id);
		else
			this.confirmationDialogService.confirm('Please confirm..', 'Do you want to load this Job Template?')
		.then((confirmed) =>  this.showTemplate(confirmed, item) )
		.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
	  }

	  showTemplate(confirmed, item){
		if (confirmed==true) 
			this.getTemplate(item.id);
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

	selectEvent(item) {
		// do something with selected item
		console.log(item);
		
		this.job.title = item.name;

		this.openConfirmationDialog(item);

		/* if (confirm('Do you want to load Job Template?')) {
			this.getTemplate(item.id);
		} else {
			// Do nothing!
		} */
		//console.log("job title => "+this.job.title);
	  }
	
	  onChangeSearch(search: string) {
		// fetch remote data from here
		// And reassign the 'data' which is binded to 'data' property.
		//console.log(this.auto.nativeElement);
		this.job.title = search;
		return this.http.get(this.matchTitlesUrl+"?title="+search, this.httpOptions).subscribe(
			data => this.handleSuccessMatchTitles(data),
			error => this.handleError(error)
		);
	  }

	  handleSuccessMatchTitles(data) {
				this.dataTitles = [];
				//console.log(data.data);
				for (var key in data.data.titles) {
					var obj = data.data.titles[key];
					//console.log(obj);
					this.dataTitles.push({
						id: key,
						name: obj
					});
				}
				
				
		
			 }
	
	  onFocused(e) {
		// do something
	  }

	public t_data;
	handleSuccessTemplates(data) {
		/*this.templates = data.data.templates;
		for (var key in data.data.templates) {
			var obj = data.data.templates[key];
			this.exampleData2.push({
				id: obj.job_id,
				text: obj.name
			});
		}
		this.t_data = this.exampleData2;*/
	}


	handleChange(evt) {
		var target = evt.target;
		console.log(target.value);
		this.create_from_type = target.value;
	}

	nextStep() {
		this.step1_done = true;
		console.log(this.create_from_type);
		return this.http.get(this.jobCreateUrl, this.httpOptions).subscribe(
			data => this.handleSuccessCreate(data),
			error => this.handleError(error)
		);
	}

	loadTemplate(id) {
		//if (this.job_id != null)
			this.getTemplate(id);
	}

	getTemplate(id) {

		this._JobService.getTemplate(id)
			.subscribe(
				data => this.handleJobGetSuccess(data),
				err => this.handleError(err)

			);

	}

	saveAsTemplate() {
		console.log("save template only here");
	}

	handleJobGetSuccess(data) {
		var _job =  data.data.template.job;
		this.job.title = _job.title;
		this.job.description = _job.description;
		this.job.skills = _job.skills;
		this.job.job_type = _job.job_type;
		this.job.category_id = _job.category_id;
		this.job.address = _job.address;
		this.job.experience = _job.experience;
		this.job.additional_detail = _job.additional_detail;
		this.onChangeSearch(this.job.title);
		this.job.is_published = 1;
		//this.job.start_date = this.inputFormatDate(this.job.start_date);
		//this.job.tentative_end_date = this.inputFormatDate(this.job.tentative_end_date);
		this.focusOutFunction();
	}

	handleFileUpload(files: FileList) {
		this.fileToUpload = files.item(0);
		this.uploaded_file_name = files.item(0).name; 
	}

	focusOutFunction() {
		return this.http.post(this.get_skills_url, { description: this.job.description }, this.httpOptions).subscribe(
			data => this.handleSuccessGetSkills(data),
			error => this.handleErrorGetSkills(error)
		);
	}

	handleSuccessGetSkills(data) {
		this.job.skills = data.data.skills;
	}

	handleErrorGetSkills(error) {

	}

	getAddress(place: object) {
		console.log(place);
		//this.job.zipcode = place['formatted_address'];
		this.job.address = place['formatted_address'];
		console.log(this.job.address);
		//this.phone = this.getPhone(place);
		//this.formattedAddress = place['formatted_address'];
		//this.zone.run(() => this.formattedAddress = place['formatted_address']);
	}

	addDescription() {
		//this.job.descriptions.push('');
	}

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	/*resetFormJobData() {
		this.job = {
			title: null,
			job_type: '',
			currency: '',
			category_id: '',
			zipcode: null,
			skills: [],
			veteran_status: null,
			other_skills: [],
			openings: null,
			experience: '',
			description: '',
			address: '',
			is_published: 1,
			department_id: '',
			costcenter_id: '',
			billing_code_id: '',
			hiring_manager: '',
			program_id: '',
			workflow_id: '',
			salary: null,
			min_rate: null,
			max_rate: null,
			salary_type: '',
			pay_type: '',
			start_date: null,
			tentative_end_date: null,
			additional_detail: null,
			reason_for_hire: null,
			publish_to_supplier: null,
			publish_to_portals: null

		};
	}*/

	

	handleSuccessCreate(data) {
		this.job.start_date = this._helper.inputFormatDate(this.job.start_date);
		this.job.tentative_end_date = this._helper.inputFormatDate(this.job.tentative_end_date);
		this.job_types = data.data.job_types;
		this.currencies = this._helper.convertToSelect2(data.data.currencies);
		this.pay_types = this._helper.convertToSelect2(data.data.pay_types);
		this.categories = this._helper.convertToSelect2(data.data.categories);
		this.locations_default = data.data.locations;
		this.locations = this._helper.convertToSelect2(data.data.locations, 'location', 'location');

		if(data.data.business_setup.default_currency=='' || data.data.business_setup.default_currency==null)
			this.job.currency = 'USD';
		else
			this.job.currency = data.data.business_setup.default_currency;


		var default_category = this.categories.find(x => x.name === data.data.business_setup.business_category);

		this.job.category_id = 28;

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
		this.custom_fields = data.data.custom_fields;
		for ( var key in this.custom_fields ) {
			var obj = this.custom_fields[key];
			console.log(obj);
			obj.answer = obj.default_value;
		  }
		this.departments = this._helper.convertToSelect2(data.data.departments, 'id', ':name ( :code )');
		this.cost_center_codes = this._helper.convertToSelect2(data.data.cost_center_codes, 'id', ':name ( :cost_code )');
		this.billing_codes = this._helper.convertToSelect2(data.data.billing_codes, 'id', ':name ( :code )');
		this.hiring_managers = this._helper.convertToSelect2(data.data.hiring_managers, 'id', ':first_name  :last_name');
		this.job.hiring_manager = this.logged_user_id;
		this.programs = this._helper.convertToSelect2(data.data.programs);
		this.experiences = data.data.experience_levels;
	}

	saveDraft(){
		this.isLoading = true;
		this.save_draft_text = "Saving to Drafts...";








		//this.job.start_date = this.formatDate(this.job.start_date);
		//this.job.tentative_end_date = this.formatDate(this.job.tentative_end_date);



		let formData = new FormData();



		for (var key in this.job) {
			formData.append(key, this.job[key]);
		}

		formData.set('start_date', this.formatDate(this.job.start_date));
		formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));
		formData.set('is_published', '0');

		if (this.job.publish_to_supplier == true)
			formData.set('publish_to_supplier', '1');
		else
			formData.set('publish_to_supplier', '0');

		if (this.job.publish_to_portals == true)
			formData.set('publish_to_portals', '1');
		else
			formData.set('publish_to_portals', '0');

		formData.append('description_document', this.fileToUpload);


		for (var key in this.job.skills) {
			var obj = this.job.skills[key];

			if (obj) {
				formData.append('skills[]', obj);
			}
		}

		for (var key in this.job.other_skills) {
			var skill = this.job.other_skills[key];

			if (skill) {
				formData.append('other_skills[]', skill);
			}
		}

		/*for (var key in this.job.descriptions) {
			var description = this.job.descriptions[key];

			if (description) {
				formData.append('descriptions[]', description);
			}
		}*/

		//console.log(obj);

		//console.log(formData);


		return this.http.post(this.job_post_url, formData, this.httpOptions).subscribe(
			data => this.handleSuccessPostDraft(data),
			error => this.handleError(error)
		);
	}

	handleSuccessPostDraft(data) {
		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		//this.resetFormJobData();
		this.isLoading = false;
		this.router.navigateByUrl('/client/job-drafts', data.msg.msg);
	}

	saveTemplate(){
		this.isLoading = true;
		this.save_template_text = "Saving to Template...";








		//this.job.start_date = this.formatDate(this.job.start_date);
		//this.job.tentative_end_date = this.formatDate(this.job.tentative_end_date);



		let formData = new FormData();



		for (var key in this.job) {
			formData.append(key, this.job[key]);
		}

		formData.set('start_date', this.formatDate(this.job.start_date));
		formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));

		if (this.job.publish_to_supplier == true)
			formData.set('publish_to_supplier', '1');
		else
			formData.set('publish_to_supplier', '0');

		if (this.job.publish_to_portals == true)
			formData.set('publish_to_portals', '1');
		else
			formData.set('publish_to_portals', '0');

		formData.append('description_document', this.fileToUpload);


		for (var key in this.job.skills) {
			var obj = this.job.skills[key];

			if (obj) {
				formData.append('skills[]', obj);
			}
		}

		for (var key in this.job.other_skills) {
			var skill = this.job.other_skills[key];

			if (skill) {
				formData.append('other_skills[]', skill);
			}
		}

		/*for (var key in this.job.descriptions) {
			var description = this.job.descriptions[key];

			if (description) {
				formData.append('descriptions[]', description);
			}
		}*/

		//console.log(obj);

		//console.log(formData);


		return this.http.post(this.template_post_url, formData, this.httpOptions).subscribe(
			data => this.handleSuccessPostTemplate(data),
			error => this.handleError(error)
		);
	}

	handleSuccessPostTemplate(data) {
		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		this.isLoading = false;
		this.router.navigateByUrl('/client/templates', data.msg.msg);
	}

	
	form_type = 'job';
	msg_array = [];

	onSubmit() {

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
			this.saveDraft();
		else{

		this.isLoading = true;

		this.publish_job_text = "Publishing..."


		




		//this.job.start_date = this.formatDate(this.job.start_date);
		//this.job.tentative_end_date = this.formatDate(this.job.tentative_end_date);



		let formData = new FormData();
		if( this.job.address !='' && this.job.address != null){
			var location = this.locations_default.find(x => x.location === this.job.address);
			this.job.location_id = location.id;
		}

		for (var key in this.job) {
			formData.append(key, this.job[key]);
		}

		formData.set('start_date', this.formatDate(this.job.start_date));
		formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));

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

		formData.append('description_document', this.fileToUpload);


		for (var key in this.job.skills) {
			var obj = this.job.skills[key];
			console.log(obj);

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
			if(obj.type=='date'){
				//obj.answer = this.formatDate(obj.answer);
				formData.append('custom_fields['+x+'][value]', this.formatDate(obj.answer));
				//console.log(obj);
			}
			else
				formData.append('custom_fields['+x+'][value]', obj.answer);
			x++;
		  }

		  //formData.append('custom_fields[]', custom_fields);

		console.log(formData.get('custom_fields'));


		return this.http.post(this.job_post_url, formData, this.httpOptions).subscribe(
			data => this.handleSuccess(data),
			error => this.handleError(error)
		);
		}

	}

	handleSuccess(data) {
		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		//this.resetFormJobData();
		this.isLoading = false;
		this.router.navigateByUrl('/client/jobs', data.msg.msg);
	}

	handleError(error) {
		
		this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
		this.save_draft_text = "Save to Drafts";
		this.save_template_text = "Save to Template";
		this.publish_job_text = "Publish Job";
		this.isLoading = false;
	}

	changeSalaryType(){
		if(this.job.job_type == 'Full Time')
			this.job.salary_type = 'Monthly';
		else
			this.job.salary_type = 'Hourly';
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

}
