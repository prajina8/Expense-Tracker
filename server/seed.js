require("dotenv").config();
const mongoose = require("mongoose");
const Expense = require("./models/Expense");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/budget_management";

const categories = ["Food", "Transport", "Rent", "Shopping", "Bills", "Entertainment"];

function randomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDateInMonth(year, monthIndex) {
  const day = Math.floor(Math.random() * 28) + 1; // keep it safe for all months
  return new Date(year, monthIndex, day);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected. Clearing old data...");
  await Expense.deleteMany({});

  const now = new Date();
  const sample = [];

  // create sample expenses for the last 4 months
  for (let back = 3; back >= 0; back--) {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const year = d.getFullYear();
    const monthIndex = d.getMonth();

    // 15-25 random expenses per month
    const count = Math.floor(Math.random() * 10) + 15;
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      sample.push({
        title: `${category} expense`,
        amount: randomAmount(5, 150),
        category,
        note: "",
        date: randomDateInMonth(year, monthIndex),
      });
    }
  }

  await Expense.insertMany(sample);
  console.log(`Inserted ${sample.length} sample expenses.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
