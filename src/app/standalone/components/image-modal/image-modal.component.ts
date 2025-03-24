import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [
    MatIcon,
    NgIf
  ],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  isModalOpen = false;
  selectedFile: File | null = null;

  @Input() mode: 'add' | 'edit' | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<File>();
  @Output() delete = new EventEmitter<void>(); // ✅ nouvel event


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  closeModal(): void {
    this.close.emit();
    this.isModalOpen = false;
  }

  onSave(): void {
    if (this.selectedFile) {
      this.save.emit(this.selectedFile);
      this.closeModal();
    }
  }

  onDeleteImage(): void {
    this.delete.emit(); // ✅ déclenche la suppression
    this.closeModal();
  }
}
