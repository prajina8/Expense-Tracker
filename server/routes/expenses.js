const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");


router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { title, amount, category, note, date } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ message: "title and amount are required" });
    }

    const expense = new Expense({
      title,
      amount,
      category: category || "Other",
      note,
      date: date ? new Date(date) : new Date(),
    });

    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
