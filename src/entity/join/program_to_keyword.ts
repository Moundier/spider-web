import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProgramEntity } from "../program";
import { KeywordEntity } from "../keyword";

@Entity({ name:'program_keyword' })
export class ProgramToKeyword {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => ProgramEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'programId' })
  program?: ProgramEntity;

  @ManyToOne(() => KeywordEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'keywordId' })
  keyword?: KeywordEntity;
}