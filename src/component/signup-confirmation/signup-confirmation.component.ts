import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-signup-confirmation',
  templateUrl: './signup-confirmation.component.html',
  styleUrls: ['./signup-confirmation.component.css']
})
export class SignupConfirmationComponent implements OnInit {
  
  public messages; 
  constructor(  private router: Router, 
                private route: ActivatedRoute, 
                private _ErrorService: ErrorService,
                @Inject(DOCUMENT) document: any) { 
                  let head  = document.getElementsByTagName('head')[0];
                  let link  = document.createElement('link');
                  link.rel  = 'stylesheet';
                  link.type = 'text/css';
                  link.href = 'assets/css/style.css'; 
                  head.appendChild(link);
  }

  ngOnInit() {
  	 
  	 this.messages =  this.route.snapshot.paramMap.get("messages");

  	 //this._ErrorService.flashMessage( {'type': 'success', 'messages': {"success": [this.messages] } } );

  }

}
