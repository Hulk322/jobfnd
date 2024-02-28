import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
//import { AutocompleteComponent } from 'src/app/google-places.component';
import { NgSelect2Module } from 'ng-select2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgxPhoneMaskModule } from 'ngx-phone-mask';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { ChartsModule } from 'ng2-charts';
import { ErrorService } from 'src/Services/shared/error.service';
import { ClientErrorsComponent } from './errors/errors.component';
import { AuthGuardClient } from 'src/app/auth-guard-client.service';

import { TimeSheetCodesComponent } from './time-sheet-codes/time-sheet-codes.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ClientDashboardComponent } from './dashboard/dashboard.component';
import { ClientProfileComponent } from './profile/profile.component';
import { ClientJobsComponent } from './jobs/jobs.component';
import { JobComponentComponent } from  './job-component/job-component.component';
import { SubmissionComponent } from './submission/submission.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { ClientChangePasswordComponent } from './change-password/change-password.component';
import { DepartmentsComponent } from './departments/departments.component';
import { BillingCodesComponent } from './billing-codes/billing-codes.component';
import { CostCenterComponent } from  './cost-center/cost-center.component';
import { ProgramsComponent } from './programs/programs.component';
import { FooterComponent } from './footer/footer.component';
import { CreateTemplateComponent } from './templates/create-template/create-template.component';
import { ListTemplatesComponent } from './templates/list-templates/list-templates.component';
import { HeaderRightComponent } from './header-right/header-right.component';
import { HeaderComponent } from './header/header.component';
import { DraftsComponent } from './drafts/drafts.component';
import { JobsArchivesComponent } from './jobs-archives/jobs-archives.component';
import { SubmissionsComponent } from './submissions/submissions.component';

import { DataService } from "src/app/data.service";
import { CreateOfferComponent } from './offers/create-offer/create-offer.component';
import { ListOffersComponent } from './offers/list-offers/list-offers.component';
import { CreateInterviewComponent } from './interviews/create-interview/create-interview.component';
import { ListInterviewsComponent } from './interviews/list-interviews/list-interviews.component';
import { ShowInterviewComponent } from './interviews/show-interview/show-interview.component';
import { EditTemplateComponent } from './templates/edit-template/edit-template.component';
import { ShowOfferComponent } from './offers/show-offer/show-offer.component';
import { ShowTemplateComponent } from './templates/show-template/show-template.component';
import { SubmissionsListComponent } from './submissions/submissionList/submissionsList.component';
import { SubmissionsGridComponent } from './submissions/submissionGrid/submissionsGrid.component';

