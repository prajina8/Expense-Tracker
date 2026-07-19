import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlyBarChart from "./components/MonthlyBarChart";
import WeeklyPieChart from "./components/WeeklyPieChart";
import { getExpenses, getMonthlyAnalytics, getWeeklyAnalytics } from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState({ months: [], highestMonth: null });
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  }, []);

  const loadMonthlyAnalytics = useCallback(async () => {
    const res = await getMonthlyAnalytics();
    setMonthlyData(res.data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadExpenses(), loadMonthlyAnalytics()]);
    setLoading(false);
  }, [loadExpenses, loadMonthlyAnalytics]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSelectMonth = async (year, monthIndex) => {
    const res = await getWeeklyAnalytics(year, monthIndex);
    setWeeklyData(res.data);
  };

  const handleCloseWeekly = () => setWeeklyData(null);

  const handleExpenseChange = () => {
    loadAll();

    if (weeklyData) {
      const monthIndex = monthlyData.months.find((m) => m.month === weeklyData.month)?.monthIndex;
      if (monthIndex !== undefined) {
        handleSelectMonth(weeklyData.year, monthIndex);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your spending, month by month and week by week.</p>
      </header>

      <main className="app-main">
        <section className="left-column">
          <ExpenseForm onExpenseAdded={handleExpenseChange} />
          <ExpenseList expenses={expenses} onExpenseDeleted={handleExpenseChange} />
        </section>

        <section className="right-column">
          {loading ? (
            <p>Loading charts...</p>
          ) : weeklyData ? (
            <WeeklyPieChart weekly={weeklyData} onClose={handleCloseWeekly} />
          ) : (
            <MonthlyBarChart
              months={monthlyData.months}
              highestMonth={monthlyData.highestMonth}
              onSelectMonth={handleSelectMonth}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
