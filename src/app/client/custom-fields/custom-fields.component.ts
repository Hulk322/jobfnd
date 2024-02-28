import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CustomFieldService } from 'src/Services/client/custom-field.service';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {

  isLoading = false;
  fields = [];
  field = {
    id: null,
    label: null,
    type: null,
    default_value: null,
    deleted: false
  }
  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
    private _fieldService: CustomFieldService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._fieldService.getList()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data){
    this.fields = data.data.custom_fields;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.field.id) {
      this._fieldService.update(this.field).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._fieldService.add(this.field).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.field.id) {
      this._fieldService.update(this.field).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._fieldService.add(this.field).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(field){
    this.field = field;
  }

  delete(id, field){
    
    var answer = confirm('Are you sure you want to delete this custom field?');
    if(answer){
      this.isLoading = true;
      field.deleted = true;
      for(let i = 0; i < this.fields.length; ++i){
        if (this.fields[i].id === id) {
          this._fieldService.delete(field)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.fields.splice(index, 1);
    this.field = { id:null, label:null, type:null, default_value: null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.field.id = data.data.custom_field.id;
    this.fields.unshift(this.field);
    this.field = { id:null, label:null, type:null, default_value: null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.field = { id:null, label:null, type:null, default_value: null, deleted:false };
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
    this.field = { id:null, label:null, type:null, default_value: null, deleted:false };
  }
}
