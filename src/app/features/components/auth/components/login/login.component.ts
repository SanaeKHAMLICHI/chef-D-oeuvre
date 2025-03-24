import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthFacade} from "../../store/auth.facade";
import {LoginRequest} from "../../models/auth.model";
import {AuthLayoutComponent} from "../../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";
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
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private router: Router
  ){}


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
