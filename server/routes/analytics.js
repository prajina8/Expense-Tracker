const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// small helper to safely calculate % change between two numbers
function percentChange(current, previous) {
  if (previous === 0 || previous === undefined || previous === null) {
    // nothing to compare against, so we cannot say it "increased" from 0
    // in percentage terms in a meaningful way. Treat as 0% if current is
    // also 0, otherwise treat as a fresh 100% increase.
    return current === 0 ? 0 : 100;
  }
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

// GET /api/analytics/monthly
// Groups every expense by "year-month" and returns a total per month,
// sorted chronologically, along with the % change vs the previous month
// and which month spent the most.
router.get("/monthly", async (req, res) => {
  try {
    const expenses = await Expense.find();

    // key = "2026-7" (year-monthIndex) -> total amount
    const totalsByMonth = {};

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      totalsByMonth[key] = (totalsByMonth[key] || 0) + exp.amount;
    });

    // turn the map into a sorted array (oldest -> newest)
    const monthly = Object.keys(totalsByMonth)
      .map((key) => {
        const [year, monthIndex] = key.split("-").map(Number);
        return {
          key,
          year,
          monthIndex,
          month: MONTH_NAMES[monthIndex],
          label: `${MONTH_NAMES[monthIndex]} ${year}`,
          total: Number(totalsByMonth[key].toFixed(2)),
        };
      })
      .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);

    // add % change compared to the previous month in the list
    let highest = null;
    monthly.forEach((m, i) => {
      const previousTotal = i > 0 ? monthly[i - 1].total : null;
      m.percentChange = i > 0 ? percentChange(m.total, previousTotal) : 0;
      if (!highest || m.total > highest.total) {
        highest = m;
      }
    });

    res.json({
      months: monthly,
      highestMonth: highest ? highest.label : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/weekly/:year/:month
// month is 0-indexed (0 = Jan ... 11 = Dec) to match JS Date / the monthly route.
// Splits the chosen month into weeks (days 1-7, 8-14, 15-21, 22-28, 29-31)
// and returns totals + % change vs the previous week + which week spent the most.
router.get("/weekly/:year/:month", async (req, res) => {
  try {
    const year = Number(req.params.year);
    const monthIndex = Number(req.params.month);

    const startOfMonth = new Date(year, monthIndex, 1);
    const startOfNextMonth = new Date(year, monthIndex + 1, 1);

    const expenses = await Expense.find({
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    // week 1 = day 1-7, week 2 = day 8-14, week 3 = day 15-21,
    // week 4 = day 22-28, week 5 = day 29-31 (if the month has those days)
    const totalsByWeek = {};

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const weekNumber = Math.ceil(d.getDate() / 7);
      totalsByWeek[weekNumber] = (totalsByWeek[weekNumber] || 0) + exp.amount;
    });

    const weekly = Object.keys(totalsByWeek)
      .map((w) => Number(w))
      .sort((a, b) => a - b)
      .map((weekNumber) => ({
        week: weekNumber,
        label: `Week ${weekNumber}`,
        total: Number(totalsByWeek[weekNumber].toFixed(2)),
      }));

    let highest = null;
    weekly.forEach((w, i) => {
      const previousTotal = i > 0 ? weekly[i - 1].total : null;
      w.percentChange = i > 0 ? percentChange(w.total, previousTotal) : 0;
      if (!highest || w.total > highest.total) {
        highest = w;
      }
    });

    res.json({
      month: MONTH_NAMES[monthIndex],
      year,
      weeks: weekly,
      highestWeek: highest ? highest.label : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;