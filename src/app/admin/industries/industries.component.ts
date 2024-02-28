import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ErrorService } from 'src/Services/shared/error.service';
import { IndustriesService } from 'src/Services/admin/industries.service';
declare var jQuery:any;

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.css']
})
export class IndustriesComponent implements OnInit {

	isLoading = false;
	industries = [];
  indsutry = {
    id: null,
    name: null,
    deleted: false
  }
  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

	search_keyword = '';
  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
  			private _IndustriesService: IndustriesService,
  			private _ErrorService: ErrorService
  			) { }

  ngOnInit() {
  	this.getIndustries();
  }

  getIndustries() {
  	this.isLoading = true;
  	this._IndustriesService.get(this.pageObj.page, this.search_keyword).subscribe(
  	data	  => this.handleSuccess(data),
  	error 	=> this.handleError(error),
  	);
  }

 	handleSuccess(data) {
 	 this.industries = data.data.industries.data;
   this.pageObj.pageSize      = data.data.industries.per_page;
   this.pageObj.totalElements = data.data.industries.total;
 	 this.isLoading  = false;
 	}

   addOrupdate(){
     this.isLoading = true;
     if(this.indsutry.id) {
       this._IndustriesService.update(this.indsutry).subscribe( 
         data => this.handleUpdateSuccess(data),
         error => this.handleError(error)
       );
     }
     else{
       this._IndustriesService.add(this.indsutry).subscribe( 
         data => this.handleAddSuccess(data),
         error => this.handleError(error)
       );
     }
   }

   edit(indsutry) {
     this.indsutry = indsutry;
   }
   handleAddSuccess(data){
     jQuery(this.completeModal.nativeElement).modal('hide');
     this.indsutry.id = data.data.indsutry.id;
     this.industries.unshift(this.indsutry);
     this.indsutry = { id:null, name:null, deleted:false };
     this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
     this.isLoading = false;
   }

   handleUpdateSuccess(data){
     jQuery(this.completeModal.nativeElement).modal('hide');
     this.indsutry = { id:null, name:null, deleted:false };
     this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
     this.isLoading = false;
   }

 	handleError(error) {
 	  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
 	  this.isLoading = false;
 	}

 	deleteIndustrie(id, indsutry) {
 	let answer = confirm('Are you sure you want to delete this Industry?');

	 	if(answer){
	 		this.isLoading = true;
	 		indsutry.deleted = true;
	 		for (let i = 0; i < this.industries.length; ++i) {
	 		  if (this.industries[i].id === id) {
	 		    this._IndustriesService.delete(id)
	 		      .subscribe(
	 		        data => this.handleDeleteSuccess(data, i),
	 		        error => this.handleError(error)
	 		      );
	 		  }
	 		}
	 	}
 	}

  handleDeleteSuccess(data, i) {
   this.industries.splice(i, 1);
   this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
   this.isLoading = false;
 }

 pageChange(selectedPage){
   window.scroll(0, 0);
   this.pageObj.page = selectedPage;
   this.getIndustries();
 }

}
