import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({ name: 'program' })
export class ProgramEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  programId!: number | null;

  @Column({ nullable: true, type: 'varchar' })
  imageSource!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  domainImageSource!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  title!: string | null;

  @Column({ unique: true, type: 'varchar' })
  numberUnique!: string;

  @Column({ default: 'DEFAULT', type: 'varchar' })
  classification!: Classification;

  @Column({ nullable: true, type: 'varchar' })
  summary!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  objectives!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  defense!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  results!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  dateStart!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  dateFinal!: string | null;

  @Column({ default: 'DEFAULT', type: 'varchar' })
  status!: Status;

  @Column({ nullable: true, type: 'varchar' })
  hyperlink!: string;
}

export enum Status {
  DEFAULT = 'DEFAULT',
  SUSPENSO = 'SUSPENSO',
  CONCLUIDO_PUBLICADO = 'CONCLUIDO_PUBLICADO',
  CANCELADO = 'CANCELADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO'
}

export enum Classification {
  DEFAULT = 'DEFAULT',
  ENSINO = 'ENSINO',
  PESQUISA = 'PESQUISA',
  EXTENSAO = 'EXTENSAO',
  DESENVOLVIMENTO_INSTITUCIONAL = 'DESENVOLVIMENTO_INSTITUCIONAL'
}

// revista ??

// edital
// tcc
// artigo cientifico
// reportagem
// minicurso

// graduacao, mestrado, doutorado