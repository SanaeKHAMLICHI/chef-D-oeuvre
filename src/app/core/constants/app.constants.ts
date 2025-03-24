export const API_URL = 'http://localhost:9001/greenswap';
export const MAX_IMAGES = 10;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CATEGORIES = [
  { value: 'meubles', label: 'Meubles' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'luminaires', label: 'Luminaires' }
];

export const FORM_ERRORS = {
  required: 'Ce champ est requis',
  pattern: 'Format invalide',
  minlength: 'Trop court',
  maxlength: 'Trop long',
  min: 'Valeur minimale atteinte',
  max: 'Valeur maximale dépassée'
}; 