import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TemplateService } from 'src/Services/client/template.service';
import { InterviewService } from 'src/Services/client/interview.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-show-template',
  templateUrl: './show-template.component.html',
  styleUrls: ['./show-template.component.css']
})
export class ShowTemplateComponent implements OnInit {

  template = {
    name: null
  }
  title = '';

  public job = {
    id: null,
    title: null,
    job_type: null,
    salary_type: null,
    start_date: null,
    tentative_end_date: null,
    category: null,
    currency: null,
    description: '',
    openings: 0,
    experience: '',
    address: '',
    category_id: null,
    salary: null,
    min_rate: null,
    max_rate: null,
    additional_detail: '',
    reason_for_hire: '',
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    offers: []
  };
  isLoading = true;
  id: number;
  private sub: any;
  exampleData2 = [];
  options = {
    multiple: true
  }

  constructor(private route: ActivatedRoute,
    private _TemplateService: TemplateService,
    private router: Router,
    private _interview: InterviewService,
    private _ErrorService: ErrorService) { }







  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._TemplateService.get(this.id)
        .subscribe(
          data => this.handleSuccess(data),
          err => this.handleError(err)
          //() => console.log('ok')
        );
      // In a real app: dispatch action to load the details here.
    });
  }

  handleSuccess(data) {

    this.template = data.data.template;
    this.job = data.data.template.job;
    this.title = this.template.name.toUpperCase()+ ' - '+ this.job.job_type+ '(Template)';
    console.log(data);
    this.isLoading = false;
  }

  handleError(err) {
    console.log(err);
  }





}
