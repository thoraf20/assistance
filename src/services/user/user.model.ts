import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BALCKLISTED = 'blacklisted'
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true, default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, default: UserStatus.INACTIVE })
  status: string;

  @Column({ type: "timestamptz", nullable: true })
  last_login_at: Date;

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;
}