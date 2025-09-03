export interface HateoasLink {
  rel: string;
  href: string;
  method: string;
}

export interface HateoasResponse<T> {
  data: T;
  links: HateoasLink[];
}

export class HateoasHelper {
  static createFilmeLinks(filmeId: number): HateoasLink[] {
    return [
      { rel: 'self', href: `/filmes/${filmeId}`, method: 'GET' },
      { rel: 'update', href: `/filmes/${filmeId}`, method: 'PUT' },
      { rel: 'delete', href: `/filmes/${filmeId}`, method: 'DELETE' },
      { rel: 'atores', href: `/filmes/${filmeId}/atores`, method: 'GET' },
      { rel: 'add-ator', href: `/filmes/${filmeId}/atores`, method: 'POST' },
      { rel: 'all-filmes', href: '/filmes', method: 'GET' },
    ];
  }

  static createAtorLinks(atorId: number): HateoasLink[] {
    return [
      { rel: 'self', href: `/atores/${atorId}`, method: 'GET' },
      { rel: 'update', href: `/atores/${atorId}`, method: 'PUT' },
      { rel: 'delete', href: `/atores/${atorId}`, method: 'DELETE' },
      { rel: 'all-atores', href: '/atores', method: 'GET' },
    ];
  }

  static createFilmesCollectionLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: '/filmes', method: 'GET' },
      { rel: 'create', href: '/filmes', method: 'POST' },
    ];
  }

  static createAtoresCollectionLinks(): HateoasLink[] {
    return [
      { rel: 'self', href: '/atores', method: 'GET' },
      { rel: 'create', href: '/atores', method: 'POST' },
    ];
  }
}
