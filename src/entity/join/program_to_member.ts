import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProgramEntity } from "../program";
import { MemberEntity } from "../member";
import { MemberRole } from "../../model/member.dto";

@Entity({ name:'program_member' })
export class ProgramToMember {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => ProgramEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'programId' })
  program?: ProgramEntity;

  @ManyToOne(() => MemberEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'memberId' })
  member?: MemberEntity;

  @Column({ nullable: true, type: 'varchar' })
  memberRole?: MemberRole | string | null; // NOTE: to go

  @Column({ nullable: true, type: 'varchar' })
  cargaHoraria?: string | null; // NOTE: to go

  @Column({ nullable: true, type: 'varchar' })
  periodo?: string | null; // NOTE: to go

  @Column({ nullable: true, type: 'varchar' })
  recebeBolsa?: string | null; // NOTE: to go

  @Column({ nullable: true, type: 'varchar' })
  bolsa?: string | null; // NOTE: to go

  @Column({ nullable: true, type: 'varchar' })
  valor?: string | null; // NOTE: to go
}