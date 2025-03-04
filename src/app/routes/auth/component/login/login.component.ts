import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from "../../../../standalone/components/header/header.service";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthLayoutComponent} from "../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../standalone/components/button/button.component";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import { AuthFacade } from '../../state/auth.facade';
import { LoginRequest } from '../../state/auth.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AuthLayoutComponent,
    ButtonComponent,
    RouterLink,
    NgIf
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
