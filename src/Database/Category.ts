import { askQuery, updateQuery } from "./database";

export interface CategoryObject {
  id: number;
  name: string;
}

class Category {

  public addCategory(name: string) {
    updateQuery(`INSERT INTO category (name) VALUES ("${name.toLowerCase()}")`)
  }

  public async getCategories() {
    const data: CategoryObject[] = await askQuery(`
      SELECT id, name from category
    `);
    return data
  }
}

export const CategoryMethods = new Category();