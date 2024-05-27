import { bcryptAdapter } from "../../config";
import { userModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new userModel(registerUserDto);
      //Encrypt the password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      //Encrypt the password

      //JWT keep user auth

      //Confirmation email

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return { user: userEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  public async loginUser(loginUserDto: LoginUserDto) {
    const userInformation = await userModel.findOne({
      email: loginUserDto.email,
    });
    if (!userInformation) throw CustomError.badRequest("Incorrect Credentials");

    try {
      const passwordMatch = bcryptAdapter.compare(
        loginUserDto.password,
        userInformation.password
      );
      if (!passwordMatch) throw CustomError.badRequest("Incorrect Credentials");
      const { password, ...newUserEntity } =
        UserEntity.fromObject(userInformation);
      return { user: newUserEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
