export const generateId = () => {
  // Generate from alphaabet and numbers
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let id = "";
  for (let index = 0; index < 16; index++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
};
