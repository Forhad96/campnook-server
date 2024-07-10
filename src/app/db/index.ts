import config from '../config';
import { USER_ROLES } from '../modules/user/user.constant';
import { UserModel } from '../modules/user/user.model';

const superAdmin = {
  id: '00001',
  email: 'forhadairdrop@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLES.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database connected firstly it check any super admin exists in database or not,if no it will create a super admin
  const isSuperAdminExist = await UserModel.findOne({
    role: USER_ROLES.superAdmin,
  });

  if (!isSuperAdminExist) {
    await UserModel.create(superAdmin);
  }
};

export default seedSuperAdmin;
