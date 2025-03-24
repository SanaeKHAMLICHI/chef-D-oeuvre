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
import {AnnouncementDto, AnnouncementFiltersDto, PaginationMetaDto, AnnouncementResponse , CategoryDto} from "../models/announcement.model";


interface AnnouncementState {
  announcements: AnnouncementDto[];
  ecoAnnouncements: AnnouncementDto[];
  searchField: string;
  searchFieldEco: string,
  ecoFilterLocation: string,
  announcementsFilters: AnnouncementFiltersDto;
  pagination: PaginationMetaDto;
  ecoPagination: PaginationMetaDto;
  categories: CategoryDto[];
}

const initialState: AnnouncementState = {
  announcements: [],
  ecoAnnouncements: [],
  searchField: '',
  searchFieldEco: '',
  ecoFilterLocation: '',
  announcementsFilters: {
    location: '',
    category: '',
  },
  pagination: {
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    size: 8,
  },
  ecoPagination: {
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    size: 8,
  },
  categories: [],

};

export const AnnouncementStore = signalStore(
  { providedIn: 'root' },
  withDevtools('announcements'),
  withStorageSync('announcements'),
  withState(initialState),
  withComputed((state) => ({
    getAnnouncement: computed(() => state.announcements()),
    getEcoAnnouncement: computed(() => state.ecoAnnouncements()),
    getSearchFilter: computed(() => state.searchField()),
    getSearchEcoFilter: computed(() => state.searchField()),
    getLocationFilter: computed(() => state.announcementsFilters().location),
    getCategoryFilter: computed(() => state.announcementsFilters().category),
    getEcoLocationFilter: computed(() => state.ecoFilterLocation()),
    getPagination: computed(() => state.pagination()),
    getEcoPagination: computed(() => state.ecoPagination()),
  })),
  withMethods((announcement) => {
    return {
      addFilterSearch(search: string): void {
        console.log(search);
        patchState(announcement, (state) => ({
          ...state,
          searchField: search,
        }));
      },
      addFilterSearchEco(search: string): void {
        console.log(search);

        patchState(announcement, state => ({
          ...state,
          searchFieldEco: search,
        }));
      },
      addEcoFilter(location: string): void {
        patchState(announcement, (state) => ({
          ...state,
          ecoFilterLocation: location
        }));
      },
      addFilter(
        location: string,
        category: string
      ): void {
        patchState(announcement, (state) => {
          const newState = {
            ...state,
            announcementsFilters: {
              location: location,
              category: category
            },
          };
          console.log('Store - Nouvel état:', newState);
          return newState;
        });
      },
      setAnnouncementsPaginated(
        announcementsPaginated: AnnouncementResponse,
      ): void {
        patchState(announcement, (state) => {
          return {
            ...state,
            pagination: {
              totalElements: announcementsPaginated.totalElements,
              currentPage: announcementsPaginated.currentPage,
              totalPages: announcementsPaginated.totalPages,
              size: announcementsPaginated.pageSize,
            },
            announcements: announcementsPaginated.annonces,
          };
        });
      },
      setEcoAnnouncementsPaginated(
        announcementsPaginated: AnnouncementResponse,
      ): void {
        patchState(announcement, (state) => {
          return {
            ...state,
            ecoPagination: {
              totalElements: announcementsPaginated.totalElements,
              currentPage: announcementsPaginated.currentPage,
              totalPages: announcementsPaginated.totalPages,
              size: announcementsPaginated.pageSize,
            },
            ecoAnnouncements: announcementsPaginated.annonces,
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
      clearEcoFilters(): void {
        patchState(announcement, (state) => ({
          ...state,
          searchFieldEco: '',
          ecoFilterLocation: '',
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
      setCategories(categories: CategoryDto[]): void {
        patchState(announcement, (state) => ({
          ...state,
          categories: categories,
        }));
      },
      setCurrentPage(page: number): void {
        patchState(announcement, (state) => ({
          ...state,
          pagination: {
            ...state.pagination,
            currentPage: page
          }
        }));
      },
      setEcoCurrentPage(page: number): void {
        patchState(announcement, (state) => ({
          ...state,
          ecoPagination: {
            ...state.ecoPagination,
            currentPage: page
          }
        }));
      }

    };
  }),
);
