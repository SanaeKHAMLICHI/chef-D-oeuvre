import { Injectable } from '@angular/core';

export interface Criterion {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  private states: Criterion[] = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'tres-bon', label: 'Très bon état' },
    { value: 'bon', label: 'Bon état' },
    { value: 'moyen', label: 'État moyen' },
    { value: 'a-renover', label: 'À rénover' }
  ];

  private colors: Criterion[] = [
    { value: 'blanc', label: 'Blanc' },
    { value: 'noir', label: 'Noir' },
    { value: 'gris', label: 'Gris' },
    { value: 'marron', label: 'Marron' },
    { value: 'beige', label: 'Beige' },
    { value: 'bleu', label: 'Bleu' },
    { value: 'vert', label: 'Vert' },
    { value: 'rouge', label: 'Rouge' },
    { value: 'jaune', label: 'Jaune' }
  ];

  private materials: Criterion[] = [
    { value: 'bois', label: 'Bois' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'plastique', label: 'Plastique' },
    { value: 'tissu', label: 'Tissu' },
    { value: 'cuir', label: 'Cuir' },
    { value: 'ceramique', label: 'Céramique' },
    { value: 'marbre', label: 'Marbre' }
  ];

  getStates(): Criterion[] {
    return this.states;
  }

  getColors(): Criterion[] {
    return this.colors;
  }

  getMaterials(): Criterion[] {
    return this.materials;
  }
} 