import { SortPipe } from 'src/app/client/sort.pipe';
import { ConvertTo12HourPipe } from '../convert-to12-hour.pipe';
import { TeamMembersComponent } from './team-members/team-members.component';
import { SharedModule } from '../shared/shared.module';
import { BusinessSetupComponent } from './business-setup/business-setup.component';
import { CreateOfferStep1Component } from './offers/create-offer-step1/create-offer-step1.component';
import { CreateOnBoardingComponent } from './onboarding/create-on-boarding/create-on-boarding.component';
import { EditOnBoardingComponent } from './onboarding/edit-on-boarding/edit-on-boarding.component';
import { ListOnBoardingComponent } from './onboarding/list-on-boarding/list-on-boarding.component';
import { BackgroundVerificationComponent } from './background-verification/background-verification.component';
import { BackgroundVerificationListComponent } from './background-verification-list/background-verification-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChartsComponent } from './dashboard/charts/charts.component';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { ContractsListComponent } from './contracts/contracts-list/contracts-list.component';
import { CreateContractComponent } from './contracts/create-contract/create-contract.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { InterviewModalComponent } from './interviews/interview-modal/interview-modal.component';
import { SettingsComponent } from './settings/settings.component';
import { DiscoverCandidatesComponent } from './discover-candidates/discover-candidates.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { ShowCandidateComponent } from './candidates/show-candidate/show-candidate.component';
import { LocationsComponent } from './locations/locations.component';
import { CandidatesDiscoverComponent } from './candidates-discover/candidates-discover.component';
import { CompareCandidatesComponent } from './candidates/compare-candidates/compare-candidates.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
    children: [
      { path: '', component: ClientDashboardComponent, pathMatch: 'full'},
      { path: 'dashboard', component: ClientDashboardComponent, canActivate: [AuthGuardClient] },
      { path: 'profile', component: ClientProfileComponent, canActivate: [AuthGuardClient]},
      { path: 'jobs', component: ClientJobsComponent, canActivate: [AuthGuardClient] },
      { path: 'job/:id', component: JobComponentComponent, canActivate: [AuthGuardClient] },
      { path: 'templates', component: ListTemplatesComponent, canActivate: [AuthGuardClient] },
      { path: 'template/:id', component: ShowTemplateComponent, canActivate: [AuthGuardClient] },
      { path: 'templates/create', component: CreateTemplateComponent, canActivate: [AuthGuardClient] },
      { path: 'templates/edit/:id', component: EditTemplateComponent, canActivate: [AuthGuardClient] },
      { path: 'job-drafts', component: DraftsComponent, canActivate: [AuthGuardClient] },
      { path: 'job-archives', component: JobsArchivesComponent, canActivate: [AuthGuardClient] },
      { path: 'submissions', component: SubmissionsComponent, canActivate: [AuthGuardClient] },
      { path: 'interviews', component: ListInterviewsComponent, canActivate: [AuthGuardClient] },
      { path: 'interview/:id', component: ShowInterviewComponent, canActivate: [AuthGuardClient] },
      { path: 'create-interview/:submission_id', component: CreateInterviewComponent, canActivate: [AuthGuardClient] },
      { path: 'offers', component: ListOffersComponent, canActivate: [AuthGuardClient] },
      { path: 'offer/:id', component: ShowOfferComponent, canActivate: [AuthGuardClient] },
      { path: 'contracts', component: ContractsListComponent, canActivate: [AuthGuardClient] },
      { path: 'create-contract', component: CreateContractComponent, canActivate: [AuthGuardClient] },
      { path: 'contracts/:id', component: ContractDetailsComponent, canActivate: [AuthGuardClient] },
      { path: 'create-offer/:submission_id', component: CreateOfferComponent, canActivate: [AuthGuardClient] },
      { path: 'on-boarding', component: ListOnBoardingComponent, canActivate: [AuthGuardClient] },
      { path: 'create-on-board/:offer_id', component: CreateOnBoardingComponent, canActivate: [AuthGuardClient] },
      { path: 'background-verification/:offer_id', component: BackgroundVerificationComponent, canActivate: [AuthGuardClient] },
      { path: 'background-verifications', component: BackgroundVerificationListComponent, canActivate: [AuthGuardClient] },
      { path: 'submissions/:id', component: SubmissionComponent, canActivate: [AuthGuardClient] },
      { path: 'jobs/create', component: CreateJobComponent, canActivate: [AuthGuardClient] },
      { path: 'jobs/edit/:id', component: EditJobComponent, canActivate: [AuthGuardClient] },
      { path: 'change-password', component: ClientChangePasswordComponent, canActivate: [AuthGuardClient]},
      { path: 'business-setup', component: BusinessSetupComponent, canActivate: [AuthGuardClient] },
      { path: 'team-members', component: TeamMembersComponent, canActivate: [AuthGuardClient] },
      { path: 'departments', component: DepartmentsComponent, canActivate: [AuthGuardClient] },
      { path: 'timesheet-codes', component: TimeSheetCodesComponent, canActivate: [AuthGuardClient] },
      { path: 'locations', component: LocationsComponent, canActivate: [AuthGuardClient] },
      { path: 'custom-fields', component: CustomFieldsComponent, canActivate: [AuthGuardClient] },
      { path: 'billing-codes', component: BillingCodesComponent, canActivate: [AuthGuardClient] },
      { path: 'cost-center', component: CostCenterComponent, canActivate: [AuthGuardClient] },
      { path: 'programs', component: ProgramsComponent, canActivate: [AuthGuardClient] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardClient] },
      // { path: 'discover-candidates/:job_id', component: DiscoverCandidatesComponent, canActivate: [AuthGuardClient] },
      { path: 'discover-candidates/:job_id/:similar', component: DiscoverCandidatesComponent, canActivate: [AuthGuardClient] },
      { path: 'candidates/:id/:job_id', component: ShowCandidateComponent, canActivate: [AuthGuardClient] },
      { path: 'discover-candidates/:job_id', component: CandidatesDiscoverComponent, canActivate: [AuthGuardClient] },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelect2Module,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    TagInputModule,
    NgxPhoneMaskModule,
    NgxExtendedPdfViewerModule,
    NgxStickySidebarModule,
    FullCalendarModule, // for FullCalendar!
    ChartsModule,
    SharedModule
  ],
  declarations: [
    ClientErrorsComponent,
    //AutocompleteComponent,
    TimeSheetCodesComponent, 
    HomeComponent, 
    TopBarComponent, 
    ClientDashboardComponent,
    ClientProfileComponent,
    ClientJobsComponent,
    JobComponentComponent,
    SubmissionComponent,
    CreateJobComponent,
    EditJobComponent,
    ClientChangePasswordComponent,
    DepartmentsComponent,
    BillingCodesComponent,
    CostCenterComponent,
    ProgramsComponent,
    FooterComponent,
    CreateTemplateComponent,
    ListTemplatesComponent,
    HeaderComponent,
    HeaderRightComponent,
    DraftsComponent,
    JobsArchivesComponent,
    SubmissionsComponent,
    CreateOfferComponent,
    ListOffersComponent,
    CreateInterviewComponent,
    ListInterviewsComponent,
    ShowInterviewComponent,
    EditTemplateComponent,
    ShowOfferComponent,
    ShowTemplateComponent,
    SortPipe,
    ConvertTo12HourPipe,
    SubmissionsListComponent,
    SubmissionsGridComponent,
    TeamMembersComponent,
    BusinessSetupComponent,
    CreateOfferStep1Component,
    CreateOnBoardingComponent,
    EditOnBoardingComponent,
    ListOnBoardingComponent,
    BackgroundVerificationComponent,
    BackgroundVerificationListComponent,
    SidebarComponent,
    ChartsComponent,
    ContractDetailsComponent,
    ContractsListComponent,
    CreateContractComponent,
    CustomFieldsComponent,
    InterviewModalComponent,
    SettingsComponent,
    DiscoverCandidatesComponent,
    ConfirmationDialogComponent,
    ShowCandidateComponent,
    LocationsComponent,
    CandidatesDiscoverComponent,
    CompareCandidatesComponent
    //TagInputComponent
  ],
  entryComponents:[CreateInterviewComponent, ConfirmationDialogComponent],
  providers: [
    AuthGuardClient,
    ErrorService,
    DataService,
    ConfirmationDialogService
  ]
})
export class ClientModule { }
