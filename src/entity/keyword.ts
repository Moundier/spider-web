import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'keyword' })
export class KeywordEntity {

  @PrimaryGeneratedColumn()
  public keywordId?: number;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  public keywordName?: string;
}