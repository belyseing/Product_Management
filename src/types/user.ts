export interface User {
  id: number;
  username: string;
  email?: string;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
}


export interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}
