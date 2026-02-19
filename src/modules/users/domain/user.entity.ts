import { randomUUID } from 'node:crypto';

export interface UsersProps {
  id: string;
  name: string;
  email: string;
  password: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type CreateUserInput = Optional<
  UsersProps,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

type UpdateUserInput = Partial<
  Omit<UsersProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

export class User implements UsersProps {
  id: string;
  name: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  protected constructor(props: UsersProps) {
    Object.assign(this, props);
  }

  static create(props: CreateUserInput): User {
    return new User({
      ...props,
      id: props.id ?? randomUUID(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? null,
    });
  }

  update(props: UpdateUserInput): void {
    Object.assign(this, { ...props, updatedAt: new Date() });
  }
}
