export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  avatar?: string;
  createdAt?: string;
}

// Данные формы (без id, он генерируется на сервере / mockapi)
export type UserFormData = Omit<User, 'id' | 'createdAt'>;
