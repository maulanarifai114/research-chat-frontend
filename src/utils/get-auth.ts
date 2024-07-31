export interface Auth {
  id?: string;
  username: string;
  fullName: string;
}

export const getAuth = (): Auth | null => {
  const user = localStorage.getItem("user");
  return JSON.parse(user ?? "null");
};
