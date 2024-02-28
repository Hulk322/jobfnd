import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
import { TagInputComponent } from './tag-input/tag-input.component';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';

import { HomeComponent } from './home/home.component';
import { AuthGuardVendor } from '../auth-guard-vendor.service';
import { VendorErrorsComponent } from './errors/errors.component';
import { ErrorService } from 'src/Services/shared/error.service';

import { VendorDashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './job/job.component';
import { UploadResumeComponent } from './submission/upload-resume/upload-resume.component';
import { SubmissionStep1Component } from './submission/submission-step1/submission-step1.component';
import { SubmissionStep2Component } from './submission/submission-step2/submission-step2.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { ContactInformationComponent } from './submission/submission-step1/contact-information/contact-information.component';
import { CountriesComponent } from './submission/submission-step1/contact-information/countries/countries.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EducationHistoryComponent } from './submission/submission-step1/education-history/education-history.component';
import { WorkHistoryComponent } from './submission/submission-step1/work-history/work-history.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SkillsComponent } from './submission/submission-step1/skills/skills.component';
import { TalentPoolComponent } from './talent-pool/talent-pool.component';
import { UploadTalentComponent } from './upload-talent/upload-talent.component';
import { HeaderRightComponent } from './header-right/header-right.component';
import { HeaderComponent } from './header/header.component';
import { DataService } from "src/app/data.service";
import { ShowInterviewComponent } from './interviews/show-interview/show-interview.component';
import { ListInterviewsComponent } from './interviews/list-interviews/list-interviews.component';
import { ListOffersComponent } from './offers/list-offers/list-offers.component';
import { ShowOfferComponent } from './offers/show-offer/show-offer.component';
import { SubmissionComponent } from './submission/submission.component';
import { SubmissionsListComponent } from './submissions/submissionList/submissionsList.component';
import { SubmissionsGridComponent } from './submissions/submissionGrid/submissionsGrid.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SortPipe } from 'src/app/vendor/sort.pipe';
import { TeamMembersComponent } from './team-members/team-members.component';
import { SharedModule } from '../shared/shared.module';
import { BusinessSetupComponent } from './business-setup/business-setup.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: VendorDashboardComponent, pathMatch: 'full', canActivate: [AuthGuardVendor] },
      { path: 'dashboard', component: VendorDashboardComponent, canActivate: [AuthGuardVendor] },
      { path: 'jobs', component: JobsComponent, canActivate: [AuthGuardVendor] },
      { path: 'job/:id', component: JobComponent, canActivate: [AuthGuardVendor] },
      { path: 'upload-resume/:job_id', component: UploadResumeComponent, canActivate: [AuthGuardVendor] },
      { path: 'submission-step-1/:job_id/:candidate_or_cv_id/:type', component: SubmissionStep1Component, canActivate: [AuthGuardVendor] },
      { path: 'business-setup', component: BusinessSetupComponent, canActivate: [AuthGuardVendor] },
      { path: 'team-members', component: TeamMembersComponent, canActivate: [AuthGuardVendor] },
      { path: 'submissions', component: SubmissionsComponent, canActivate: [AuthGuardVendor] },
      { path: 'submissions/:id', component: SubmissionComponent, canActivate: [AuthGuardVendor] },
      { path: 'talent-pool', component: TalentPoolComponent, canActivate: [AuthGuardVendor] },
      { path: 'interviews', component: ListInterviewsComponent, canActivate: [AuthGuardVendor] },
      { path: 'interview/:id', component: ShowInterviewComponent, canActivate: [AuthGuardVendor] },
      { path: 'offers', component: ListOffersComponent, canActivate: [AuthGuardVendor] },
      { path: 'offer/:id', component: ShowOfferComponent, canActivate: [AuthGuardVendor] },
      { path: 'upload-talent', component: UploadTalentComponent, canActivate: [AuthGuardVendor] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardVendor] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardVendor] }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    NgbModule,
    TagInputModule,
    NgxPhoneMaskModule,
    NgxExtendedPdfViewerModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    VendorErrorsComponent,
    VendorDashboardComponent,
    JobsComponent,
    JobComponent,
    UploadResumeComponent,
    SubmissionStep1Component,
    SubmissionStep2Component,
    ProfileComponent,
    ChangePasswordComponent,
    ConfirmationComponent,
    ContactInformationComponent,
    CountriesComponent,
    SubmissionsComponent,
    NavbarComponent,
    EducationHistoryComponent,
    WorkHistoryComponent,
    SkillsComponent,
    TopbarComponent,
    FooterComponent,
    TagInputComponent,
    TalentPoolComponent,
    UploadTalentComponent,
    HeaderComponent,
    HeaderRightComponent,
    ShowInterviewComponent,
    ListInterviewsComponent,
    ListOffersComponent,
    ShowOfferComponent,
    SubmissionComponent,
    SubmissionsListComponent,
    SubmissionsGridComponent,
    SortPipe,
    TeamMembersComponent,
    BusinessSetupComponent,
    SidebarComponent
  ],
  providers: [
    AuthGuardVendor,
    ErrorService,
    DataService
  ]
})
export class VendorModule { }
