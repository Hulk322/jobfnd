import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TimesheetCodeService } from 'src/Services/client/timesheet-code.service';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-time-sheet-codes',
  templateUrl: './time-sheet-codes.component.html',
  styleUrls: ['./time-sheet-codes.component.css']
})
export class TimeSheetCodesComponent implements OnInit {

  isLoading = false;
  sheets = [];
  sheet = {
    id: null,
    code: null,
    name: null,
    deleted: false
  }

  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
  constructor(
    private _SheetService: TimesheetCodeService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._SheetService.getSheetCodes()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data){
    this.sheets = data.data.timeSheetCodes;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.sheet.id) {
      this._SheetService.update(this.sheet).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._SheetService.add(this.sheet).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.sheet.id) {
      this._SheetService.update(this.sheet).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._SheetService.add(this.sheet).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(sheet){
    this.sheet = sheet;
  }

  delete(id, sheet){
    this.isLoading = true;
    var answer = confirm('Are you sure you want to delete this Timesheet Code?');
    if(answer){
      sheet.deleted = true;
      for(let i = 0; i < this.sheets.length; ++i){
        if (this.sheets[i].id === id) {
          this._SheetService.delete(sheet)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.sheets.splice(index, 1);
    this.sheet = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.sheet.id = data.data.timeSheetCode.id;
    this.sheets.unshift(this.sheet);
    this.sheet = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.sheet = { id:null, code:null, name:null, deleted:false };
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
    this.sheet = { id:null, code:null, name:null, deleted:false };
  }
}
