import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Program } from "../program";
import { Keyword } from "../keyword";

@Entity()
export class ProgramToKeyword {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Program, { onDelete: "CASCADE" })
  program?: Program;

  @ManyToOne(() => Keyword, { onDelete: "CASCADE" })
  keyword?: Keyword;
}