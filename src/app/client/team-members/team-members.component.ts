import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TeamMemberService } from 'src/Services/client/team-member.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { HelperUtilityService } from 'src/app/helper-utility.service';
declare var jQuery:any;

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  isLoading = false;
  teamMembers = [];
  team_member = {
    id:null,
    first_name: null,
    last_name: null,
    email: null,
    pivot : {
      access_level: null
    },
    access_level: null,
    status : 0,
    banned: 0,
    deleted: false
  };
  color:any;
  accessLevels = [];
  current_user_id = localStorage.getItem('id');

  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
  constructor(
    private _TeamMemberService: TeamMemberService,
    private _helper: HelperUtilityService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    
    this._TeamMemberService.getList()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  width = "100%";
  
  statuses = this._helper.convertToSelect2([
    {id:0, name:"Active"},
    {id:1, name:"Inactive"}
  ]);
  handleSuccess(data){
    this.teamMembers = data.data.teamMembers;
    this.accessLevels = this._helper.toSelect2(data.data.accessLevels);
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;

    this.team_member.status = this.team_member.banned;
    this.team_member.access_level = this.team_member.pivot.access_level;

    if(this.team_member.id) {
      this._TeamMemberService.update(this.team_member).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._TeamMemberService.add(this.team_member).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    this.team_member.status = this.team_member.banned;
    this.team_member.access_level = this.team_member.pivot.access_level;

    if(this.team_member.id) {
      this._TeamMemberService.update(this.team_member).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._TeamMemberService.add(this.team_member).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(member){
    this.team_member = member;
  }

  delete(id, member){
    
    var answer = confirm('Are you sure you want to delete this Team Member?');
    if(answer){
      this.isLoading = true;
      member.deleted = true;
      for(let i = 0; i < this.teamMembers.length; ++i){
        if (this.teamMembers[i].id === id) {
          this._TeamMemberService.delete(member)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.teamMembers.splice(index, 1);
    this.team_member = { id:null, first_name:null, last_name: null, email:null, pivot:{ access_level:null}, deleted:false, banned: 0, status:0, access_level:null };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.team_member.id = data.data.user.id;
    this.teamMembers.unshift(this.team_member);
    this.team_member = { id:null, first_name:null, last_name: null, email:null, pivot:{ access_level:null}, deleted:false, banned: 0, status:0, access_level:null };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    var _member = this.teamMembers.find(x => x.id === data.data.user.id);
    /*_program.incharge = data.data.program.incharge;*/
    _member.first_name = this.team_member.first_name;
    _member.last_name = this.team_member.last_name;
    this.team_member = { id:null, first_name:null, last_name: null, email:null, pivot:{ access_level:null}, deleted:false, banned: 0, status:0, access_level:null };
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
    this.team_member = { id:null, first_name:null, last_name: null, email:null, pivot:{ access_level:null}, deleted:false, banned: 0, status:0, access_level:null };
  }
}
