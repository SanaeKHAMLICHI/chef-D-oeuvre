import {inject, Injectable} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  meta= inject(Meta)
  title=inject(Title)

  /**
   * Met à jour les métadonnées pour une page
   * @param config Configuration des métadonnées
   */
  updateMetaTags(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    const defaultTitle = 'Greenswap - Votre plateforme d\'échange et de vente d\'objets';
    const defaultDescription = 'Trouvez et échangez facilement des objets près de chez vous';
    const defaultImage = 'assets/images/logo.png';
    const defaultUrl = 'https://greenswap.com';

    // Mise à jour du titre
    this.title.setTitle(config.title ?? defaultTitle);

    // Mise à jour des méta-tags
    this.meta.updateTag({ name: 'description', content: config.description ?? defaultDescription });
    this.meta.updateTag({ name: 'keywords', content: 'échange, vente, objets, marketplace, recyclage' });

    // Mise à jour des Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: config.title ?? defaultTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description ?? defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: config.image ?? defaultImage });
    this.meta.updateTag({ property: 'og:url', content: config.url ?? defaultUrl });
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
  }
  /**
   * Réinitialise les métadonnées aux valeurs par défaut
   */
  resetMetaTags(): void {
    this.updateMetaTags({});
  }
}
