import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router,
  			  private toastr: ToastrService) {

    router.events.subscribe(() => { this.clear() })
  }

  public alert = new BehaviorSubject(null);
  public timeout = 0;
  flashMessage(data) {

    //console.log(data);
    if (typeof (data.messages) !== 'undefined')
      if (data.messages.error == "token_expired" || data.messages.error == "token_invalid")
      {
        //localStorage.removeItem("token");
        localStorage.clear();
        this.router.navigateByUrl("/login");
      }

    if (typeof (data.messages) !== 'undefined') {
      if (data.messages.success != "Request completed successfully.") {
        if (typeof data.messages !== 'string') {
          this.timeout = this.timeout + 60000;
          // console.log(this.timeout); 
          console.log(data);
          
          if(data.type=="success" && data.messages.success!='')
          	this.toastr.success(data.messages.success, '');

          if(data.type=="error"){
          	var output = '';
    		data.messages.msg.forEach(function (value) {
      			output = output + value + "<br>";
    		});
    		this.toastr.error(output, '');
          }

          this.alert.next(data);
        }
        else if(data.success){
        	this.toastr.success('', data.success);
        }else{
          this.toastr.error(data.messages, '');
        }
      }
      else{
      	this.toastr.success('', data.messages.success);
      }
    }

    setInterval(() => {


      //  this.clear();


    }, this.timeout);


  }


  clear() {
    this.alert.next({ 'type': '', 'messages': '' });
  }

}
