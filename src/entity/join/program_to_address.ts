import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Program } from "../program";
import { Address } from "../address";

@Entity()
export class ProgramToKeyword {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Program, { onDelete: "CASCADE" })
  program?: Program;

  @ManyToOne(() => Address, { onDelete: "CASCADE" })
  address?: Address;
}