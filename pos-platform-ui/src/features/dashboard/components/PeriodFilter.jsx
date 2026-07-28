const periods = [
  { value: "TODAY", label: "Aujourd’hui" },
  { value: "LAST_7_DAYS", label: "7 jours" },
  { value: "LAST_30_DAYS", label: "30 jours" },
  { value: "ALL", label: "Tout" },
];

function PeriodFilter({ period, onChange }) {
  return (
    <div className="DashboardPeriod">
      {periods.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={period === value ? "active" : ""}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default PeriodFilter;