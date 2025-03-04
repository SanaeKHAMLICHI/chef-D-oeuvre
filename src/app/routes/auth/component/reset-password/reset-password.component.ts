import { Component, inject } from '@angular/core';
import {AuthLayoutComponent} from "../../../../standalone/components/auth-layout/auth-layout.component";
import {ButtonComponent} from "../../../../standalone/components/button/button.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import { AuthFacade } from '../../state/auth.facade';
import { ResetPasswordDto } from '../../state/auth.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    ButtonComponent,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  router = inject(Router);
  authFacade = inject(AuthFacade);
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
  });

  submit() {
    console.log(this.form.value);
    console.log("submit");
    if (this.form.valid) {  
      this.authFacade.submitRequestPasswordReset(this.form.value as ResetPasswordDto).subscribe(() => {
        this.router.navigate(['/auth/verification-code']);
      });
    }
  }
}
