import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/Services/client/template.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ErrorService } from 'src/Services/shared/error.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-create-template',
	templateUrl: './create-template.component.html',
	styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

	f: NgForm
	isLoading = false;
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
	fileToUpload: File = null;
	uploaded_file_name: string;

	job = {
		title: '',
		description: '',
		address: '',
		job_type: 'Direct Hire',
		category_id: '',
		zipcode: null,
		skills: [],
		veteran_status: null,
		other_skills: [],
		openings: null,
		experience: '',
		descriptions: [''],
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
		publish_to_supplier: null,
		publish_to_portals: null,
		benefits: []
	};

	exampleData = [];

	options = {
		multiple: true
	}


	jobCreateUrl = environment.baseApiUrlClient + "/client/jobs/create";
	job_post_url = environment.baseApiUrlClient + '/client/jobs/template';
	get_skills_url = environment.baseApiUrlClient + '/client/jobs/skills';


	constructor(private route: ActivatedRoute,
		private http: HttpClient,
		private _ErrorService: ErrorService,
		private router: Router) { }

	private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
	private httpOptions = {
		headers: this.headers_object
	};
	private formBuilder: FormBuilder


	ngOnInit() {
		return this.http.get(this.jobCreateUrl, this.httpOptions).subscribe(
			data => this.handleSuccessCreate(data),
			error => this.handleError(error)
		);
	}

	handleFileUpload(files: FileList) {
		this.fileToUpload = files.item(0);
		this.uploaded_file_name = files.item(0).name;
	}

	focusOutFunction() {
		//alert(this.job.descriptions[0]);
		return this.http.post(this.get_skills_url, { description: this.job.descriptions[0] }, this.httpOptions).subscribe(
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
		this.job.address = place['formatted_address'];
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


		this.departments = data.data.departments;
		this.cost_center_codes = data.data.cost_center_codes;
		this.billing_codes = data.data.billing_codes;
		this.hiring_managers = data.data.hiring_managers;
		this.programs = data.data.programs;
		this.experiences = data.data.experience_levels;
	}

	onSubmit(f) {

		this.isLoading = true;













		let formData = new FormData();



		for (var key in this.job) {
			formData.append(key, this.job[key]);
		}

		formData.set('start_date', this.formatDate(this.job.start_date));
		formData.set('tentative_end_date', this.formatDate(this.job.tentative_end_date));

		formData.append('description_document', this.fileToUpload);


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

		
		


		return this.http.post(this.job_post_url, formData, this.httpOptions).subscribe(
			data => this.handleSuccess(data),
			error => this.handleError(error)
		);

	}

	handleSuccess(data) {
		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		//this.resetFormJobData();
		this.isLoading = false;
		this.router.navigateByUrl('/client/templates', data.msg.msg);
	}

	handleError(error) {
		console.log(error.error);
		this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
		this.isLoading = false;
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


}
