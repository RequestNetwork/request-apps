import { useState, useEffect } from "react";

/** Load rate conversion between two currencies */
export const useRate = (currency?: string, counterCurrency: string = "USD") => {
  const [rate, setRate] = useState<number>();
  useEffect(() => {
    if (currency) {
      let curr = currency.split("-")[0];
      fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${curr}&tsyms=${counterCurrency}`
      )
        .then(res => res.json())
        .then(res => {
          setRate(res[counterCurrency]);
        });
    }
  }, [currency, counterCurrency]);

  return rate;
};
