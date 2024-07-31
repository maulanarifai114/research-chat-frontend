import { generateId } from "./generate-id";
import { Auth } from "./get-auth";

export const setAuth = (auth: Auth | null) => {
  if (auth) localStorage.setItem("user", JSON.stringify({ ...auth, id: generateId() }));
  else localStorage.removeItem("user");
};
