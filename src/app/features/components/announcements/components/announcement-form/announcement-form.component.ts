import { NgFor, NgIf } from '@angular/common';
import {Component, inject, OnInit, Signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";
import {CriteriaService} from "../../../../../core/services/criteria.service";
import {AnnouncementDto, CategoryDto, CreateOrUpdateAnnouncementDto} from "../../models/announcement.model";
import {Router} from "@angular/router";
import {AnnouncementStore} from "../../store/announcements.store";
import {AnnouncementFacade} from "../../store/announcements.facade";

interface ImagePreview {
  file: File | null;
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
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.css'
})export class AnnouncementFormComponent implements OnInit {
  router = inject(Router);
  announcementStore = inject(AnnouncementStore);
  uploadForm: FormGroup;
  selectedImages: ImagePreview[] = [];
  criteriaService = inject(CriteriaService);
  states = this.criteriaService.getStates();
  colors = this.criteriaService.getColors();
  materials = this.criteriaService.getMaterials();
  categories$: Signal<CategoryDto[]> = this.announcementStore.categories;
  announcementFacade = inject(AnnouncementFacade);
  announcement: AnnouncementDto | null = null;


  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      state: ['', Validators.required],
      color: ['', Validators.required],
      material: ['', Validators.required],
      postalCode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$'),
        Validators.minLength(5),
        Validators.maxLength(5)
      ]],
      files: [this.selectedImages]
    });
  }

  ngOnInit() {
    // Vérifier si l'annonce est passée via `Router`
    const navigation = this.router.getCurrentNavigation();
    this.announcement = navigation?.extras.state?.['announcement'] || history.state.announcement || null;

    console.log("📌 Annonce récupérée :", this.announcement);

    if (this.announcement) {
      this.fillFormWithAnnouncement(this.announcement);
    }
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

    event.target.value = '';
  }


  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    console.log('Form submitted:', this.uploadForm.value);
    const formValue = this.uploadForm.value;
    const announcementData: CreateOrUpdateAnnouncementDto = {
      title: formValue.title,
      description: formValue.description,
      categoryId: Number(formValue.category),
      state: formValue.state,
      color: formValue.color,
      material: formValue.material,
      postalCode: formValue.postalCode,
      statut: "Active",
    };


    // ✅ Séparer les nouvelles images et les anciennes
    const newFiles: File[] = this.selectedImages
      .filter(image => image.file !== null)
      .map(image => image.file as File); // Convertir `File | null` en `File`

    const existingFiles: string[] = this.selectedImages
      .filter(image => image.file === null)
      .map(image => image.preview.replace('http://localhost:9001/greenswap/', '')); // Garder uniquement le chemin relatif

    console.log('🟢 Nouveaux fichiers:', newFiles);
    console.log('🟠 Fichiers existants:', existingFiles);

    if (this.uploadForm.valid) {
      console.log("announcementData, ", announcementData)
      console.log("test form valid")
      if(this.announcement){
        console.log("AnnouncementData", this.announcement);
        this.announcementFacade.updateAnnouncement(this.announcement.id, announcementData, newFiles, existingFiles).subscribe(() => {
          this.router.navigate(['/user']);
        });
      } else {
        this.announcementFacade.createAnnouncement(announcementData , newFiles).subscribe(() => {
          this.router.navigate(['/']);
        });
      }

    } else {
      // Ajoutons des logs pour voir quels champs sont invalides
      console.log('Form is invalid');
      Object.keys(this.uploadForm.controls).forEach(key => {
        const control = this.uploadForm.get(key);
        if (control?.errors) {
          console.log(`Field ${key} errors:`, control.errors);
        }
      });
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

  fillFormWithAnnouncement(announcement: AnnouncementDto) {
    this.uploadForm.patchValue({
      title: announcement.title,
      description: announcement.description,
      category: announcement.categoryId ? announcement.categoryId : undefined,
      state: announcement.state ? announcement.state.toLowerCase() : '',
      color: announcement.color ? announcement.color.toLowerCase() : '',
      material: announcement.material ? announcement.material.toLowerCase() : '',
      postalCode: announcement.postalCode
    });

    // Gérer les fichiers (URLs existantes)
    if (announcement.files && announcement.files.length > 0) {
      this.selectedImages = announcement.files.map(fileUrl => ({
        file: null,
        preview: `http://localhost:9001/greenswap/${fileUrl}`
      }));
    }
  }

}
