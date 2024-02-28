import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupConfirmationComponent } from 'src/component/signup-confirmation/signup-confirmation.component';







import { FormsModule } from '@angular/forms';

//import { AuthGuardVendor } from 'src/app/auth-guard-vendor.service';


import { CommonModule } from '@angular/common';


import { ErrorsComponent } from 'src/component/shared/errors/errors.component';

import { LandingComponent } from 'src/component/portal/landing/landing.component';
import { PortalHomeComponent } from 'src/component/portal/home/home.component';
import { PortalJobsComponent } from 'src/component/portal/jobs/jobs.component';
import { PortalJobComponent} from 'src/component/portal/job/job.component';
import { UploadResumePortalComponent } from 'src/component/portal/submission/upload-resume/upload-resume.component';
import { PortalSubmissionStep1Component } from 'src/component/portal/submission/submission-step1/submission-step1.component';
import { PortalSubmissionStep2Component } from 'src/component/portal/submission/submission-step2/submission-step2.component';
import { SubmissionSuccessComponent } from 'src/component/portal/submission-success/submission-success.component';
import { ForgetPasswordComponent } from 'src/component/forget-password/forget-password.component';
import { ResetPasswordComponent } from 'src/component/reset-password/reset-password.component';
import { ActivateComponent } from 'src/component/activate/activate.component';

import { LoginComponent } from 'src/component/login/login.component';
import { SignUpComponent } from 'src/component/sign-up/sign-up.component';

import { FinalStepComponent } from 'src/component/portal/submission/final-step/final-step.component';


import { YourOrganizationsComponent } from 'src/component/your-organizations/your-organizations.component';
import { SocialLoginComponent } from 'src/app/social-login/social-login.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { SocialSignupComponent } from 'src/app/social-signup/social-signup.component';
import { Home1Component } from 'src/app/home1/home1.component';
import { AuthGuardCandidateRedirectService } from 'src/app/auth-guard-candidate-redirect.service';
import { JobQuestionsComponent } from 'src/app/job-questions/job-questions.component';
import { ApplicationJobQuestionsComponent } from 'src/app/application-job-questions/application-job-questions.component';
import { ChatbotProfileSaveComponent } from 'src/app/chatbot-profile-save/chatbot-profile-save.component';

const appRoutes : Routes = [
  {
    path : 'candidate',
    loadChildren: () => import('src/app/candidate/candidate.module').then(m => m.CandidateModule)
 },
 {
    path : 'admin',
    loadChildren: () => import('src/app/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'client',
    loadChildren: () => import('src/app/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'vendor',
    loadChildren: () => import('src/app/vendor/vendor.module').then(m => m.VendorModule)
  },
  { 
    path: '', 
    component: Home1Component,
    canActivate: [AuthGuardCandidateRedirectService]
    //pathMatch: 'full'
  },

   //Site routes goes here 
   { 
    path: '', 
    component: PortalHomeComponent,
    children: [
     
      { path: 'jobs', component: PortalJobsComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'jobs/:id', component: PortalJobComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'upload-resume/:job_slug', component: UploadResumePortalComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'applyStep/:job_slug/:cv_id', component: FinalStepComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'submission-step-1/:job_slug/:cv_id', component: PortalSubmissionStep1Component, canActivate: [AuthGuardCandidateRedirectService]},
      { path: 'submission-step-2/:job_slug/:submission_id/:cv_id', component: PortalSubmissionStep2Component, canActivate: [AuthGuardCandidateRedirectService]},
      { path: 'job-questions/:id', component: JobQuestionsComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'application-job-questions/:job_slug/:submission_id', component: ApplicationJobQuestionsComponent, canActivate: [AuthGuardCandidateRedirectService] },
      { path: 'submission-success', component: SubmissionSuccessComponent, canActivate: [AuthGuardCandidateRedirectService] }
    ]
  },
  
  //different login layout & routes
  {
    path: 'forgot-password',
    component: ForgetPasswordComponent,
    canActivate: [AuthGuardCandidateRedirectService]
  },
  {
    path: 'reset-password/:email/:code',
    component: ResetPasswordComponent
    //canActivate: [AuthGuardCandidateRedirectService]
  },
  {
    path: 'activate/:email/:code',
    component: ActivateComponent
    //canActivate: [AuthGuardCandidateRedirectService]
  },
  {
    path: 'confirmation',
    component: SignupConfirmationComponent,
    canActivate: [AuthGuardCandidateRedirectService]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [AuthGuardCandidateRedirectService] 
  },
  {
    path: 'social-login',
    component: SocialLoginComponent
  },
  {
    path: 'chatbot/profile/save',
    component: ChatbotProfileSaveComponent
  },
  {
    path: 'social-signup',
    component: SocialSignupComponent
  },
  {
    path: 'social-login/not-found',
    component: NotFoundComponent
  },
  { 
    path: 'signup', 
    component: SignUpComponent,
    canActivate: [AuthGuardCandidateRedirectService] 
  },
  { 
    path: 'your-organizations', 
    component: YourOrganizationsComponent 
  }//,
   // otherwise redirect to home
   //{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    ErrorsComponent
  ],
    
  exports: [ErrorsComponent],
})
export class AppRoutingModule { }
