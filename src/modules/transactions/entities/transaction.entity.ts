import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wallets')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'value_transaction', nullable: false, type: 'int' })
  valueTransaction: number;

  @Column({ nullable: false, type: 'int' })
  action: number;

  @Column({
    name: 'wallet_id',
    nullable: false,
    type: 'varchar',
    length: 36,
  })
  walletId: string;

  @CreateDateColumn({
    name: 'date_transaction',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public dateTransaction: Date;
}
