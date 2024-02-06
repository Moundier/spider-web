export class Program {

  constructor(programId, imageHyperlink, title, numberUnique, classification, summary, objectives, defense, results, dateStart, dateFinal, publicationDate, completionDate, status, keywords) {
    this.programId = programId || null;
    this.imageHyperlink = imageHyperlink || ''; // TODO: Additional
    this.title = title;
    this.numberUnique = numberUnique || '';         // TODO: Unique Identifier
    this.classification = classification || Classification.DEFAULT;
    // this.description = '';
    this.summary = summary || '';              // TODO: Out of "description" attribute
    this.objectives = objectives || '';           // TODO: Out of "description" attribute
    this.defense = defense || 'Not informed';  // TODO: Out of "description" attribute
    this.results = results || '';              // TODO: Out of "description" attribute
    this.dateStart = dateStart || null;
    this.dateFinal = dateFinal || null;
    this.publicationDate = publicationDate || null;
    this.completionDate = completionDate || null;
    this.status = status || Status.DEFAULT;
    this.keywords = keywords || new Set();
  }
}

const Status = {
  DEFAULT: 'DEFAULT',
  SUSPENSO: 'SUSPENSO',
  CONCLUIDO_PUBLICADO: 'CONCLUIDO_PUBLICADO',
  CANCELADO: 'CANCELADO',
  EM_ANDAMENTO: 'EM_ANDAMENTO'
};

const Classification = {
  DEFAULT: 'DEFAULT',
  ENSINO: 'ENSINO',
  PESQUISA: 'PESQUISA',
  EXTENSAO: 'EXTENSAO',
  DESENVOLVIMENTO_INSTITUCIONAL: 'DESENVOLVIMENTO_INSTITUCIONAL'
};
