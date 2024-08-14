const mongoose = require("mongoose");
const wetrox = require("../settings/setting.json")

mongoose.set('strictQuery', true);
mongoose.connect(wetrox.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("Database bağlantısı tamamlandı!");
});
mongoose.connection.on("error", () => {
  console.error("[HATA] Database bağlantısı kurulamadı!");
});