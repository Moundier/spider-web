export class Member {
  constructor(
    id,
    name,
    matricula,
    vinculo,
    vinculoStatus,
    email,
    lotacaoExercicio,
    lotacaoOficial,
    memberRole, // function
    cargaHoraria,
    periodo,
    recebeBolsa,
    curso,
    bolsa,
    valor
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

const AcademicRole = {
  DOCENTE, // Faculty
  DISCENTE, // Student
  ADMINISTRATIVO // Administrative staff
}

const MemberRole = {
  AUTOR, // Author
  PARTICIPANTE, // Participant
  COAUTOR, // Co-author
  COORDENADOR, // Coordinator
  PESQUISADOR, // Researcher
  PALESTRANTE, // Speaker
  ORGANIZADOR // Event organizer
}