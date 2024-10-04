import { CurrencyMethods } from "./Currency";
import { askQuery, updateQuery } from "./Database";
import { getDate } from "./Utils";

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

export type selectedProduct = {
  id: number,
  product: ProductsObject,
  amount: number,
}

class Sale {

 public async addSale(soldProducts: selectedProduct[], dolar: number, totalDolar: number, paymentMethods: {1: number, 2: number, 3: number}) {
    console.log(`INSERT INTO sales (date, paymentMethod, dolar, totalDolar) VALUES ("${getDate()}", "${JSON.stringify(paymentMethods)}", ${dolar}, ${totalDolar})`);

    try{
      let a = await askQuery(`
          INSERT INTO sales (date, paymentMethod, dolar, totalDolar) VALUES ("${getDate()}", "${JSON.stringify(paymentMethods)}", ${dolar}, ${totalDolar})
        `
      )
      console.log(a);
    }
    catch(e){
      throw new Error(e)
    }
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
}

export const SaleMethods = new Sale();