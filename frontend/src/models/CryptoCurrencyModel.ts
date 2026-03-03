import { CryptoCurrencyEnum } from '@/api/backendApi'

export type CryptoCurrencyModel = {
  alias: string
  currency: CryptoCurrencyEnum
}

export const cryptoCurrencies: CryptoCurrencyModel[] = [
  {
    alias: 'BTC',
    currency: CryptoCurrencyEnum.Bitcoin,
  },
  {
    alias: 'ETH',
    currency: CryptoCurrencyEnum.Ethereum,
  },
  {
    alias: 'USDT',
    currency: CryptoCurrencyEnum.Tether,
  },
  {
    alias: 'USDC',
    currency: CryptoCurrencyEnum.USDCoin,
  },
  {
    alias: 'BNB',
    currency: CryptoCurrencyEnum.BinanceCoin,
  },
  {
    alias: 'XRP',
    currency: CryptoCurrencyEnum.XRP,
  },
  {
    alias: 'ADA',
    currency: CryptoCurrencyEnum.Cardano,
  },
  {
    alias: 'SOL',
    currency: CryptoCurrencyEnum.Solana,
  },
  {
    alias: 'DOGE',
    currency: CryptoCurrencyEnum.Dogecoin,
  },
]
