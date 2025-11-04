export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  username: string;
  name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface SignInInput {
  usernameOrEmail: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone_number?: string | null;
  created_at: Date;
  updated_at: Date;
}

