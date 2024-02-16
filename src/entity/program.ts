import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'program' })
export class ProgramEntity {

  @PrimaryGeneratedColumn()
  public programId?: number | null;

  @Column({ nullable: true, type: 'varchar' })
  public imageSource?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public domainImageSource?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public title?: string | null;

  @Column({ unique: true, type: 'varchar' })
  public numberUnique?: string;

  @Column({ default: 'DEFAULT', type: 'varchar' })
  public classification?: Classification | null;

  @Column({ nullable: true, type: 'varchar' })
  public summary?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public objectives?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public defense?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public results?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public dateStart?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public dateFinal?: string | null;

  @Column({ default: 'DEFAULT', type: 'varchar' })
  public status?: Status | null;

  @Column({ nullable: true, type: 'varchar' })
  public hyperlink?: string | null;
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