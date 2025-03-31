import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {AuthFacade} from "../../store/auth.facade";
import {AuthLayoutComponent} from "../../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";

@Component({
    selector: 'app-verification-code',
    standalone: true,
    imports: [
        AuthLayoutComponent,
        ButtonComponent,
        FormsModule,
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './verification-code.component.html',
    styleUrl: './verification-code.component.css'
})
export class VerificationCodeComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authFacade = inject(AuthFacade);
  resetKey: number;

  constructor() {
    const state = history.state;
    this.resetKey = state.resetKey;
  }

  form = this.fb.group({
    resetKey: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^[0-9]+$')
    ]]
  });

  submit() {
    if (this.form.valid || this.form.get('resetKey')?.value?.length === 6) {
      const key = this.form.get('resetKey')?.value;
      this.authFacade.verifyPasswordReset(parseInt(key!, 10)).subscribe(() => {
          this.router.navigate(['/auth/change-password'], {
            state: { resetKey: parseInt(key!, 10) ?? 0 }
          });
       });
    }
  }
}

