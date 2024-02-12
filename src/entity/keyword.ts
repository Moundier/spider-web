import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'keyword' })
export class Keyword {

  @PrimaryGeneratedColumn()
  public keywordId?: number;

  @Column({unique: true, nullable: false })
  public keywordName?: string;
}