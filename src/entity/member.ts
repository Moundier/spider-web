import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({ name: 'member' })
export class Member extends BaseEntity {

  @PrimaryGeneratedColumn()
  memberId!: number;

  @Column({ nullable: true })
  name!: string | null;

  @Column({ nullable: true, unique: true })
  matricula!: string | null;

  @Column({ nullable: true })
  vinculo!: AcademicRole | null;

  @Column({ nullable: true })
  vinculoStatus!: string | null;

  @Column({ nullable: true, unique: true })
  email!: string | null;

  @Column({ nullable: true })
  imageSource!: string | null;

  @Column({ nullable: true })
  lotacaoExercicio!: string | null;

  @Column({ nullable: true })
  lotacaoOficial!: string | null;

  @Column({ nullable: true })
  memberRole!: MemberRole | null; // NOTE: to go

  @Column({ nullable: true })
  cargaHoraria!: string | null; // NOTE: to go

  @Column({ nullable: true })
  periodo!: string | null; // NOTE: to go

  @Column({ nullable: true })
  recebeBolsa!: string | null; // NOTE: to go

  @Column({ nullable: true })
  curso!: string | null;

  @Column({ nullable: true })
  bolsa!: string | null; // NOTE: to go

  @Column({ nullable: true })
  valor!: string | null; // NOTE: to go
}

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
