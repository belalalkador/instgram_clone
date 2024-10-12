import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password,10);
  } catch (error) {
    console.log(error);
  }
};

export const comparePasswords = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    console.log(error);
  }
};
