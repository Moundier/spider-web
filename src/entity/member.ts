import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'member' })
export class MemberEntity {

  @PrimaryGeneratedColumn()
  memberId?: number | null;

  @Column({ nullable: true, type: 'varchar' })
  name?: string | null;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  matricula?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  vinculo?: AcademicRole | string | null;

  @Column({ nullable: true, type: 'varchar' })
  vinculoStatus?: string | null;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  email?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  imageSource?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lotacaoExercicio?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lotacaoOficial?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  curso?: string | null;
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
