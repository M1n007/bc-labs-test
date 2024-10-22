import { Transform } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn  } from 'typeorm';

@Entity('price_histories')
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token_name: string;

  @Column()
  chain: string;

  @Column('float')
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Transform(({ value }) => {
    if (!value) return value;
    const localTime = new Date(value);
    const offset = localTime.getTimezoneOffset();
    localTime.setMinutes(localTime.getMinutes() - offset);
    return localTime;
  })
  recorded_at: Date;
}
