export interface Auth {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export const getAuth = (): Auth | null => {
  const user = localStorage.getItem("user");
  return JSON.parse(user ?? "null");
};
