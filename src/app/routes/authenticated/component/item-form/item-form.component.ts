import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CriteriaService } from '../../../../services/criteria.service';
import { ButtonComponent } from '../../../../standalone/components/button/button.component';

interface ImagePreview {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    ButtonComponent
  ],
  providers: [
    CriteriaService,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css'
})
export class ItemFormComponent {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  selectedImages: ImagePreview[] = [];
  criteriaService = inject(CriteriaService);
  states = this.criteriaService.getStates();
  colors = this.criteriaService.getColors();
  materials = this.criteriaService.getMaterials();

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      state: ['', Validators.required],
      color: ['', Validators.required],
      material: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.uploadForm.valueChanges.subscribe(value => {
      console.log('Form values changed:', value);
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    
    if (files) {
      const remainingSlots = 10 - this.selectedImages.length;
      const filesToAdd = Array.from<File>(files).slice(0, remainingSlots);

      filesToAdd.forEach((file: File) => {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          this.selectedImages.push({
            file: file,
            preview: e.target.result
          });
        };
        
        reader.readAsDataURL(file);
      });
    }

    // Réinitialiser l'input file pour permettre la sélection du même fichier
    event.target.value = '';
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      console.log('Form submitted:', this.uploadForm.value);
      console.log('Selected files:', this.selectedFiles);
    }
  }

  get categoryControl() {
    return this.uploadForm.get('category');
  }

  get isCategoryTouched(): boolean {
    return this.categoryControl?.touched || false;
  }

  get isCategoryRequired(): boolean {
    return this.categoryControl?.errors?.['required'] || false;
  }
}
