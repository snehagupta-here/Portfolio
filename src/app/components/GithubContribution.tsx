import { useRef, useMemo, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { generateContributionData, getContributionStats } from "@/app/lib/githubContributions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { githubContributionSection } from "@/app/data/appData";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getContributionColor = (count: number) => {
  if (count === 0) return 'bg-muted/30';
  if (count <= 3) return 'bg-purple-500/25';
  if (count <= 6) return 'bg-purple-500/40';
  if (count <= 9) return 'bg-purple-500/60';
  return 'bg-purple-500/85';
};
export default function GitHubCalendar() {
  const initialYear =
    githubContributionSection.defaultYear ||
    githubContributionSection.years[0] ||
    String(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const contributionData = useMemo(
  () => generateContributionData(parseInt(selectedYear)),
  [selectedYear]
);
  const stats = useMemo(() => getContributionStats(contributionData), [contributionData]);

  // Group by weeks
  const weeks = useMemo(() => {
    const result: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    const firstDay = new Date(contributionData[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', count: -1 });
    }

    contributionData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [contributionData]);

 return (
    <section className="section-padding relative overflow-hidden" id={githubContributionSection.id} ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1f] to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {githubContributionSection.title}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {githubContributionSection.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-[#0a0a1f] to-[#0f0f2e] rounded-2xl p-6 md:p-8 border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] backdrop-blur-sm hover:border-cyan-400/40 transition-all"
        >
          {/* Header with year selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{stats.total.toLocaleString()}</span>
              <span className="text-muted-foreground">contributions in {selectedYear}</span>
            </div>
            
            <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(val)}>
              <SelectTrigger className="w-32 bg-[#0a0a1f] border border-cyan-500/30 text-white hover:border-cyan-400/50 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <SelectValue />
              </SelectTrigger>
    <SelectContent className="bg-[#0a0a1f] border border-cyan-500/30 text-white">
                {githubContributionSection.years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="
                      text-white
                      transition-colors duration-150

                      data-[state=checked]:bg-cyan-500/20
                      data-[state=checked]:text-white

                      hover:bg-cyan-500/15 hover:text-white

                      focus:bg-transparent focus:text-white
                    "
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-2xl font-bold text-foreground">{stats.total.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-2xl font-bold text-foreground">{stats.activeDays}</p>
              <p className="text-sm text-muted-foreground">Active Days</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-2xl font-bold text-foreground">{stats.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Months */}
              <div className="flex mb-2 text-xs text-muted-foreground">
                <div className="w-8" />
                {months.map((month, i) => (
                  <div key={month} className="flex-1 text-center">
                    {month}
                  </div>
                ))}
              </div>

              {/* Calendar */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 text-xs text-muted-foreground w-8">
                  {days.map((day, i) => (
                    <div key={day} className="h-3 flex items-center">
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Contribution squares */}
                <div className="flex gap-[3px] flex-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{
                            duration: 0.2,
                            delay: isInView ? weekIndex * 0.01 + dayIndex * 0.005 : 0,
                          }}
                          className={`w-3 h-3 rounded-sm ${
                            day.count === -1 ? 'bg-transparent' : getContributionColor(day.count)
                          } hover:ring-2 hover:ring-purple-500/50 transition-all cursor-pointer`}
                          title={day.date ? `${day.date}: ${day.count} contributions` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted/30" />
                  <div className="w-3 h-3 rounded-sm bg-purple-500/25" />
                  <div className="w-3 h-3 rounded-sm bg-purple-500/40" />
                  <div className="w-3 h-3 rounded-sm bg-purple-500/60" />
                  <div className="w-3 h-3 rounded-sm bg-purple-500/85" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
