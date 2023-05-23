import { User } from "../../services/user/user.model";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Donor } from "../donation/donor.model";

export enum AssistanceStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed'
}

@Entity()
export class Assistance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  category_id: string;

  @Column({ nullable: false })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({"name": "user_id", referencedColumnName: 'id'})
  user: User

  @OneToMany(() => Donor, (donor) => donor.assistance)
  donor!: Donor[]

  @Column({ nullable: true, type:"simple-array", default: []}) 
  organizer: string[];

  @Column({ nullable: true, default: 'NGN' })
  currency: string;

  @Column({ nullable: true })
  beneficiary: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  purpose: string;

  @Column({ nullable: false })
  imgUrl: string;

  @Column({ nullable: false })
  target_amount: number;

  @Column({ nullable: true, default: 0 })
  donated_amount: number;

  @Column({ nullable: true, default: AssistanceStatus.ACTIVE })
  status: string;

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;
}