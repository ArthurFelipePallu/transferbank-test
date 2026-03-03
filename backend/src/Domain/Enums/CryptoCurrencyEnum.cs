using System.ComponentModel.DataAnnotations;

namespace Domain.Enums;

public enum CryptoCurrencyEnum
{
    [Display(Name = "BTC")]
    Bitcoin = 1,

    [Display(Name = "ETH")]
    Ethereum = 2,

    [Display(Name = "USDT")]
    Tether = 3,

    [Display(Name = "USDC")]
    USD_Coin = 4,

    [Display(Name = "BNB")]
    BinanceCoin = 5,

    [Display(Name = "XRP")]
    XRP = 6,

    [Display(Name = "ADA")]
    Cardano = 7,

    [Display(Name = "SOL")]
    Solana = 8,

    [Display(Name = "DOGE")]
    Dogecoin = 9
}