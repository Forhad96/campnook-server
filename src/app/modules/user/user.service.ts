import { UserModel } from './user.model';

const createUser = (payload: Record<string, undefined>) => {
  const result = UserModel.create(payload);
  return result;
};

export const UserServices = {
  createUser,
};
