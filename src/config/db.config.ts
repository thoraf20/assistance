import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { User } from "../services/user/user.model"
import { OTP } from "../services/otp/otp.model"
import { Category } from "../services/category/category.model"
import { Assistance } from "../services/assistance/assistance.model"
import { Donor } from "../services/donation/donor.model"
dotenv.config()

export const myDataSource = new DataSource({
  type: "postgres",
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [
   User, OTP, Category,
   Assistance, Donor
  ],
  migrations: [/*...*/],
  // migrationsTableName: "custom_migration_table",
  logging: true,
  synchronize: true,
  // ssl: {
  //   "rejectUnauthorized": false
  // },
})