import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Program } from "../program";
import { Member } from "../member";

@Entity({ name:'program_address' })
export class ProgramHasAddress {

  // NOTE: This should be in program to memeber 

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Program, { onDelete: "CASCADE" })
  program?: Program;

  @ManyToOne(() => Member, { onDelete: "CASCADE" })
  member?: Member;

  @Column({ nullable: true })
  memberRole!: MemberRole | null; // NOTE: to go

  @Column({ nullable: true })
  cargaHoraria!: string | null; // NOTE: to go

  @Column({ nullable: true })
  periodo!: string | null; // NOTE: to go

  @Column({ nullable: true })
  recebeBolsa!: string | null; // NOTE: to go

  @Column({ nullable: true })
  bolsa!: string | null; // NOTE: to go

  @Column({ nullable: true })
  valor!: string | null; // NOTE: to go
}