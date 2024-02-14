import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProgramEntity } from "../program";
import { AddressEntity } from "../address";

@Entity({ name:'program_address' })
export class ProgramToAddress {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => ProgramEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'programId' })
  program?: ProgramEntity;

  @ManyToOne(() => AddressEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'addressId' })
  address?: AddressEntity;
}