import { askQuery, updateQuery } from "./database";

export interface ProductsObject {
  id: number;
  name: string;
  price: number;
  currency: string;
  categoryName: string
}

class Products {

  public addProduct(name: string, price: number, currency: number = 1, category: number = 1) {
    updateQuery(`INSERT INTO products (name, price, currency, categoryID) VALUES ("${name.toLowerCase()}", ${price}, ${currency}, ${category})`)
  }
  
  public async getProducts(): Promise<ProductsObject[]> {
    const data: ProductsObject[] = await askQuery(`
    SELECT 
    products.id, 
    products.name, 
    products.price, 
    CASE 
        WHEN products.currency = 1 THEN '$'
        ELSE 'Bs.'
    END AS currency,
    category.name AS categoryName
    FROM 
        products
    INNER JOIN 
        category ON products.categoryID = category.id
    WHERE 
        products.active = 1;

    `);
    console.log(data)
    return data
  }
}

export const ProductsMethods = new Products();