import { envs } from "../../config";
import { categoryModel } from "../mongo/models/category.model";
import { productModel } from "../mongo/models/product.model";
import { userModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoURL: envs.MONGO_URL,
  });
  await main();

  await MongoDatabase.disconnect();
})();

const randomBetween0andX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  await Promise.all([
    userModel.deleteMany(),
    categoryModel.deleteMany(),
    productModel.deleteMany(),
  ]);

  const users = await userModel.insertMany(seedData.users);

  const categories = await categoryModel.insertMany(
    seedData.categories.map((category) => {
      return {
        ...category,
        user: users[randomBetween0andX(seedData.users.length - 1)]._id,
      };
    })
  );

  const products = await productModel.insertMany(
    seedData.products.map((product) => {
      return {
        ...product,
        user: users[randomBetween0andX(seedData.users.length - 1)]._id,
        category:
          categories[randomBetween0andX(seedData.categories.length - 1)]._id,
      };
    })
  );

  console.log("Seeded");
}
