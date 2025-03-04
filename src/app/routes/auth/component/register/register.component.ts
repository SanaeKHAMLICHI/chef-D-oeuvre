import { Component, OnInit, inject } from '@angular/core';
import { AuthLayoutComponent } from '../../../../standalone/components/auth-layout/auth-layout.component';
import { ButtonComponent } from '../../../../standalone/components/button/button.component';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthFacade } from '../../state/auth.facade';
import { RegisterRequest, CompanyRequestDto } from '../../state/auth.model';
import { Router } from '@angular/router';

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
  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  isCompany: boolean = false;

  userForm = this.fb.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')]],
    confirmPassword: ['', Validators.required],
  });

  companyForm = this.fb.group({
    companyName: [{ value: '', disabled: true }, Validators.required],
    siret: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    kbis: [null, Validators.required],
    address: [{ value: '', disabled: true }, Validators.required],
    city: [{ value: '', disabled: true }, Validators.required],
    postalCode: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    description: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$')]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit() {
    this.disableCompanyFields();
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
    this.isCompany ? (disable(this.userForm), enable(this.companyForm), this.disableCompanyFields()) : (enable(this.userForm), disable(this.companyForm));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      this.companyForm.patchValue({ kbis: file });
      this.companyForm.get('kbis')?.markAsTouched();
    } else {
      console.error('Fichier non valide');
    }
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
        },
        error: () => this.disableCompanyFields()
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
          companyName: this.companyForm.get('companyName')?.value || '',
          siret: this.companyForm.get('siret')?.value || '',
          kbis: this.companyForm.controls.kbis?.value as unknown as File,
          address: this.companyForm.get('address')?.value || '',
          city: this.companyForm.get('city')?.value || '',
          postalCode: parseInt(this.companyForm.get('postalCode')?.value || '0', 10),
          description: this.companyForm.get('description')?.value || '',
          username: this.companyForm.get('username')?.value || '',
          email: this.companyForm.get('email')?.value || '',
          password: this.companyForm.get('password')?.value || ''
        };
      
        this.authFacade.submitCompanyRequest(this.createFormData(requestData) as unknown as CompanyRequestDto).subscribe({
          next: () => this.router.navigateByUrl('/auth/login'),
          error: (error) => console.error('Erreur:', error)
        });
      }
    }else {
      if (this.userForm.valid) {
        console.log(this.userForm.value);
        const { confirmPassword, ...registerData } = this.userForm.value;
        console.log(registerData);

        this.authFacade.register(registerData as RegisterRequest).subscribe({
          next: () => this.router.navigateByUrl('/auth/login'),
          error: (error) => console.error('Erreur:', error)
        });
      }
  }
}

getPasswordErrorMessage() {
  const passwordControl = this.isCompany ? this.companyForm.controls['password'] : this.userForm.controls['password'];
  if (passwordControl.hasError('required')) {
    return 'Veuillez entrer un mot de passe';
  }
  if (passwordControl.hasError('minlength')) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  if (passwordControl.hasError('pattern')) {
    return 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial';
  }
  return '';
}
getEmailErrorMessage() {
  const emailControl = this.isCompany ? this.companyForm.controls['email'] : this.userForm.controls['email'];
  if (emailControl.hasError('required')) {
    return 'Veuillez entrer votre email';
  }
  return emailControl.hasError('pattern') ? 'Veuillez entrer un email valide' : '';
}
}
