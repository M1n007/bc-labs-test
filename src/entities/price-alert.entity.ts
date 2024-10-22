import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price_alerts')
export class PriceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token_name: string;

  @Column()
  chain: string;

  @Column('float')
  target_price: number;

  @Column()
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
