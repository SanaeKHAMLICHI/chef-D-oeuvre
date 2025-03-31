import {Component , inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators, FormBuilder} from "@angular/forms";
import {RouterLink, Router} from "@angular/router";
import {AuthFacade} from "../../store/auth.facade";
import {LoginRequest} from "../../models/auth.model";
import {AuthLayoutComponent} from "../../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";
import {FormValidationService} from "../../../../../core/services/form-validation.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AuthLayoutComponent,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb= inject(FormBuilder)
  authFacade =inject(AuthFacade);
  router = inject(Router);
  formValidationService = inject(FormValidationService);
  loginForm = this.fb.group({
    email: ['', [Validators.required,this.formValidationService.emailValidator()]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if(this.loginForm.valid) {
      this.authFacade.login(this.loginForm.value as LoginRequest)
      .subscribe(() => this.router.navigateByUrl('/'));
    } else {
      let errorMessage;
      if(this.loginForm.controls.email.hasError('pattern')) {
        errorMessage = 'Veuillez entrer un email valide';
      } else {
        errorMessage = 'Veuillez remplir tous les champs';
      }
      console.log("message" , errorMessage)
    }
  }
}
