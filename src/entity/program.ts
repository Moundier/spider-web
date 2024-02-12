import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({ name: 'program' })
export class Program extends BaseEntity {

  @PrimaryGeneratedColumn()
  programId!: number;

  @Column({ nullable: true })
  imageSource!: string | null;

  @Column({ nullable: true })
  domainImageSource!: string | null;

  @Column({ nullable: true })
  title!: string | null;

  @Column({ unique: true })
  numberUnique!: string;

  @Column({ default: 'DEFAULT' })
  classification!: Classification;

  @Column({ nullable: true })
  summary!: string | null;

  @Column({ nullable: true })
  objectives!: string | null;

  @Column({ nullable: true })
  defense!: string | null;

  @Column({ nullable: true })
  results!: string | null;

  @Column({ nullable: true })
  dateStart!: string | null;

  @Column({ nullable: true })
  dateFinal!: string | null;

  @Column({ default: 'DEFAULT' })
  status!: Status;

  @Column({ nullable: true })
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