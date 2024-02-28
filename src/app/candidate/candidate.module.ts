import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgSelect2Module } from 'ng-select2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
import { TagInputComponent } from 'src/component/shared/tag-input/tag-input.component';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';

import { AuthGuardCandidateService } from './auth-guard-candidate.service';
import { DataService } from "src/app/data.service";
import { PhoneMaskDirective } from './phone-mask.directive'; 

import { HomeComponent } from './home/home.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { ProfileComponent } from './profile/profile.component';
import { CandidateErrorsComponent } from './errors/errors.component';
import { FooterComponent } from './footer/footer.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FirstTimeProfileComponent } from './first-time-profile/first-time-profile.component';
import { ResumeComponent } from './resume/resume.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import { SortPipe } from './sort.pipe';
import { JobComponent } from './job/job.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { HtmlToPlaintextPipe } from './html-to-plaintext.pipe';
import { SharedModule } from '../shared/shared.module';
import { CompletedResumeComponent } from './completed-resume/completed-resume.component';
import { JobQuestionsComponent } from './job-questions/job-questions.component';
import { JobApplySuccessComponent } from './job-apply-success/job-apply-success.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { SubmissionsListComponent } from './submissions/submissionList/submissionsList.component';
import { SubmissionsGridComponent } from './submissions/submissionGrid/submissionsGrid.component';
import { HeaderComponent } from './header/header.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ListInterviewsComponent } from './list-interviews/list-interviews.component';
import { OffersComponent } from './offers/offers.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsGridComponent } from './jobs-grid/jobs-grid.component';
import { CardComponent } from './card/card.component';
import { AppliedJobDetailsComponent } from './applied-job-details/applied-job-details.component';
import { AcceptedJobsComponent } from './accepted-jobs/accepted-jobs.component';
import { OfferComponent } from './offer/offer.component';
import { ContractsListComponent } from './contracts/contracts-list/contracts-list.component';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { ApplicationTabsComponent } from './application-tabs/application-tabs.component';
import { EmptyListComponent } from './empty-list/empty-list.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { JobRateComponent } from './job-rate/job-rate.component';
import { SimilarJobsComponent } from './similar-jobs/similar-jobs.component';
import { RecommendedJobsComponent } from './recommended-jobs/recommended-jobs.component';
import { SubscribeToJobComponent } from './subscribe-to-job/subscribe-to-job.component';
import { SendJobInEmailComponent } from './send-job-in-email/send-job-in-email.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
     { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'first-time-profile', component: FirstTimeProfileComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'jobs/:id', component: JobComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'profile', component: ResumeComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'resume', component: CompletedResumeComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'job-questions/:id', component: JobQuestionsComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'job-apply-success/:job_slug/:job_id', component: JobApplySuccessComponent, canActivate: [AuthGuardCandidateService] },
     { path: 'my-jobs', component: MyJobsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'applied-jobs', component: AppliedJobsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'applied-jobs/:id', component: AppliedJobDetailsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'accepted-jobs', component: AcceptedJobsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'submissions', component: SubmissionsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'interviews', component: ListInterviewsComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'offers', component: OffersComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'offers/:id', component: OfferComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'contracts', component: ContractsListComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardCandidateService]},
     { path: 'account-settings', component: AccountSettingComponent, canActivate: [AuthGuardCandidateService]}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    NgbModule,
    TagInputModule,
    NgSelect2Module,
    NgxPhoneMaskModule,
    SharedModule,
    InternationalPhoneNumberModule
  ],
  declarations: [DashboardComponent, HomeComponent, TopBarComponent, 
    MyJobsComponent, ProfileComponent, 
    CandidateErrorsComponent, FooterComponent, 
    ChangePasswordComponent, 
    FirstTimeProfileComponent,
    ResumeComponent, 
    ReadMoreComponent,
    TagInputComponent,
    SortPipe,
    PhoneMaskDirective,
    HtmlToPlaintextPipe,
    JobComponent,
    SubMenuComponent,
    CompletedResumeComponent,
    JobQuestionsComponent,
    JobApplySuccessComponent,
    SubmissionsComponent,
    SubmissionsListComponent,
    SubmissionsGridComponent,
    HeaderComponent,
    AccountSettingComponent,
    ListInterviewsComponent,
    OffersComponent,
    AppliedJobsComponent,
    JobsListComponent,
    JobsGridComponent,
    CardComponent,
    AppliedJobDetailsComponent,
    AcceptedJobsComponent,
    OfferComponent,
    ContractsListComponent,
    ContractDetailsComponent,
    ApplicationTabsComponent,
    EmptyListComponent,
    JobRateComponent,
    SimilarJobsComponent,
    RecommendedJobsComponent,
    SubscribeToJobComponent,
    SendJobInEmailComponent
  ],
  providers: [DataService]
})
export class CandidateModule { }
