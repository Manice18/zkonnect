import jwt from "jsonwebtoken";

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const JWT_SECRET =
  NODE_ENV === "development"
    ? process.env.JWT_SECRET || "zkonnect"
    : "SET_YOUR_SECRET_KEY"; // TODO: Change this to a more secure secret key

export function produceJWTSecret({ identifier }: { identifier: string }) {
  return jwt.sign({ identifier }, JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
}

export function verifyJWTSecret(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
