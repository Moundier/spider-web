import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'address' })
export class AddressEntity {

  @PrimaryGeneratedColumn()
  addressId?: number; // ****

  @Column({ nullable: true, unique: false, type: 'varchar' }) // TODO: Unique
  institutionUnit?: string; // NOTE: politecnico

  @Column({ nullable: true, unique: true, type: 'varchar' }) // TODO: Unique
  campus?: string; // sede

  @Column({ nullable: true, unique: false, type: 'varchar' }) // TODO: Unique
  university?: string; // federal university of santa maria

  @Column({ nullable: true, unique: true, type: 'varchar' }) // TODO: Unique
  abbreviation?: string; // ufsm

  @Column({ nullable: true, unique: false, type: 'varchar' })
  street?: string; // roraima

  @Column({ nullable: true, unique: false, type: 'varchar' })
  number?: string; // 1000

  @Column({ nullable: true, unique: false, type: 'varchar' })
  complement?: string;
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  zipCode?: string; // xxxxxxxx

  @Column({ nullable: true, unique: false, type: 'varchar' })
  district?: string; // camobi

  @Column({ nullable: true, unique: false, type: 'varchar' })
  city?: string; // santa maria
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  state?: string; // rio grande do sul
  
  @Column({ nullable: true, unique: false, type: 'varchar' })
  country?: string; // brazil
}