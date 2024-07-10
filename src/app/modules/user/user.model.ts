import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserStaticModel } from '../user/user.interface';
const userSchema = new Schema<TUser, UserStaticModel>(
  {
    id: {
      type: String,
      required: true,
      unique:true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin','student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExisTByCustomId = async function (id: string) {
  return await UserModel.findOne({ id }).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimeStamp,
  jwtIssuedTimeStamp,
) {
const passwordChangedTime = new Date(passwordChangedTimeStamp).getTime()/1000

  return passwordChangedTime > jwtIssuedTimeStamp;
};

// Exclude password from the JSON output
// userSchema.methods.toJSON = function() {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;

//   return userObject;
// };

export const UserModel = model<TUser, UserStaticModel>('User', userSchema);
