export class Program {

  constructor() {
    this.id = null;
    this.logo = ''; // TODO: Additional
    this.title = '';
    this.numberUnique = '';         // TODO: Unique Identifier
    this.classification = Classification.DEFAULT;
    // this.description = '';
    this.summary = '';              // TODO: Out of "description" attribute
    this.objectives = '';           // TODO: Out of "description" attribute
    this.defense = 'Not informed';  // TODO: Out of "description" attribute
    this.results = '';              // TODO: Out of "description" attribute
    this.dateStart = null;
    this.dateFinal = null;
    this.publicationDate = null;
    this.completionDate = null;
    this.status = Status.DEFAULT;
    this.keywords = new Set();
  }
}

const Status = {
  DEFAULT,
  SUSPENSO,
  CONCLUIDO_PUBLICADO,
  CANCELADO,
  EM_ANDAMENTO
}

const Classification = {
  DEFAULT,
  ENSINO,
  PESQUISA,
  EXTENSAO,
  DESENVOLVIMENTO_INSTITUCIONAL
}
