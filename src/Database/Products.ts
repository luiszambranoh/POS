import { CurrencyMethods } from "./Currency";
import { askQuery, updateQuery } from "./Database";

export interface ProductsObject {
  id: number;
  quantity: number;
  name: string;
  price: number;
  unit: number;
  currency: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface CategoryObject{
  id: number,
  name: string,
}

interface CategoriesAndProducts{
  products: ProductsObject[],
  categories: CategoryObject[],
  dolar: number
}


class Products {

  public addProduct(id: number, quantity: number,name: string, price: number, currency: number = 1, category: number, unit: number) {
    try{
      updateQuery(`
        INSERT INTO products (id, quantity, name, unit, price, currency, categoryID) VALUES (${id}, ${quantity}, "${name}", ${unit}, ${price}, ${currency}, ${category})`
      )
      console.log("xd")
    }
    catch(e){
      throw new Error(e)
    }
  }

  public addCategory(name: string) {
    updateQuery(`INSERT INTO category (name) VALUES ("${name}")`)
  }
  
  public async getProducts(): Promise<ProductsObject[]> {
    const data = await askQuery(`
      SELECT 
        products.id,
        products.quantity,
        products.name,
        products.unit,
        products.price, 
        products.currency AS currencyId, 
        CASE 
          WHEN products.currency = 1 THEN '$'
          ELSE 'Bs.'
        END AS currencyName, 
        category.id AS categoryId,
        category.name AS categoryName
      FROM 
        products
      INNER JOIN 
        category ON products.categoryID = category.id
      WHERE 
        products.active = 1;
    `);
    

    let re: ProductsObject[] = data.map(product => ({
      id: product.id,
      quantity: product.quantity,
      name: product.name,
      price: product.price,
      unit: product.unit,
      currency: {
        id: product.currencyId,
        name: product.currencyName
      },
      category: {
        id: product.categoryId,
        name: product.categoryName
      }
    }))

    return re;

  }

  public async getCategories(): Promise<CategoryObject[]> {
    const data = await askQuery(`
      SELECT *
      FROM 
        category
    `);
    return data;
  }

  public async getProductsAndCategories(): Promise<CategoriesAndProducts> {
    let products = await this.getProducts();
    let categories = await this.getCategories();
    let dolar = await CurrencyMethods.getDolar();

    return {products, categories, dolar}
  }

  public findProductById(products: ProductsObject[], id: number){
    return products.find(product => product.id === id);
  }

  // Assuming ProductsObject has a property 'name'
  public findProductByName = (products: ProductsObject[], name: string): ProductsObject | undefined => {
    return products.find(product => product.name.toLowerCase() === name.toLowerCase());
  };
}

export const ProductsMethods = new Products();