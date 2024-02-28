import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProgramService } from 'src/Services/client/program.service';
import { formatDate } from '@angular/common';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {

  isLoading = false;
  programs = [];
  teamMembers = [];
  program = {
    id: null,
    name: null,
    incharge: null,
    program_incharge: {
      id: null,
      first_name: null,
      last_name: null
    },
    start_date:null,
    end_date:null,
    status: null,
    deleted: false
  };
  bsConfig;
  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
    private _ProgramService: ProgramService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this.bsConfig = {
      containerClass: 'theme-blue',
      dateInputFormat: 'YYYY-MM-DD'
    };
    this._ProgramService.getPrograms()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
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

  handleSuccess(data){
    console.log(data);
    this.programs = data.data.programs.data;
    this.teamMembers = data.data.teamMembers;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;

    if(this.program.id) {
      this._ProgramService.update(this.program).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._ProgramService.add(this.program).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrUpdate(){
    this.isLoading = true;
    if(this.program.id) {
      this._ProgramService.update(this.program).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._ProgramService.add(this.program).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }
 
   
  edit(program){
    this.program = program;
    this.program.start_date = this.inputFormatDate(this.program.start_date);
		this.program.end_date = this.inputFormatDate(this.program.end_date);
  }

  delete(id, program){
    
    var answer = confirm('Are you sure you want to delete this Program?');
    if(answer){
      this.isLoading = true;
      program.deleted = true;
      for(let i = 0; i < this.programs.length; ++i){
        if (this.programs[i].id === id) {
          this._ProgramService.delete(program)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.programs.splice(index, 1);
    this.program = { id:null, incharge:null, program_incharge: null, name:null, deleted:false, start_date:null, end_date:null, status:null };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.program.id = data.data.program.id;
    this.programs.unshift(this.program);
    this.program = { id:null, incharge:null, program_incharge:null, name:null, deleted:false, start_date:null, end_date:null, status:null };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    var _program = this.programs.find(x => x.id === data.data.program.id);
    _program.incharge = data.data.program.incharge;
    _program.program_incharge.first_name = this.program.program_incharge.first_name;
    _program.program_incharge.last_name = this.program.program_incharge.last_name;
    this.program = { id:null, incharge:null, program_incharge:null, name:null, deleted:false, start_date:null, end_date:null, status:null };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
     this.isLoading = false;
   }
   
  dataDismiss() {
    this.program = { id:null, incharge:null, program_incharge:null, name:null, deleted:false, start_date:null, end_date:null, status:null };
  }
}
