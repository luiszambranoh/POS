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
    let paymentMethodStr = JSON.stringify(paymentMethods).replace(/"/g, '""');
    const productsSoldArray = soldProducts.map(p => ({
      [p.product.id]: p.amount
  }));
    let productsSoldStr = JSON.stringify(productsSoldArray).replace(/"/g, '""');

    try{
      updateQuery(`
          INSERT INTO sales (date, paymentMethod, dolar, productsSold, totalDolar) VALUES 
          (${getDate()}, "${paymentMethodStr}", ${dolar}, "${productsSoldStr}", ${totalDolar})
        `
      )
      let lastSale = await this.getLastSale();

      soldProducts.forEach(p => {
        updateQuery(`
            INSERT INTO productSold (saleID, productID, amount) VALUES (${lastSale}, ${p.product.id}, ${p.amount})
          `);
        updateQuery(`
            UPDATE products
            SET quantity = quantity - ${p.amount}
            WHERE id = ${p.product.id}
          `)
      }) 
    }
    catch(e){
      throw new Error(e)
    }
  }
  
  public async getLastSale(): Promise<number> {
    const selectQuery = await askQuery(`SELECT * FROM sales ORDER BY id DESC LIMIT 1`);
    let x = selectQuery[0].id
    console.log(selectQuery);
    console.log(x);
    
    return x
  }
}

export const SaleMethods = new Sale();