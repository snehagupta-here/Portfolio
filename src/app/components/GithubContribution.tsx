import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  fetchGitHubContributions,
  type GitHubContributions,
} from "@/services/user";
import { PORTFOLIO_USER_ID } from "@/app/config";

const currentYear = new Date().getFullYear();
const contributionYears = Array.from({ length: 5 }, (_, index) =>
  String(currentYear - index),
);

const githubContributionSection = {
  id: "github",
  title: "GitHub Contributions",
  description: "Live contribution activity from the server.",
  years: contributionYears,
  defaultYear: String(currentYear),
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CELL_SIZE = 16;
const CELL_GAP = 4;

const getContributionColor = (count: number) => {
  if (count === 0) return "bg-muted/30";
  if (count <= 3) return "bg-purple-500/25";
  if (count <= 6) return "bg-purple-500/40";
  if (count <= 9) return "bg-purple-500/60";
  return "bg-purple-500/85";
};

type CalendarDay = {
  date: string;
  count: number;
};

function getMonthLabels(weeks: CalendarDay[][]) {
  const labels: { month: string; weekIndex: number }[] = [];
  const seenMonths = new Set<number>();

  weeks.forEach((week, weekIndex) => {
    const validDay = week.find((day) => day.date);

    if (!validDay) return;

    const date = new Date(`${validDay.date}T00:00:00`);
    const month = date.getMonth();

    if (!seenMonths.has(month)) {
      seenMonths.add(month);
      labels.push({
        month: monthNames[month],
        weekIndex,
      });
    }
  });

  return labels;
}

export default function GitHubCalendar() {
  const initialYear =
    githubContributionSection.defaultYear ||
    githubContributionSection.years[0] ||
    String(new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [contributions, setContributions] =
    useState<GitHubContributions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadContributions() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchGitHubContributions(
          PORTFOLIO_USER_ID,
          Number(selectedYear),
          controller.signal,
        );

        setContributions(data);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setContributions(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load GitHub contributions.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadContributions();

    return () => controller.abort();
  }, [selectedYear]);

  const weeks = useMemo<CalendarDay[][]>(() => {
    return (contributions?.weeks ?? []).map((week) =>
      Array.from({ length: 7 }, (_, weekday) => {
        const day = week.contributionDays.find(
          (contributionDay) => contributionDay.weekday === weekday,
        );

        return day
          ? {
              date: day.date,
              count: day.contributionCount,
            }
          : {
              date: "",
              count: -1,
            };
      }),
    );
  }, [contributions]);

  const monthLabels = useMemo(() => {
    return getMonthLabels(weeks);
  }, [weeks]);

  const stats = {
    total: contributions?.totalContributions ?? 0,
    activeDays: contributions?.activeDays ?? 0,
    longestStreak: contributions?.longestStreak ?? 0,
    currentStreak: contributions?.currentStreak ?? 0,
  };

  const calendarGridStyle = {
    gridTemplateColumns: `repeat(${weeks.length}, ${CELL_SIZE}px)`,
    columnGap: `${CELL_GAP}px`,
  };

  return (
    <section
      className="section-padding relative overflow-hidden"
      id={githubContributionSection.id}
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1f] to-black" />
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8 text-cyan-400" />
            <h2 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
              {githubContributionSection.title}
            </h2>
          </div>

          <p className="mx-auto max-w-2xl text-muted-foreground">
            {githubContributionSection.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a0a1f] to-[#0f0f2e] p-6 shadow-[0_0_50px_rgba(34,211,238,0.1)] backdrop-blur-sm transition-all hover:border-cyan-400/40 md:p-8"
        >
          {/* Header with year selector */}
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {stats.total.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                contributions in {selectedYear}
              </span>
            </div>

            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(val)}
            >
              <SelectTrigger className="w-32 border border-cyan-500/30 bg-[#0a0a1f] text-white transition-all hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border border-cyan-500/30 bg-[#0a0a1f] text-white">
                {githubContributionSection.years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="
                      text-white
                      transition-colors
                      duration-150
                      hover:bg-cyan-500/15
                      hover:text-white
                      focus:bg-transparent
                      focus:text-white
                      data-[state=checked]:bg-cyan-500/20
                      data-[state=checked]:text-white
                    "
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div
              className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <div
            className={`mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.total.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Contributions
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.activeDays}
              </p>
              <p className="text-sm text-muted-foreground">Active Days</p>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.longestStreak}
              </p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.currentStreak}
              </p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="mx-auto w-fit min-w-max">
              {isLoading && (
                <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="h-5 w-5 animate-spin text-cyan-400" />
                  Loading GitHub contributions...
                </div>
              )}

              {/* Dynamic Months */}
              {!isLoading && !error && (
                <div className="mb-3 flex text-sm text-muted-foreground">
                  <div className="w-10 shrink-0" />

                  <div className="grid" style={calendarGridStyle}>
                    {monthLabels.map((label) => (
                      <div
                        key={label.month}
                        className="text-left"
                        style={{
                          gridColumnStart: label.weekIndex + 1,
                        }}
                      >
                        {label.month}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              {!isLoading && !error && (
                <div className="flex gap-2">
                  {/* Day labels */}
                  <div className="flex w-10 shrink-0 flex-col gap-1 text-sm text-muted-foreground">
                    {days.map((day, index) => (
                      <div key={day} className="flex h-4 items-center">
                        {index % 2 === 1 ? day : ""}
                      </div>
                    ))}
                  </div>

                  {/* Contribution squares */}
                  <div className="grid" style={calendarGridStyle}>
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <motion.div
                            key={`${weekIndex}-${dayIndex}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                              duration: 0.2,
                              delay: isInView
                                ? weekIndex * 0.01 + dayIndex * 0.005
                                : 0,
                            }}
                            className={`h-4 w-4 cursor-pointer rounded-sm transition-all hover:ring-2 hover:ring-purple-500/50 ${
                              day.count === -1
                                ? "bg-transparent"
                                : getContributionColor(day.count)
                            }`}
                            title={
                              day.date
                                ? `${day.date}: ${day.count} contributions`
                                : ""
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legend */}
              {!isLoading && !error && (
                <div className="mt-5 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <span>Less</span>

                  <div className="flex gap-1">
                    <div className="h-4 w-4 rounded-sm bg-muted/30" />
                    <div className="h-4 w-4 rounded-sm bg-purple-500/25" />
                    <div className="h-4 w-4 rounded-sm bg-purple-500/40" />
                    <div className="h-4 w-4 rounded-sm bg-purple-500/60" />
                    <div className="h-4 w-4 rounded-sm bg-purple-500/85" />
                  </div>

                  <span>More</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
