import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('prices')
@Index(['token_name'], { unique: true })
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token_name: string;

  @Column()
  chain: string;

  @Column('float')
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
