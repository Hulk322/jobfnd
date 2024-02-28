import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/Services/candidate/contract.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit {

  isLoading = false;
  view_type='grid';
  contracts = [];
  search_keyword = "";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  constructor(private _contract: ContractService,
              private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.getContracts();
  }

  getContracts(){
    this.isLoading = true;
    this._contract.getAllContracts(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.contracts = data.data.contracts.data;
    this.pageObj.pageSize = data.data.contracts.per_page;
    this.pageObj.totalElements = data.data.contracts.total;
    this.isLoading = false;
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getContracts();
  }


  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  deleteContract(id, offer) {
    var answer = confirm('Are you sure you want to delete this contract?');
    if (answer) {
      this.isLoading = true;
      offer.deleted = true;
      for (let i = 0; i < this.contracts.length; ++i) {
        if (this.contracts[i].id === id) {
          this._contract.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => console.log(err)
            );

        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.contracts.splice(i, 1);
    //console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

}
