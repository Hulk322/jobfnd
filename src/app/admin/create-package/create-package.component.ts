import { Component, OnInit } from '@angular/core';
import { PackagesService } from 'src/Services/admin/packages.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css']
})
export class CreatePackageComponent implements OnInit {

isLoading = false;
  package = {
    id: null,
    name: null,
    type: null,
    description: null,
    price: null,
    job_limit: null,
  };
  constructor(
              private _PackagesService: PackagesService,
  		        private _ErrorService: ErrorService,
              private router: Router
              ) { }

  ngOnInit() {
  }

  onSubmit(){
  	this._PackagesService.add(this.package).subscribe(
      data => this.handleSuccess(data),
  		error => this.handleError(error)
  		);
  }

   handleSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.router.navigateByUrl('/admin/packages', data.msg.msg);
  }

   handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

}
