import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Assistance } from "./assistance.model";

export enum AssistanceStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed'
}

@Entity()
export class Donor extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  assistance_id: string

  @ManyToOne(() => Assistance, (assistance) => assistance.donor)
  @JoinColumn({ name: 'assistance_id', referencedColumnName: 'id' })
  assistance!: Assistance;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  donated_amount: number;

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;
}