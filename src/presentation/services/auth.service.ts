import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { userModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {} //DI Email Service

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
      await this.sendEmailValidationLink(user.email);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");
      const { password, ...userEntity } = UserEntity.fromObject(user);
      return { user: userEntity, token };
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
      const token = await JwtAdapter.generateToken({ id: newUserEntity.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");
      return { user: newUserEntity, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to validate your email</p>
    <a href=${link}>Validate your email: ${email} </a>
    `;
    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };
    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer("Error sending email");
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");
    const user = await userModel.findOne({ email });
    if (!user) throw CustomError.internalServer("Email doesn't exist");
    user.emailValidated = true;
    await user.save();
    return true;
  };
}
