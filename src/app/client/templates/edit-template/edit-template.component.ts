import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ErrorService } from 'src/Services/shared/error.service';
import { TemplateService } from 'src/Services/client/template.service';

@Component({
	selector: 'app-edit-template',
	templateUrl: './edit-template.component.html',
	styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

	title = " Edit Template -";

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
	benefits = [];

	template ={
		title: null
	}

	job = {
		title: null,
		description: '',
		address: '',
		job_type: 'Direct Hire',
		currency: 'USD',
		category_id: '',
		zipcode: null,
		skills: [],
		veteran_status: null,
		//other_skills:[],
		openings: null,
		experience: '',
		descriptions: [''],
		department_id: '',
		costcenter_id: '',
		billing_code_id: '',
		hiring_manager: '',
		program_id: '',
		workflow_id: '',
		salary: null,
		min_rate: null,
		max_rate: null,
		pay_type: '',
		salary_type: '',
		start_date: null,
		tentative_end_date: null,
		additional_detail: null,
		reason_for_hire: '',
		publish_to_supplier: null,
		publish_to_portals: null,
		benefits : []
	};

	id: number;
	private sub: any;

	jobCreateUrl = environment.baseApiUrlClient + "/client/jobs/create";
	job_post_url = environment.baseApiUrlClient + '/client/jobs/template';
	get_skills_url = environment.baseApiUrlClient + '/client/jobs/skills';

	exampleData = [];
	exampleData2 = [];
	options = {
		multiple: true
	}
	publish_job_text = "Update Template";

	constructor(private route: ActivatedRoute,
		private http: HttpClient,
		private _ErrorService: ErrorService,
		private router: Router,
		private _TemplateService: TemplateService) { }

	private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
	private httpOptions = {
		headers: this.headers_object
	};
	private formBuilder: FormBuilder


	ngOnInit() {

		this.getTemplate();

		return this.http.get(this.jobCreateUrl, this.httpOptions).subscribe(
			data => this.handleSuccessCreate(data),
			error => this.handleError(error)
		);
	}

	getTemplate() {
		this.sub = this.route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number
			//alert(this.id);
			this._TemplateService.getTemplate(this.id)
				.subscribe(
					data => this.handleJobGetSuccess(data),
					err => this.handleError(err)
					//() => console.log('ok')
				);
			// In a real app: dispatch action to load the details here.
		});
	}

	focusOutFunction() {
		//alert(this.job.descriptions[0]);
		return this.http.post(this.get_skills_url, { description: this.job.description }, this.httpOptions).subscribe(
			data => this.handleSuccessGetSkills(data),
			error => this.handleErrorGetSkills(error)
		);
	}

	handleSuccessGetSkills(data) {
		//console.log(data);
		//console.log(this.job.skills);
		var skills = [];
		for (var key in data.data.skills) {
			console.log(data.data.skills[key]);
			skills.push('' + data.data.skills[key].id + '');
		}
		console.log(skills);
		this.job.skills = skills;
		//this.job.skills = data.data.skills;
	}

	handleErrorGetSkills(error) {

	}

	getAddress(place: object) {
		this.job.zipcode = place['formatted_address'];
		//this.phone = this.getPhone(place);
		//this.formattedAddress = place['formatted_address'];
		//this.zone.run(() => this.formattedAddress = place['formatted_address']);
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

	handleJobGetSuccess(data) {
		this.job = data.data.template.job;
		this.title = "Edit Template - "+this.job.title+' [ '+ this.job.job_type+' ]';
		
		this.job.start_date = this.inputFormatDate(this.job.start_date);
		this.job.tentative_end_date = this.inputFormatDate(this.job.tentative_end_date);

		//this.skills = data.data.skills;
		for (var key in this.job.skills) {
			var obj = this.job.skills[key];
			this.exampleData2.push(
				'' + obj.id + ''

			);
		}
		this.job.skills = this.exampleData2;
		//console.log(this.job.skills);

		//this.job.skills = data.data.skills;

		//this.job.other_skills = data.data.other_skills;

		this.job.descriptions = data.data.descriptions;
		console.log(this.job);
	}

	addDescription() {
		this.job.descriptions.push('');
	}

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	

	handleSuccessCreate(data) {
		this.job_types = data.data.job_types;
		this.currencies = data.data.currencies;
		this.pay_types = data.data.pay_types;
		this.categories = data.data.categories;

		this.skills = data.data.skills;

		//this.skills = data.data.skills;
		for (var key in data.data.skills) {
			var obj = data.data.skills[key];
			this.exampleData.push({
				id: obj.id,
				text: obj.name
			});
		}
		this.skills = this.exampleData;


		this.benefits = data.data.benefits;
		for ( var key in data.data.benefits ) {
			var obj = data.data.benefits[key];
			var benefit = this.job.benefits.find(x => x.id === obj.id);
			if(benefit)
				obj.checked = true;
		}
		this.departments = data.data.departments;
		this.cost_center_codes = data.data.cost_center_codes;
		this.billing_codes = data.data.billing_codes;
		this.hiring_managers = data.data.hiring_managers;
		this.programs = data.data.programs;
		this.experiences = data.data.experience_levels;
	}

	onSubmit(f) {

		this.isLoading = true;
		this.publish_job_text = "Updating..."
		let formData = new FormData();
		for (var key in this.job) {
			formData.append(key, this.job[key]);
		}
		formData.set('start_date', this.formatDate(this.job.start_date));
		formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));

		//formData.append('description_document', this.fileToUpload);

		for (var key in this.job.skills) {
			var obj = this.job.skills[key];

			if (obj) {
				formData.append('skills[]', obj);
			}
		}

		 //benefits
		 for (var key in this.benefits) {
			var obj = this.benefits[key];
			if(obj.checked==true)
				formData.append("benefits[]", obj.id);
		}

		return this.http.post(this.job_post_url + "/"+ this.id + "/edit", formData, this.httpOptions).subscribe(
			data => this.handleSuccess(data),
			error => this.handleError(error)
		);

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


	handleSuccess(data) {

		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		//this.reserFormJobData();
		this.isLoading = false;
		this.router.navigateByUrl('/client/templates', data.msg.msg);
	}

	handleError(error) {
		console.log(error.error);
		this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
		this.publish_job_text = "Update Job";
		this.isLoading = false;
	}


}
