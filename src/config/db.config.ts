import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { User } from "../services/user/user.model"
import { OTP } from "../services/otp/otp.model"
dotenv.config()

export const myDataSource = new DataSource({
  type: "postgres",
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [
   User, OTP
  ],
  migrations: [/*...*/],
  // migrationsTableName: "custom_migration_table",
  logging: true,
  synchronize: true,
  // ssl: {
  //   "rejectUnauthorized": false
  // },
})