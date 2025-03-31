import { Component, OnInit, inject } from '@angular/core';
import {FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {AuthFacade} from "../../store/auth.facade";
import {CompanyRequestDto, RegisterRequest} from "../../models/auth.model";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";
import {AuthLayoutComponent} from "../../../../../standalone/components/auth-layout/auth-layout.component";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {FormValidationService} from "../../../../../core/services/form-validation.service";
import {ErrorHandlerService} from "../../../../../core/services/error-handler.services";


@Component({
    selector: 'app-register',
  standalone: true,
  imports: [
        AuthLayoutComponent,
        ButtonComponent,
        FormsModule,
        RouterLink,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
   fb = inject(NonNullableFormBuilder);
   authFacade = inject(AuthFacade);
   router = inject(Router);
  formValidationService = inject(FormValidationService);
  errorHandler = inject(ErrorHandlerService);

  isCompany: boolean = false;

  userForm = this.fb.group({
    username: ['', [Validators.required, this.formValidationService.usernameValidator()]],
    email: ['', [Validators.required, this.formValidationService.emailValidator()]],
    password: ['', [Validators.required, this.formValidationService.strongPasswordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.formValidationService.passwordMatchValidator('password', 'confirmPassword')
  });

  companyForm = this.fb.group({
    companyName: ['', Validators.required],
    siret: ['', [Validators.required, this.formValidationService.siretValidator()]],
    kbis: [null, [ Validators.required
        , this.formValidationService.fileTypeValidator(['application/pdf', 'image/jpeg', 'image/png']),
      this.formValidationService.fileSizeValidator(5 * 1024 * 1024)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, this.formValidationService.postalCodeValidator()]],
    description: ['', [Validators.required, this.formValidationService.noScriptValidator()]],
    username: ['', [Validators.required, this.formValidationService.usernameValidator()]],
    email: ['', [Validators.required, this.formValidationService.emailValidator()]],
    password: ['', [Validators.required, this.formValidationService.strongPasswordValidator()]],
    confirmPassword: ['', Validators.required ],
  }, {
    validators: this.formValidationService.passwordMatchValidator('password', 'confirmPassword')
  });

  ngOnInit() {
    this.disableCompanyFields();
    this.companyForm.get('siret')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.onSiretInput());
  }

  disableCompanyFields() {
    ['companyName', 'address', 'postalCode', 'city'].forEach(field => {
      this.companyForm.get(field)?.disable();
    });
  }

  toggleInput() {
    this.isCompany = !this.isCompany;
    const enable = (form: any) => Object.keys(form.controls).forEach(key => form.get(key)?.enable());
    const disable = (form: any) => Object.keys(form.controls).forEach(key => form.get(key)?.disable());
    if (this.isCompany) {
      disable(this.userForm);
      enable(this.companyForm);
      this.disableCompanyFields();
    } else {
      enable(this.userForm);
      disable(this.companyForm);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.companyForm.patchValue({ kbis: file });
    const kbisControl = this.companyForm.get('kbis');
    kbisControl?.markAsTouched();
    kbisControl?.updateValueAndValidity();
  }


  onSiretInput() {
    const siretControl = this.companyForm.get('siret');
    if (siretControl?.valid) {
      this.authFacade.getCompanyInfoBySiret(siretControl.value).subscribe({
        next: (data) => {
          this.companyForm.patchValue({
            companyName: data.companyName,
            address: `${data.numeroVoie} ${data.typeVoie} ${data.libelleVoie}`,
            postalCode: data.postalCode,
            city: data.city,
          });
          this.companyForm.get('siret')?.disable();
          console.log('[SIRET INPUT] API SUCCESS');

        },
        error: () => {
          this.disableCompanyFields()
          console.error('[SIRET INPUT] API FAILED');

        }
      });
    } else {
      this.disableCompanyFields();
    }
  }

  private createFormData(data: CompanyRequestDto): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'kbis' && value instanceof File) formData.append('kbis', value);
      else if (value !== null && value !== undefined) formData.append(key, value.toString());
    });
    return formData;
  }

  onSubmit() {
    console.log("onSubmit");
    if (this.isCompany) {
      if (this.companyForm.valid) {
        const requestData: CompanyRequestDto = {
          companyName: this.companyForm.get('companyName')?.value ?? '',
          siret: this.companyForm.get('siret')?.value ?? '',
          kbis: this.companyForm.controls.kbis?.value as unknown as File,
          address: this.companyForm.get('address')?.value ?? '',
          city: this.companyForm.get('city')?.value ?? '',
          postalCode: parseInt(this.companyForm.get('postalCode')?.value ?? '0', 10),
          description: this.companyForm.get('description')?.value ?? '',
          username: this.companyForm.get('username')?.value ?? '',
          email: this.companyForm.get('email')?.value ?? '',
          password: this.companyForm.get('password')?.value ?? ''
        };

        this.authFacade.submitCompanyRequest(
          this.createFormData(requestData) as unknown as CompanyRequestDto
        ).subscribe();

      }
    }else if (this.userForm.valid) {
      const {confirmPassword, ...registerData} = this.userForm.value;

      this.authFacade.register(registerData as RegisterRequest).subscribe();
    }
  }
getPasswordErrorMessage(form : FormGroup): string {
  const passwordControl = form.get('password');
  return this.errorHandler.getErrorMessage(passwordControl?.errors);
}
  getConfirmPasswordErrorMessage(): string {
    const passwordControl = this.userForm.controls.confirmPassword;
    return this.errorHandler.getErrorMessage(passwordControl?.errors);
  }
  // Méthode pour les erreurs d'email
  getEmailErrorMessage(form : FormGroup): string {
    const emailControl = form.get('email');
    return this.errorHandler.getErrorMessage(emailControl?.errors);
  }
  getUsernameErrorMessage(form : FormGroup): string {
    const usernameControl = form.get('username');
    return this.errorHandler.getErrorMessage(usernameControl?.errors);
  }
  getSiretErrorMessage(): string {
    const siretControl = this.companyForm.controls.siret;
    return this.errorHandler.getErrorMessage(siretControl?.errors);
  }
}
