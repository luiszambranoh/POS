import { CurrencyMethods } from "./Currency";
import { askQuery, updateQuery } from "./database";

export interface ProductsObject {
  id: number;
  name: string;
  price: number;
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

  public addProduct(id: number,name: string, price: number, currency: number = 1, category: number = 1) {
    try{
      updateQuery(`INSERT INTO products (id, name, price, currency, categoryID) VALUES (${id},"${name.toLowerCase()}", ${price}, ${currency}, ${category})`)
    }
    catch(e){
      console.log(e.message);
    }
  }

  public addCategory(name: string) {
    updateQuery(`INSERT INTO category (name) VALUES ("${name.toLowerCase()}")`)
  }
  
  public async getProducts(): Promise<ProductsObject[]> {
    const data = await askQuery(`
      SELECT 
        products.id, 
        products.name, 
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
      name: product.name,
      price: product.price,
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
}

export const ProductsMethods = new Products();