export type UserPublic = {
  id: number;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
  deleted_at?: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
};

export type UserUpdate = {
  name?: string;
  bio?: string;
  avatar?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
};
