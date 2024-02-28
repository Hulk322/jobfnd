import { Component, OnInit, Input } from '@angular/core';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import { DataService } from "src/app/data.service";
import { NotificationService } from 'src/Services/candidate/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public showSettingMenuFlag = false; 
  full_name = "";
  profile_picture = "";
  sidebar_open = false; 
  notifications = [];
  saved_jobs_count=0;

  @Input() saved_jobs_count_from_parent: String;
  @Input() notifications_count: Number;

  constructor(private Token: TokenService,
    private router: Router,
    private data: DataService,
    private _NotificationService: NotificationService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.full_name = message);
    this.data.currentPicturePath.subscribe(path => this.profile_picture = path);
    this.full_name = localStorage.getItem("full_name"); 
    this.profile_picture = localStorage.getItem("profile_picture");

    this.saved_jobs_count_from_parent = localStorage.getItem('saved_jobs_count');
    this.notifications_count = Number(localStorage.getItem('notifications_count'));

    this._NotificationService.getUnread()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
         //() => console.log('ok')
    );

    /*this._NotificationService.getSavedJobsCount()
        .subscribe( 
          data => this.handleSavedJobsCountSuccess(data),
         err => this.handleError(err)
         //() => console.log('ok')
    );*/

  }

  handleSuccess(data)
  {
    this.notifications = data.data.notifications.data;
    
  }

  handleSavedJobsCountSuccess(data)
  {
    this.saved_jobs_count_from_parent = data.data.saved_jobs;
    
  }

  handleError(err){
     console.log(err);
   }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_candidate');
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  showSetting() {
    this.showSettingMenuFlag = true; 
  }

  hideSetting() {
    this.showSettingMenuFlag = false; 
  }

  togglesidebar(event) {
    this.sidebar_open = !this.sidebar_open; 
  }

  markRead(notification){

    
    

    if(notification.notification_type=='jobs' && notification.type=='view')
      this.router.navigateByUrl("/candidate/applied-jobs/"+notification.notification_id+"?job_id="+notification.notification_id);

    for (let i = 0; i < this.notifications.length; ++i) {
      if (this.notifications[i].id === notification.id) {

        this.notifications.splice(i, 1);

        this._NotificationService.markRead(notification.id)
        .subscribe( 
          data => this.handleMarkReadSuccess(data, i),
         err => this.handleError(err)
         //() => console.log('ok')
    );

      }
    }

    
  }

  handleMarkReadSuccess(data, index)
  {
    
    
    this.notifications_count = Number(localStorage.getItem('notifications_count'))-1;
    localStorage.setItem('notifications_count', (Number(localStorage.getItem('notifications_count'))-1).toString());
    
  }

}
