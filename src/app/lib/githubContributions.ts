export type ContributionDay = { date: string; count: number };

// GitHub contribution data generator (mocked/local)
export const generateContributionData = (year: number): ContributionDay[] => {
  const data: ContributionDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let count = 0;
    const random = Math.random();

    // 70% chance of contributions
    if (random > 0.3) {
      count = isWeekend ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 12) + 1;
    }

    data.push({
      date: d.toISOString().split("T")[0],
      count,
    });
  }

  return data;
};

export const getContributionStats = (data: ContributionDay[]) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;
  const longestStreak = calculateLongestStreak(data);
  const currentStreak = calculateCurrentStreak(data);

  return { total, activeDays, longestStreak, currentStreak };
};

const calculateLongestStreak = (data: ContributionDay[]) => {
  let longest = 0;
  let current = 0;

  for (const d of data) {
    if (d.count > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
};

const calculateCurrentStreak = (data: ContributionDay[]) => {
  let streak = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) streak++;
    else break;
  }

  return streak;
};

