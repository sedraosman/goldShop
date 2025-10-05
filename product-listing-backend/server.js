const express = require("express");
const cors = require("cors");
const axios = require("axios");
const products = require("./product.json");

const app = express();

app.use(cors());

// Cache için değişken
let cachedGoldPrice = null; // gram başına USD
let cachedDate = null;

// Altın fiyatını almak için async fonksiyon
async function getGoldPrice() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Cache varsa ve tarih aynıysa cache kullan
  if (cachedGoldPrice && cachedDate === dateStr) {
    return cachedGoldPrice;
  }

  try {
    const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": "goldapi-1ha616smgdzkva9-io" }
    });

    const pricePerOunce = response.data.price; // 1 ons altın USD
    cachedGoldPrice = pricePerOunce / 31.1035; // gram başına USD
    cachedDate = dateStr;

    console.log("Altın fiyatı (gram başına USD):", cachedGoldPrice.toFixed(2));
    return cachedGoldPrice;
  } catch (error) {
    console.error("GoldAPI fetch error:", error.message);
    return 70; // fallback gram başına
  }
}

app.get("/products", async (req, res) => {
  const goldPricePerGram = await getGoldPrice();

  const updatedProducts = products.map(p => {
    const basePrice = (p.weight * goldPricePerGram).toFixed(2); // sadece basePrice

    console.log(`${p.name} | basePrice: ${basePrice}`);

    return {
      ...p,
      price: basePrice,      // finalPrice yerine basePrice
      popularity5: (p.popularityScore * 5).toFixed(1)
    };
  });

  res.json(updatedProducts);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


