import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'address' })
export class Address {

  @PrimaryGeneratedColumn()
  addressId?: number; // ****

  @Column({ nullable: true, unique: false })
  institutionUnit?: string; // NOTE: politecnico

  @Column({ nullable: true, unique: false })
  campus?: string; // sede

  @Column({ nullable: true, unique: false })
  university?: string; // federal university of santa maria

  @Column({ nullable: true, unique: true })
  abbreviation?: string; // ufsm

  @Column({ nullable: true, unique: false })
  street?: string; // roraima

  @Column({ nullable: true, unique: false })
  number?: string; // 1000

  @Column({ nullable: true, unique: false })
  complement?: string;
  
  @Column({ nullable: true, unique: false })
  zipCode?: string; // xxxxxxxx

  @Column({ nullable: true, unique: false })
  district?: string; // camobi

  @Column({ nullable: true, unique: false })
  city?: string; // santa maria
  
  @Column({ nullable: true, unique: false })
  state?: string; // rio grande do sul
  
  @Column({ nullable: true, unique: false })
  country?: string; // brazil
}