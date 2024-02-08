export class Program {

  public programId: number;
  public imageHyperlink;
  public title;
  public numberUnique;
  public classification;
  public summary;
  public objectives;
  public defense;
  public results;
  public dateStart;
  public dateFinal;
  public publicationDate;
  public completionDate;
  public status;
  public keywords;

  constructor(
    programId: number, 
    imageHyperlink: string, 
    title: string, 
    numberUnique: string, 
    classification: Classification, 
    summary: string, 
    objectives: string, 
    defense: string, 
    results: string, 
    dateStart: string, 
    dateFinal: string, 
    publicationDate: string, 
    completionDate: string, 
    status: Status, 
    keywords: Set<string>
  ) {
    this.programId = programId;
    this.imageHyperlink = imageHyperlink || ''; // TODO: Additional
    this.title = title;
    this.numberUnique = numberUnique || '';         // TODO: Unique Identifier
    this.classification = classification || Classification.DEFAULT;
    this.summary = summary || '';              // TODO: Out of "description" attribute
    this.objectives = objectives || '';           // TODO: Out of "description" attribute
    this.defense = defense || 'Not informed';  // TODO: Out of "description" attribute
    this.results = results || '';              // TODO: Out of "description" attribute
    this.dateStart = dateStart || null;
    this.dateFinal = dateFinal || null;
    this.publicationDate = publicationDate || null;
    this.completionDate = completionDate || null;
    this.status = status || Status.DEFAULT;
    this.keywords = keywords || new Set<string>();
  }
}

enum Status {
  DEFAULT,
  SUSPENSO,
  CONCLUIDO_PUBLICADO,
  CANCELADO,
  EM_ANDAMENTO
}

enum Classification {
  DEFAULT,
  ENSINO,
  PESQUISA,
  EXTENSAO,
  DESENVOLVIMENTO_INSTITUCIONAL
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
