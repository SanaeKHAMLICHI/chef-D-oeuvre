import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {AnnouncementDto, AnnouncementFiltersDto, PaginationMetaDto, AnnouncementResponse} from "./item.model";
import { Injectable } from '@angular/core';


interface AnnouncementState {
  announcements: AnnouncementDto[];
  searchField: string;
  announcementsFilters: AnnouncementFiltersDto;
  pagination: PaginationMetaDto;
}

const initialState: AnnouncementState = {
  announcements: [],
  searchField: '',
  announcementsFilters: {
    location: '',
    category: '',
  },
  pagination: {
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    size: 8,
  }

};

export const AnnouncementStore = signalStore(
  { providedIn: 'root' },
  withDevtools('announcements'),
  withStorageSync('announcements'),
  withState(initialState),
  withComputed((state) => ({
    getAnnouncement: computed(() => state.announcements()),
    getSearchFilter: computed(() => state.searchField()),
    getFilters: computed(() => state.announcementsFilters()),
    getPagination: computed(() => state.pagination()),
  })),
  withMethods((announcement) => {
    return {
      addFilterSearch(search: string): void {
        patchState(announcement, (state) => ({
          ...state,
          searchField: search,
        }));
      },
      addFilter(
        location: '',
        categories: string[]
      ): void {
        patchState(announcement, (state) => ({
          ...state,
          itemsFilters: {
            location: location,
            categories: categories
          },
        }));
      },
      setAnnouncementsPaginated(
        announcementsPaginated: AnnouncementResponse,
      ): void {
        console.log('announcementsPaginated', announcementsPaginated);
        patchState(announcement, (state) => {
          return {
            ...state,
            pagination: {
              totalElements: announcementsPaginated.totalElements,
              currentPage: announcementsPaginated.currentPage,
              totalPages: announcementsPaginated.totalPages,
              size: announcementsPaginated.size,
            },   
            announcements: announcementsPaginated.annonces,
          };
        });
      },
      clearFilters(): void {
        patchState(announcement, (state) => ({
          ...state,
          searchField: '',
          announcementsFilters: {
            location: '',
            category: '',
          },
        }));
      },
      setAnnouncements(
        announcements: AnnouncementDto[],
      ): void {
        patchState(announcement, (state) => ({
          ...state,
          announcements: announcements,
        }));
      },
    };
  }),
);
