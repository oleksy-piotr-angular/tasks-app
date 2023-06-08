import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  isLoading: boolean = false;

  constructor(
    private http: HttpService,
    private notification: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signUpForm = this.fb.group(
      {
        email: this.fb.nonNullable.control(
          '',
          Validators.compose([
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}'),
            Validators.required,
          ])
        ),
        password: this.fb.nonNullable.control(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ])
        ),
        confirmPassword: this.fb.nonNullable.control(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }
  get getFormControl() {
    return this.signUpForm.controls;
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['mustMatch']
      ) {
        return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  proceedSignUp() {
    this.isLoading = true;
    if (this.signUpForm.valid) {
      const user = {
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };
      this.http.signUp(user).subscribe({
        next: (response) => {
          this.notification.showSuccess(response.message, 'INFO:');
          this.router.navigate(['signin']);
        },
        error: (err) => {
          this.notification.showError(err.error.message, 'ERROR:');
          this.isLoading = false;
          this.router.navigate(['register']);
        },
      });
    }
  }
}
