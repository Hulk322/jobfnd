import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CostCenterService } from 'src/Services/client/cost-center.service';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.css']
})
export class CostCenterComponent implements OnInit {

  isLoading = false;
  cost_centers = [];
  cost_center = {
    id: null,
    cost_code: null,
    name: null,
    deleted: false
  }

 @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
  constructor(
    private _CostCenterService: CostCenterService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._CostCenterService.getCostCenters()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data){
    this.cost_centers = data.data.costcenters;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.cost_center.id) {
      this._CostCenterService.update(this.cost_center).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._CostCenterService.add(this.cost_center).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.cost_center.id) {
      this._CostCenterService.update(this.cost_center).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._CostCenterService.add(this.cost_center).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(cost_center){
    this.cost_center = cost_center;
  }

  delete(id, cost_center){
    this.isLoading = true;
    var answer = confirm('Are you sure you want to delete this Cost Center?');
    if(answer){
      cost_center.deleted = true;
      for(let i = 0; i < this.cost_centers.length; ++i){
        if (this.cost_centers[i].id === id) {
          this._CostCenterService.delete(cost_center)
        .subscribe( 
          data => this.handleDeleteSuccess(data, i),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(data, index){
    this.cost_centers.splice(index, 1);
    this.cost_center = { id:null, cost_code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.cost_centers.unshift(data.data.costcenter);
    this.cost_center = { id:null, cost_code:null, name:null, deleted:false };
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.cost_center = { id:null, cost_code:null, name:null, deleted:false };
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
    this.cost_center = { id:null, cost_code:null, name:null, deleted:false };
  }
}
