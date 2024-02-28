import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { LoginComponent } from './login.component';
import { User } from './user.model';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from 'src/component/footer/footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let router:Router, user = <User> {
    username: 'demo@example.com',
    password: 'angularisbestandrockesLike@charmetc'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
          LoginComponent, FooterComponent 
        ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   /* it('should create', () => {
    expect(component).toBeTruthy();
  });  */

  it('should navigate to dashboard on successful login', () => {
    //arrange
    fixture.detectChanges();

    //set form model
    component.form.email = user.username;
    component.form.password = user.password;
    fixture.detectChanges();

    spyOn(router, 'navigate');
    
    //act
    component.onSubmit();
    fixture.detectChanges();

    //assert
    //expect(router.navigate).toHaveBeenCalledWith(['/candidate/dashboard']);

  }); 

});
