import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DepartmentService } from 'src/Services/client/department.service';
import { ErrorService } from 'src/Services/shared/error.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare var jQuery:any;

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  isLoading = false;
  departments = [];
  department = {
    id: null,
    code: null,
    name: null,
    deleted: false
  }

  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
    private _DepartmentService: DepartmentService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._DepartmentService.getDepartments()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data){
    this.departments = data.data.departments;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.department.id) {
      this._DepartmentService.update(this.department).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._DepartmentService.add(this.department).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.department.id) {
      this._DepartmentService.update(this.department).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._DepartmentService.add(this.department).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(department){
    this.department = department;
  }

  delete(id, department){
    
    var answer = confirm('Are you sure you want to delete this department?');
    if(answer){
      this.isLoading = true;
      department.deleted = true;
      for(let i = 0; i < this.departments.length; ++i){
        if (this.departments[i].id === id) {
          this._DepartmentService.delete(department)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.departments.splice(index, 1);
    this.department = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.department.id = data.data.department.id;
    this.departments.unshift(this.department);
    this.department = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.department = { id:null, code:null, name:null, deleted:false };
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
    this.department = { id:null, code:null, name:null, deleted:false };
  }
}
