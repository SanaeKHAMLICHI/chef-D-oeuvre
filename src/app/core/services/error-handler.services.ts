import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

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

  getErrorMessage(controlName: string, errors: any): string {
    if (!errors) return '';

    if (errors.required) return 'Ce champ est requis';

    if (controlName === 'postalCode') {
      if (errors.pattern) return 'Le code postal doit contenir uniquement des chiffres';
      if (errors.minlength || errors.maxlength) return 'Le code postal doit contenir exactement 5 chiffres';
    }

    // Autres champs génériques
    if (errors.pattern) return 'Format invalide';
    if (errors.minlength) return `Minimum ${errors.minlength.requiredLength} caractères`;
    if (errors.maxlength) return `Maximum ${errors.maxlength.requiredLength} caractères`;
    if (errors.email) return 'Email invalide';
    if (errors.min) return `La valeur minimale est ${errors.min.min}`;
    if (errors.max) return `La valeur maximale est ${errors.max.max}`;

    return 'Erreur de validation';
  }

}
