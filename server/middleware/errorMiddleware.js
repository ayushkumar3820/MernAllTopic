import { ZodError } from "zod";

export const errorMiddleware = async (err,req, res, next) => {
  if (err instanceof ZodError) {
    return res
      .status(401)
      .json({ message: "Validation Error", errors: err.errors });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
};
