export interface Program {
  programId: number; // unique 
  imageSource?: string;
  title: string | null;
  numberUnique?: string; // unique 
  classification: Classification;
  summary?: string | null;
  objectives?: string | null;
  defense?: string | null;
  results?: string | null;
  dateStart?: string | null;
  dateFinal?: string | null;
  publicationDate?: string | null;
  completionDate?: string | null;
  status: Status;
  keywords?: Set<string>; // unique
}

enum Status {
  DEFAULT = 'DEFAULT',
  SUSPENSO = 'SUSPENSO',
  CONCLUIDO_PUBLICADO = 'CONCLUIDO_PUBLICADO',
  CANCELADO = 'CANCELADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO'
}

enum Classification {
  DEFAULT = 'DEFAULT',
  ENSINO = 'ENSINO',
  PESQUISA = 'PESQUISA',
  EXTENSAO = 'EXTENSAO',
  DESENVOLVIMENTO_INSTITUCIONAL = 'DESENVOLVIMENTO_INSTITUCIONAL'
}

// const Status = {
//   DEFAULT: 'DEFAULT',
//   SUSPENSO: 'SUSPENSO',
//   CONCLUIDO_PUBLICADO: 'CONCLUIDO_PUBLICADO',
//   CANCELADO: 'CANCELADO',
//   EM_ANDAMENTO: 'EM_ANDAMENTO'
// };

// const Classification = {
//   DEFAULT: 'DEFAULT',
//   ENSINO: 'ENSINO',
//   PESQUISA: 'PESQUISA',
//   EXTENSAO: 'EXTENSAO',
//   DESENVOLVIMENTO_INSTITUCIONAL: 'DESENVOLVIMENTO_INSTITUCIONAL'
// };
