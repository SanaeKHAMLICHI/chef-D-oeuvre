import {inject, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  router= inject(Router)
  notificationService= inject(NotificationService)

  handleError(error: HttpErrorResponse): void {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          this.router.navigate(['/auth/login']);
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    this.notificationService.error(errorMessage);
    console.error('Erreur:', error);
  }

  getErrorMessage(errors: any): string {
    if (!errors) return '';

    const staticMessages: Record<string, string> = {
      required: 'Ce champ est requis',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      invalidFileType: 'Type de fichier non autorisé',
      fileTooLarge: 'Fichier trop volumineux',
      emailExists: 'Cet email est déjà utilisé',
      usernameExists: 'Ce nom d\'utilisateur est déjà utilisé',
      pattern: 'Format invalide',
      email: 'Email invalide'
    };

    for (const key in staticMessages) {
      if (errors[key]) return staticMessages[key];
    }

    const dynamicMessageKeys = [
      'invalidSiret',
      'invalidEmail',
      'invalidUsername',
      'invalidPassword',
      'invalidPostalCode',
      'scriptDetected',
      'sqlInjectionDetected'
    ];

    for (const key of dynamicMessageKeys) {
      const message = errors[key]?.message;
      if (message) return message;
    }

    if (errors.minlength?.requiredLength) {
      return `Minimum ${errors.minlength.requiredLength} caractères`;
    }

    if (errors.maxlength?.requiredLength) {
      return `Maximum ${errors.maxlength.requiredLength} caractères`;
    }

    if (errors.min?.min) {
      return `Valeur minimale : ${errors.min.min}`;
    }

    if (errors.max?.max) {
      return `Valeur maximale : ${errors.max.max}`;
    }

    return 'Erreur de validation';
  }



}
