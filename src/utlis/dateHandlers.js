export function calculateLifespan({ startDate, endDate }) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const ms = end.getTime() - start.getTime();
  let totalDays = Math.ceil(ms / (1000 * 60 * 60 * 24));

  const avgDaysPerMonth = 30.436875;
  const avgDaysPerYear = 365.2425;

  const years = Math.floor(totalDays / avgDaysPerYear);
  const daysAfterYears = totalDays % avgDaysPerYear;

  const months = Math.floor(daysAfterYears / avgDaysPerMonth);
  let days = Math.floor(daysAfterYears % avgDaysPerMonth);

  if (!totalDays) {
    totalDays = 1;
    days = 1;
  }

  return {
    totalDays,
    breakdown: {
      years,
      months,
      days,
    },
  };
}

export function formatUnit(value, singular, plural) {
  return value ? `${value} ${value === 1 ? singular : plural} ` : "";
}
