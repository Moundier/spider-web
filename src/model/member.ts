enum AcademicRole {
  DOCENTE = "Faculty",
  DISCENTE = "Student",
  ADMINISTRATIVO = "Administrative staff"
}

enum MemberRole {
  AUTOR = "Author",
  PARTICIPANTE = "Participant",
  COAUTOR = "Co-author",
  COORDENADOR = "Coordinator",
  PESQUISADOR = "Researcher",
  PALESTRANTE = "Speaker",
  ORGANIZADOR = "Event organizer"
}

class Member {
  id: number;
  name: string;
  matricula: string; // unique
  vinculo: string;
  vinculoStatus: string;
  email: string; // unique 
  lotacaoExercicio: string;
  lotacaoOficial: string;
  memberRole: string; // Assuming it's a string, as it's not specified
  cargaHoraria: string;
  periodo: string;
  recebeBolsa: string;
  curso: string;
  bolsa: string;
  valor: string;

  constructor(
    id: number,
    name: string,
    matricula: string,
    vinculo: string,
    vinculoStatus: string,
    email: string,
    lotacaoExercicio: string,
    lotacaoOficial: string,
    memberRole: string, // function
    cargaHoraria: string,
    periodo: string,
    recebeBolsa: string,
    curso: string,
    bolsa: string,
    valor: string
  ) {
    this.id = id;
    this.name = name;
    this.matricula = matricula;
    this.vinculo = vinculo;
    this.vinculoStatus = vinculoStatus;
    this.email = email;
    this.lotacaoExercicio = lotacaoExercicio;
    this.lotacaoOficial = lotacaoOficial;
    this.memberRole = memberRole;
    this.cargaHoraria = cargaHoraria;
    this.periodo = periodo;
    this.recebeBolsa = recebeBolsa;
    this.curso = curso;
    this.bolsa = bolsa;
    this.valor = valor;
  }
}