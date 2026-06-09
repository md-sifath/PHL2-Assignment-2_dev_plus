import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IUser } from "./user-interface";

const userSignupIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [name, email, hashPassword, role],
  );

  const userInfo = result.rows[0];
  delete userInfo.password;
  return userInfo;
};

export const authService = {
  userSignupIntoDB,
};
