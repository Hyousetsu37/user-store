export class CreateCategoryDto {
  private constructor(
    public readonly name: String,
    public readonly isAvailable: String
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, isAvailable = false } = object;
    let isAvailableBoolean = isAvailable;

    if (!name) return ["Missing name"];
    if (typeof isAvailable !== "boolean") {
      isAvailableBoolean = isAvailable === "true";
    }
    return [undefined, new CreateCategoryDto(name, isAvailableBoolean)];
  }
}
