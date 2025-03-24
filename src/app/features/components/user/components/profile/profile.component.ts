import {Component, OnInit, inject, signal, effect} from '@angular/core';
import { tap, map } from 'rxjs/operators';
import {CustomDatePipe} from "../../../../../standalone/pipe/custom-date.pipe";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ImageModalComponent} from "../../../../../standalone/components/image-modal/image-modal.component";
import {UserFacade} from "../../store/user.facade";
import {FormsModule} from "@angular/forms";
import {UserWithAnnouncementDto} from "../../models/user.model";
import {AnnouncementFacade} from "../../../announcements/store/announcements.facade";
import {AuthStore} from "../../../auth/store/auth.store";
import {AnnouncementDto} from "../../../announcements/models/announcement.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CustomDatePipe,
    MatIcon,
    NgForOf,
    NgIf,
    ImageModalComponent,
    FormsModule,
    NgClass
  ]
})
export class ProfileComponent implements OnInit {
  private announcementFacade = inject(AnnouncementFacade);
  private authStore = inject(AuthStore);
  userFacade = inject(UserFacade);

  router=inject(Router) ;
  route= inject(ActivatedRoute) ;
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  timestamp = signal(Date.now());
  isEditUsernameModalOpen = false;
  userId: number | null = null;
  connectedUser = this.authStore.getProfile;
  editedUsername = this.connectedUser().username;

  otherUser = signal<UserWithAnnouncementDto | null>(null);

  userAnnouncements$ = signal<AnnouncementDto[]>([]);
  isOwnProfile = signal<boolean>(true);
  hasAlreadyRated = signal(false);
  showRatingModal = false;
  note = 0;






  constructor() {
    effect(() => {
      this.timestamp.set(Date.now());
    });


 }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const profileId = idParam ? +idParam : null;
      this.userId = profileId;
      const currentUserId = this.connectedUser().id;

      if (profileId && profileId !== currentUserId) {
        this.isOwnProfile.set(false);

        // 👤 Charger les infos d’un autre utilisateur
        this.userFacade.getUserById(profileId).subscribe((data) => {
          this.otherUser.set(data);
          this.userAnnouncements$.set(data.announcements);
        });
      } else {
        // 👤 Profil connecté
        this.isOwnProfile.set(true);
        this.userAnnouncements$.set([]);

        this.announcementFacade.getAnnouncementByUser().pipe(
          map((res) => res.annonces),
          tap(annonces => this.userAnnouncements$.set(annonces))
        ).subscribe();
      }
    });
    this.userFacade.checkIfUserHasRated(this.userId!).subscribe((hasRated) => {
      this.hasAlreadyRated.set(hasRated);
    });
  }

  onDelete(id: number) {
    this.announcementFacade.deleteAnnouncement(id).subscribe({
      next: () => {
        const updated = this.userAnnouncements$().filter(a => a.id !== id);
        this.userAnnouncements$.set(updated);
      }
    });
  }


  navigateToAnnouncementForm(announcement: AnnouncementDto) {
     console.log(announcement);
    this.router.navigate(['/create'], { state: { announcement } });
  }

  openImageModal(mode: 'add' | 'edit'): void {
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeImageModal(): void {
    this.isModalOpen = false;
  }

  onImageSave(file: File) {
    this.userFacade.updateProfileImage(file, false).subscribe();
  }
  onDeleteImage() {
    this.userFacade.updateProfileImage(undefined, true).subscribe();
  }
  openEditUsernameModal() {
    this.editedUsername = this.connectedUser().username;
    this.isEditUsernameModalOpen = true;
  }

  closeEditUsernameModal() {
    this.isEditUsernameModalOpen = false;
  }

  saveUsername() {
    const newUsername = this.editedUsername.trim();
    if (!newUsername || newUsername === this.connectedUser().username) return;
    this.userFacade.updateUsername(newUsername).subscribe({
      next: () => {
        this.closeEditUsernameModal();
      },
    });
  }

  getProfileImage(): string {
    const image = this.isOwnProfile()
      ? this.connectedUser().image
      : this.otherUser()?.image;

    return image
      ? `http://localhost:9001/greenswap/${image}?t=${this.timestamp()}`
      : '/assets/profile.svg';
  }

  get averageRating(): number {
    const user = this.isOwnProfile() ? this.connectedUser() : this.otherUser();
    return user?.averageRating ?? 0;
  }



  submitRating(rating: number) {
    this.note = rating;

    this.userFacade.rateUser(this.userId!, rating).subscribe({
      next: () => {
        this.hasAlreadyRated.set(true); // 👈 met à jour le signal

        this.userFacade.getUserById(this.userId!).subscribe((updatedUser) => {
          this.otherUser.set(updatedUser);
        });
      },
      error: (err) => console.error('❌ Erreur lors de la note :', err),
    });
  }



}
