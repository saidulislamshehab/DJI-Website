import jwt, { SignOptions } from "jsonwebtoken";

export interface ITokenPayload {
  id: string;
  email: string;
  role: "customer" | "admin";
  isVerified?: boolean;
}

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || "d1store_super_secure_jwt_secret_key_2026";
};

export const generateToken = (
  payload: ITokenPayload,
  expiresIn: string | number = "30d"
): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): ITokenPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as ITokenPayload;
};
