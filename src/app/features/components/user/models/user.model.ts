import {AnnouncementDto} from "../../announcements/models/announcement.model";


export interface UserWithAnnouncementDto {
  announcements: AnnouncementDto[];
  userId: number;
  image: string;
  userName: string;
  announcementCount:number;
  averageRating:number;
}
