import { BrowserModule,Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app-routing/app-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';
import { NgSelect2Module } from 'ng-select2';
//import { AutocompleteComponent } from 'src/app/google-places.component';

import { AppComponent } from './app.component';


import { JobService } from 'src/Services/vendor/job.service';


import { AuthGuardVendor } from './auth-guard-vendor.service';

import { ErrorService } from 'src/Services/shared/error.service';


import { SignupConfirmationComponent } from 'src/component/signup-confirmation/signup-confirmation.component';
import { FinalStepComponent } from 'src/component/portal/submission/final-step/final-step.component';

import { LandingComponent } from 'src/component/portal/landing/landing.component';
import { PortalHomeComponent } from 'src/component/portal/home/home.component';
import { PortalJobsComponent } from 'src/component/portal/jobs/jobs.component';
import { PortalJobComponent } from 'src/component/portal/job/job.component';
import { UploadResumePortalComponent } from 'src/component/portal/submission/upload-resume/upload-resume.component';
import { PortalSubmissionStep1Component } from 'src/component/portal/submission/submission-step1/submission-step1.component';
import { SubmissionSuccessComponent } from 'src/component/portal/submission-success/submission-success.component';
import { PortalSubmissionStep2Component } from 'src/component/portal/submission/submission-step2/submission-step2.component';
import { ContactInformationPortalComponent } from 'src/component/portal/submission/submission-step1/contact-information/contact-information.component';
import { CountriesPortalComponent } from 'src/component/portal/submission/submission-step1/contact-information/countries/countries.component';
import { EducationHistoryPortalComponent } from 'src/component/portal/submission/submission-step1/education-history/education-history.component';
import { SkillsPortalComponent } from 'src/component/portal/submission/submission-step1/skills/skills.component';
import { WorkHistoryPortalComponent } from 'src/component/portal/submission/submission-step1/work-history/work-history.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ForgetPasswordComponent } from 'src/component/forget-password/forget-password.component';
import { ResetPasswordComponent } from 'src/component/reset-password/reset-password.component';
import { ActivateComponent } from 'src/component/activate/activate.component';
//import { TagInputModule } from 'ngx-chips';
//import { TagInputComponent } from 'src/component/shared/tag-input/tag-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from 'src/component/login/login.component';
import { SignUpComponent } from 'src/component/sign-up/sign-up.component';



import { YourOrganizationsComponent } from 'src/component/your-organizations/your-organizations.component';
import { LoginNavbarComponent } from 'src/component/shared/login-navbar/login-navbar.component';

import { HeaderComponent } from 'src/component/header/header.component';
import { FooterComponent } from 'src/component/footer/footer.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocialSignupComponent } from './social-signup/social-signup.component';
import { HtmlToPlaintextPipe } from './html-to-plaintext.pipe';
import { AppendTextPipe } from './append-text.pipe';
import { JoinPipe } from './join.pipe';
//import { ConvertTo12HourPipe } from './convert-to12-hour.pipe';
import { SharedModule } from './shared/shared.module';
import { Home1Component } from './home1/home1.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpConfigInterceptor} from '../app/interceptor/config.interceptor';
import { JobQuestionsComponent } from './job-questions/job-questions.component';
import { SimilarJobsComponent } from './similar-jobs/similar-jobs.component';
import { ClientLogoComponent } from 'src/component/client-logo/client-logo.component';
import { SubscribeToJobComponent } from 'src/component/portal/subscribe-to-job/subscribe-to-job.component';
import { SendJobInEmailComponent } from 'src/component/portal/send-job-in-email/send-job-in-email.component';
import { ApplicationJobQuestionsComponent } from './application-job-questions/application-job-questions.component';
import { ChatbotProfileSaveComponent } from './chatbot-profile-save/chatbot-profile-save.component';
import { GoogleAnalyticsService } from 'src/Services/google-analytics.service';

@NgModule({

  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ContactInformationPortalComponent,
    CountriesPortalComponent,
    EducationHistoryPortalComponent,
    SkillsPortalComponent,
    WorkHistoryPortalComponent,
    SignupConfirmationComponent,
    PortalHomeComponent,
    PortalJobsComponent,
    PortalJobComponent,
    UploadResumePortalComponent,
    PortalSubmissionStep1Component,
    PortalSubmissionStep2Component,
    SubmissionSuccessComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ActivateComponent,
    HeaderComponent,
    LandingComponent,
    FinalStepComponent,
    //TagInputComponent,
    LoginComponent,
    SignUpComponent,
    YourOrganizationsComponent,
    LoginNavbarComponent,
    FooterComponent,
    SocialLoginComponent,
    NotFoundComponent,
    SocialSignupComponent,
    HtmlToPlaintextPipe,
    AppendTextPipe,
    JoinPipe,
    Home1Component,
    JobQuestionsComponent,
    ApplicationJobQuestionsComponent,
    SimilarJobsComponent,
    SubscribeToJobComponent,
    SendJobInEmailComponent,
    ClientLogoComponent,
    ChatbotProfileSaveComponent
    //AutocompleteComponent
    //ConvertTo12HourPipe

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    LoadingBarHttpClientModule,
    NgxPhoneMaskModule,
    NgSelect2Module,
    NgbModule,
    //TagInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      enableHtml: true
    }),
    BsDatepickerModule.forRoot(),
    SharedModule
  ], 
  providers: [
    JobService, AuthGuardVendor, ErrorService,Title, GoogleAnalyticsService,
    {
      provide: "BASE_API_URL", useValue: "http://127.0.0.1:8093/api"
    },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
