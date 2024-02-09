enum AcademicRole {
  DOCENTE = "Faculty",
  DISCENTE = "Student",
  ADMINISTRATIVO = "Administrative staff"
}

enum MemberRole {
  QUALQUER_FUNCAO = "",
  COORDENADOR = "Coordenador",
  ORIENTADOR = "Orientador",
  BOLSISTA = "Bolsista",
  PARTICIPANTE = "Participante",
  COLABORADOR = "Colaborador",
  CO_ORIENTADOR = "Co-Orientador",
  APRESENTADOR = "Apresentador",
  AUTOR = "Autor",
  CO_AUTOR = "Co-Autor",
  EXECUTOR = "Executor",
  ESTAGIARIO = "Estagiário",
  ACOMPANHANTE = "Acompanhante",
  MONITOR = "Monitor",
  PROFESSOR_CURSO = "Professor do Curso",
  TUTOR_CURSO = "Tutor do Curso",
  NAO_DEFINIDA_OUTRA_FUNCAO = "Não Definida Outra Função",
  PESQUISADOR = "Pesquisador",
  INSTRUTOR_CURSO = "Instrutor do Curso",
  PALESTRANTE = "Palestrante",
  FISCAL_FINANCEIRO = "Fiscal Financeiro",
  RESPONSAVEL_TECNICO = "Responsável Técnico",
  COORDENADOR_ACADEMICO = "Coordenador Acadêmico",
  COORDENADOR_ADMINISTRATIVO = "Coordenador Administrativo"
}

interface Member {
  id: number | null;
  name: string | null;
  matricula: string | null; // unique
  vinculo: AcademicRole | null; // role
  vinculoStatus: string | null;
  email: string | null; // unique 
  lotacaoExercicio: string | null;
  lotacaoOficial: string | null;
  memberRole: MemberRole | null; // role
  cargaHoraria: string | null;
  periodo: string | null;
  recebeBolsa: string | null;
  curso: string | null;
  bolsa: string | null;
  valor: string | null;
}