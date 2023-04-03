import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: false, type: 'varchar', length: 36 })
  userId: string;

  @Column({
    name: 'wallet_id',
    nullable: false,
    type: 'varchar',
    length: 36,
  })
  walletId: string;

  @Column({ name: 'value_transaction', nullable: false, type: 'int' })
  valueTransaction: number;

  @Column({ nullable: false, type: 'int' })
  action: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt: Date | null;

  @Column('varchar', { name: 'deleted_by', nullable: true, length: 36 })
  deletedBy: string | null;

  @Column('varchar', { name: 'created_by', length: 36 })
  createdBy: string;
}
