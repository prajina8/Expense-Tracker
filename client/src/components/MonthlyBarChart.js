import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const NORMAL_COLOR = "#29394b";
const HIGHEST_COLOR = "#e94e4e";


function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  const changeText =
    data.percentChange > 0
      ? `up ${data.percentChange}% vs previous month`
      : data.percentChange < 0
      ? `down ${Math.abs(data.percentChange)}% vs previous month`
      : "no change vs previous month";

  return (
    <div className="chart-tooltip">
      <p>
        <strong>{data.label}</strong>
      </p>
      <p>Total: ${data.total.toFixed(2)}</p>
      <p>{changeText}</p>
      <p className="hint">Click bar to see weekly breakdown</p>
    </div>
  );
}

function MonthlyBarChart({ months, highestMonth, onSelectMonth }) {
  return (
    <div className="chart-card">
      <h2>Expenses by Month</h2>
      {highestMonth && (
        <p className="highlight-text">
          Highest spending month: <strong>{highestMonth}</strong>
        </p>
      )}

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={months} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            cursor="pointer"
            onClick={(data) => onSelectMonth(data.year, data.monthIndex, data.label)}
          >
            <LabelList
              dataKey="percentChange"
              position="top"
              formatter={(val) => (val ? `${val > 0 ? "+" : ""}${val}%` : "")}
            />
            {months.map((m) => (
              <Cell
                key={m.key}
                fill={m.label === highestMonth ? HIGHEST_COLOR : NORMAL_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyBarChart;