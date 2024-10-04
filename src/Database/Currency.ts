import { askQuery, updateQuery } from "./Database";
import { formatToTwoDecimals } from "./Utils";


class Currency {

  public changeDolar(price: number) {
    try{
      updateQuery(`
        UPDATE dolarPrice
        SET price = ${price} 
        WHERE id = 1; 
        `)
    }
    catch(e){
      console.log(e.message);
    }
  }

  public async getDolar(): Promise<number> {
    let dolarPrice = await askQuery(`SELECT price FROM dolarPrice WHERE id = 1`);
    let dolar: number = dolarPrice[0].price;
    return dolar
  }

  public convertCurrency(currency: number, currencyPrice: number, amount: number){
    if (currency == 1) {
      // Convert to Boliars
      let result = {
        convertionId: 0,
        convertion: formatToTwoDecimals(amount * currencyPrice)
        }
      return result
    }
    else if (currency == 0) {
      // Convert to $
      let result = {
        convertionId: 1,
        convertion: formatToTwoDecimals(amount / currencyPrice)
        }
      return result
    }
}
}

export const CurrencyMethods = new Currency();