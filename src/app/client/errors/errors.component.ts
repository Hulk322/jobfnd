import { Component,OnInit  } from '@angular/core';
import { ErrorService } from 'src/Services/shared/error.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ClientErrorsComponent implements OnInit  {
	
	private messages: any = {};
	public error: boolean = false ;
	public success: boolean  = false;

	  constructor(
	  		 private _ErrorService: ErrorService
	  ) { }
 	
	  ngOnInit() { 
	  	
	  	this._ErrorService.alert
	  	    .subscribe( 
	  	       data => this.updateError(data) 
	  	);
	  }

	  
 	 updateError(data) {
 	 		
 	 		if (data  != null) {
 	 			
 	 			if (data.type == 'error') {
 	 				this.error = true;
 	 				this.success = false;
 	 			}
 	 			if (data.type == 'success') {
 	 				this.success = true;
 	 				this.error = false;
 	 			}
 	 			if (data.type == '') {
 	 				this.success = false;
 	 				this.error = false;
 	 			}
 	 			
 	 			this.messages = data.messages;
 	 		}
 	 }

 	 clearError () {

 	 	this.messages = {};
 	 	this.success = false;
 	 	this.error = false;

 	 }
  	


}
