import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';

import { AuthGuardAdminService } from './auth-guard-admin.service';
import { AdminErrorsComponent } from './errors/errors.component';

import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FooterComponent } from './footer/footer.component';
import { ClientsComponent } from './clients/clients.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderRightComponent } from './header-right/header-right.component';
import { DataService } from "src/app/data.service";
import { JobsComponent } from './jobs/jobs.component';
import { HttpClientModule } from '@angular/common/http';
import { PackagesComponent } from './packages/packages.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { InterviewsComponent } from './interviews/interviews.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { OffersComponent } from './offers/offers.component';
import { InterviewComponent } from './interview/interview.component';
import { SubmissionComponent } from './submission/submission.component';
import { OfferComponent } from './offer/offer.component';
import { IndustriesComponent } from './industries/industries.component';
import { JobViewComponent } from './job-view/job-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
     { path: 'dashboard', component: DashboardComponent },
     { path: 'clients', component: ClientsComponent, canActivate: [AuthGuardAdminService] },
     { path: 'vendors', component: VendorsComponent, canActivate: [AuthGuardAdminService] },
     { path: 'candidates', component: CandidatesComponent, canActivate: [AuthGuardAdminService] },
     { path: 'jobs', component: JobsComponent, canActivate: [AuthGuardAdminService] },
     {path: 'job/:id', component:JobViewComponent, canActivate: [AuthGuardAdminService]},
     { path: 'packages', component: PackagesComponent, canActivate: [AuthGuardAdminService] },
     { path: 'packages/create', component: CreatePackageComponent, canActivate: [AuthGuardAdminService] },
     { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardAdminService] },
     { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardAdminService]},
     { path: 'interviews', component: InterviewsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'submissions', component: SubmissionsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'offers', component: OffersComponent, canActivate: [AuthGuardAdminService]},
     { path: 'interviews/:id', component: InterviewComponent, canActivate: [AuthGuardAdminService]},
     { path: 'submissions/:id', component: SubmissionComponent, canActivate: [AuthGuardAdminService]},
     { path: 'offers/:id', component: OfferComponent, canActivate: [AuthGuardAdminService]},
     { path: 'interviews/jobs/:id', component: InterviewsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'interviews/clients/:id', component: InterviewsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'interviews/submissions/:id', component: InterviewsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'submissions/jobs/:id', component: SubmissionsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'submissions/clients/:id', component: SubmissionsComponent, canActivate: [AuthGuardAdminService]},
     { path: 'offers/jobs/:id', component: OffersComponent, canActivate: [AuthGuardAdminService]},
     { path: 'offers/clients/:id', component: OffersComponent, canActivate: [AuthGuardAdminService]},
     { path: 'offers/submissions/:id', component: OffersComponent, canActivate: [AuthGuardAdminService]},
     { path: 'industries', component: IndustriesComponent, canActivate: [AuthGuardAdminService]},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    SharedModule,
    NgxExtendedPdfViewerModule,
    NgxPhoneMaskModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DashboardComponent, 
    HomeComponent, 
    TopBarComponent, 
    ProfileComponent,
    AdminErrorsComponent,
    ChangePasswordComponent,
    FooterComponent,
    ClientsComponent,
    VendorsComponent,
    CandidatesComponent,
    SidebarComponent,
    HeaderRightComponent,
    JobsComponent,
    PackagesComponent,
    CreatePackageComponent,
    InterviewsComponent,
    SubmissionsComponent,
    OffersComponent,
    InterviewComponent,
    SubmissionComponent,
    OfferComponent,
    IndustriesComponent,
    JobViewComponent
  ],
  providers: [
    DataService
  ]
})
export class AdminModule { }
