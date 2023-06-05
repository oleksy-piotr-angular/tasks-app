import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { User } from '../models/user';
import { HttpService } from '../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  reactiveForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.reactiveForm = this.formBuilder.group(
      {
        email: new FormControl(
          '',
          Validators.compose([
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}'),
            Validators.required,
          ])
        ),
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ])
        ),
        confirmPassword: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  get getFormControl() {
    return this.reactiveForm.controls;
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
    if (this.reactiveForm.valid) {
      const user = {
        email: this.reactiveForm.value.email,
        password: this.reactiveForm.value.password,
      };
      this.http.signUp(user).subscribe((response) => {
        this.toastr.success(response.message);
        this.router.navigate(['signin']);
      });
    }
  }
}
