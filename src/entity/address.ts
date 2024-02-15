import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'address' })
export class AddressEntity {

  @PrimaryGeneratedColumn()
  addressId?: number | null; // ****

  @Column({ nullable: true, unique: false, type: 'varchar' }) // TODO: Unique
  institutionUnit?: string | null; // NOTE: politecnico

  @Column({ nullable: true, unique: true, type: 'varchar' }) // TODO: Unique
  campus?: string; // sede

  @Column({ nullable: true, unique: false, type: 'varchar' }) // TODO: Unique
  university?: string | null; // federal university of santa maria

  @Column({ nullable: true, unique: true, type: 'varchar' }) // TODO: Unique
  abbreviation?: string | null; // ufsm

  @Column({ nullable: true, unique: false, type: 'varchar' })
  street?: string | null; // roraima

  @Column({ nullable: true, unique: false, type: 'varchar' })
  number?: string | null; // 1000

  @Column({ nullable: true, unique: false, type: 'varchar' })
  complement?: string | null;
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  zipCode?: string | null; // xxxxxxxx

  @Column({ nullable: true, unique: false, type: 'varchar' })
  district?: string | null; // camobi

  @Column({ nullable: true, unique: false, type: 'varchar' })
  city?: string | null; // santa maria
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  state?: string | null; // rio grande do sul
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  country?: string | null; // brazil
}