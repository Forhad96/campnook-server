import { ZodError, ZodIssue } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError):TGenericErrorResponse => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'zod validation error',
    errorSource,
  };
};
export default handleZodError