import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly password: string,
    public readonly role: string[],
    public readonly img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!_id && !id) throw CustomError.badRequest("Missing ID");
    if (!name) throw CustomError.badRequest("Missing Name");
    if (!email) throw CustomError.badRequest("Missing Email");
    if (emailValidated === undefined)
      throw CustomError.badRequest("Missing Email Validation");
    if (!password) throw CustomError.badRequest("Missing Password");
    if (!role) throw CustomError.badRequest("Missing Role");
    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
