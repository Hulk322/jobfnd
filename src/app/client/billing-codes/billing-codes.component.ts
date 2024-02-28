import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BillingCodeService } from 'src/Services/client/billing-code.service';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-billing-codes',
  templateUrl: './billing-codes.component.html',
  styleUrls: ['./billing-codes.component.css']
})
export class BillingCodesComponent implements OnInit {

  isLoading = false;
  billing_codes = [];
  billing_code = {
    id: null,
    code: null,
    name: null,
    deleted: false
  }

  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
    private _BillingCodeService: BillingCodeService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._BillingCodeService.getBillingCodes()
        .subscribe( 
          data => this.handleSuccess(data),
         error => this.handleError(error)
      );
  }

  handleSuccess(data){
    this.billing_codes = data.data.billing_codes;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.billing_code.id) {
      this._BillingCodeService.update(this.billing_code).subscribe( 
        data => this.handleUpdateSuccess(data),
        error => this.handleAddError(error)
      );
    }
    else{
      this._BillingCodeService.add(this.billing_code).subscribe( 
        data => this.handleAddSuccess(data),
        error => this.handleAddError(error)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.billing_code.id) {
      this._BillingCodeService.update(this.billing_code).subscribe( 
        data => this.handleUpdateSuccess(data),
        error => this.handleAddError(error)
      );
    }
    else{
      this._BillingCodeService.add(this.billing_code).subscribe( 
        data => this.handleAddSuccess(data),
        error => this.handleAddError(error)
      );
    }
  }

  edit(billing_code){
    this.billing_code = billing_code;
  }

  delete(id, billing_code){
    this.isLoading = true;
    var answer = confirm('Are you sure you want to delete this Billing Code?');
    if(answer){
      billing_code.deleted = true;
      for(let i = 0; i < this.billing_codes.length; ++i){
        if (this.billing_codes[i].id === id) {
          this._BillingCodeService.delete(billing_code)
        .subscribe( 
          data => this.handleDeleteSuccess(data, i),
          error => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(data ,index){
    this.billing_codes.splice(index, 1);
    this.billing_code = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.billing_code.id = data.data.billingCode.id;
    this.billing_codes.unshift(this.billing_code);
    this.billing_code = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.billing_code = { id:null, code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAddError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  handleError(error){
     this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
     this.isLoading = false;
   }

  dataDismiss() {
    this.billing_code = { id:null, code:null, name:null, deleted:false };
  }

}
