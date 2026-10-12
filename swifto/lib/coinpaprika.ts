import CoinpaprikaAPI from "@coinpaprika/api-nodejs-client";

// Free tier : pas de clé, pas de pro
export const coinpaprika = new CoinpaprikaAPI();

// Si tu passes au plan payant plus tard :
// export const coinpaprika = new CoinpaprikaAPI({
//   apiKey: process.env.COINPAPRIKA_API_KEY,
//   pro: true,
// });