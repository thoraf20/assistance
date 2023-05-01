import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity()
export class OTP extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: false })
  code: string;

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;
}