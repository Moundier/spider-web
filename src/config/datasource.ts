import { DataSource, DataSourceOptions, EntitySchema, MixedList } from "typeorm";
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from "../config/environment";
import { ProgramEntity } from "../entity/program";
import { MemberEntity } from "../entity/member";
import { KeywordEntity } from "../entity/keyword";
import { AddressEntity } from "../entity/address";
import { ProgramToKeyword } from "../entity/join/program_to_keyword";
import { ProgramToAddress } from "../entity/join/program_to_address";
import { ProgramToMember } from "../entity/join/program_to_member";

// TODO: Define PostgreSQL tables
const tables: (string | Function | EntitySchema<any>)[] | undefined = [
  ProgramEntity, 
  KeywordEntity, 
  AddressEntity,
  MemberEntity, 
  ProgramToKeyword,
  ProgramToAddress,
  ProgramToMember,
];

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [...tables],
  synchronize: true,
};

export default new DataSource(dataSourceOptions);