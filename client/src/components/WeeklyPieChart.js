import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#182b41", "#50c878", "#f5a623", "#9b59b6", "#e94e4e"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  const changeText =
    data.percentChange > 0
      ? `up ${data.percentChange}% vs previous week`
      : data.percentChange < 0
      ? `down ${Math.abs(data.percentChange)}% vs previous week`
      : "no change vs previous week";

  return (
    <div className="chart-tooltip">
      <p>
        <strong>{data.label}</strong>
      </p>
      <p>Total: ${data.total.toFixed(2)}</p>
      <p>{changeText}</p>
    </div>
  );
}

function WeeklyPieChart({ weekly, onClose }) {
  if (!weekly) return null;

  const { month, year, weeks, highestWeek } = weekly;

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h2>
          Weekly Breakdown — {month} {year}
        </h2>
        <button onClick={onClose}>Back to months</button>
      </div>

      {weeks.length === 0 ? (
        <p>No expenses recorded for this month.</p>
      ) : (
        <>
          {highestWeek && (
            <p className="highlight-text">
              Highest spending week: <strong>{highestWeek}</strong>
            </p>
          )}

          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={weeks}
                dataKey="total"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={(entry) => `${entry.label}: $${entry.total.toFixed(2)}`}
              >
                {weeks.map((w, index) => (
                  <Cell key={w.week} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <ul className="week-change-list">
            {weeks.map((w) => (
              <li key={w.week}>
                <strong>{w.label}:</strong> ${w.total.toFixed(2)}{" "}
                {w.percentChange > 0 && (
                  <span className="change-up">▲ {w.percentChange}%</span>
                )}
                {w.percentChange < 0 && (
                  <span className="change-down">▼ {Math.abs(w.percentChange)}%</span>
                )}
                {w.percentChange === 0 && <span>no change</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default WeeklyPieChart;
