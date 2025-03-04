import { Component, OnInit } from '@angular/core';
import {AuthLayoutComponent} from "../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../standalone/components/button/button.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import { AuthFacade } from '../../state/auth.facade';
import { inject } from '@angular/core';
import { NewPasswordDto } from '../../state/auth.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  resetKey = history.state?.resetKey;

  form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')]],
    confirmPassword: ['', [Validators.required]]
  });

  canActivate(): boolean {
    const canAccess = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString().includes('verification-code') ?? false;
    if (!canAccess) {
      this.router.navigate(['/auth/verification-code']);
    }
    
    return canAccess;
  }

  onSubmit() {
    if (this.form.valid && this.form.controls.password.value === this.form.controls.confirmPassword.value) {
      const payload: NewPasswordDto = {
        newPassword: this.form.controls.password.value ?? '',
        resetKey: this.resetKey ?? 0
      };
      this.authFacade.finishPasswordReset(payload as NewPasswordDto).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }
}

