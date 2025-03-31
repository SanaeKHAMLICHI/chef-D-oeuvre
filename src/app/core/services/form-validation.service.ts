import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  constructor() { }

    emailValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value)
          ? null
          : { invalidEmail: { message: 'Format d\'email invalide' } };
      };
    }


    strongPasswordValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        return passwordRegex.test(value)
          ? null
          : {
            invalidPassword: {
              message: 'Le mot de passe doit contenir au moins 8 caractères, ' +
                'une majuscule, une minuscule, un chiffre et un caractère spécial'
            }
          };
      };
    }
      // Validateur de nom d'utilisateur
    usernameValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return usernameRegex.test(value)
          ? null
          : {
            invalidUsername: {
              message: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, _ et -)'
            }
          };
      };
    }

  postalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const postalCodeRegex = /^\d{5}$/;
      return postalCodeRegex.test(value)
        ? null
        : { invalidPostalCode: { message: 'Le code postal doit contenir 5 chiffres' } };
    };
  }


  noScriptValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const pattern = /<[^>]*script|<\/?[^>]+(>|$)/gi;
        return pattern.test(value)
          ? { scriptDetected: { message: 'Les balises HTML ou scripts sont interdits' } }
          : null;
      };
    }


  // Validation de la taille des fichiers
    fileSizeValidator(maxSize: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value;
        if (!file) return null;

        return file.size <= maxSize ? null : { fileTooLarge: true };
      };
    }
  // Validation du type de fichier
  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      return allowedTypes.includes(file.type) ? null : { invalidFileType: true };
    };
  }
  siretValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const siretRegex = /^\d{14}$/;

      return siretRegex.test(value)
        ? null
        : { invalidSiret: { message: 'Le numéro SIRET doit contenir exactement 14 chiffres' } };
    };
  }


  // Validateur de mot de passe avec confirmation
  passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordField)?.value;
      const confirmPassword = group.get(confirmPasswordField)?.value;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  // Validation de la longueur minimale
  minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return value.length >= minLength ? null : { minLength: true };
    };
  }

  // Validation de la longueur maximale
  maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return value.length <= maxLength ? null : { maxLength: true };
    };
  }
}
