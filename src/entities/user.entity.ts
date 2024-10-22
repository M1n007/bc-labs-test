import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('users')
@Unique('USERS_EMAIL_UNIQUE', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 150 })
  password: string;

  @Column({ default: true })
  is_active: boolean;
}
