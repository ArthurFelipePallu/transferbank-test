import type { CryptoCurrencyOption } from '../interfaces/currencyInterface'

export interface CurrencyGateway {
  getAllCrypto(): Promise<CryptoCurrencyOption[]>
  getMostValuableCrypto(): Promise<CryptoCurrencyOption>
}

//   currency = {
//     /**
//      * No description
//      *
//      * @tags Currency
//      * @name CurrencyMostValuableCurrencyList
//      * @request GET:/api/Currency/most-valuable-currency
//      */
//     currencyMostValuableCurrencyList: (params: RequestParams = {}) =>
//       this.request<CryptoCurrencyDto, any>({
//         path: `/api/Currency/most-valuable-currency`,
//         method: "GET",
//         format: "json",
//         ...params,
//       }),

//     /**
//      * No description
//      *
//      * @tags Currency
//      * @name CurrencyAllCryptoCurrenciesList
//      * @request GET:/api/Currency/all-crypto-currencies
//      */
//     currencyAllCryptoCurrenciesList: (params: RequestParams = {}) =>
//       this.request<CryptoCurrencyDto[], any>({
//         path: `/api/Currency/all-crypto-currencies`,
//         method: "GET",
//         format: "json",
//         ...params,
//       }),
//   };
