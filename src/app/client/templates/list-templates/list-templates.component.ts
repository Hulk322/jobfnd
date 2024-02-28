import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/Services/client/template.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-list-templates',
  templateUrl: './list-templates.component.html',
  styleUrls: ['./list-templates.component.css']
})
export class ListTemplatesComponent implements OnInit {

  constructor(
    private _TemplateService: TemplateService,
    private _ErrorService: ErrorService
  ) { }

  templates: any;
  isLoading = false;

  ngOnInit() {

    this.isLoading = true;
    this._TemplateService.getTemplates()
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );


  }

  deleteTemplate(template) {
    var answer = confirm('Are you sure you want to delete this template?');
    if (answer) {
      this.isLoading = true;
      template.deleted = true;
      for (let i = 0; i < this.templates.length; ++i) {
        if (this.templates[i].id === template.id) {
          this._TemplateService.delete(template.id)
            .subscribe(
              data => this.handleSuccessDelete(i, data),
              error => this.handleDeleteError(error, template)
            );

        }
      }
    }
  }

  handleSuccessDelete(i, data){
    this.templates.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleSuccess(data) {
    this.templates = data.data.templates.data;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
		//this.reserFormJobData();
		this.isLoading = false;
  }

  handleDeleteError(error, template) {
    template.deleted = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
		//this.reserFormJobData();
		this.isLoading = false;
  }

}
