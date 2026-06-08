import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Star,
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  Images,
} from "lucide-react";

import { PORTFOLIO_USER_ID } from "@/app/config";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import {
  fetchAchievements,
  getPositionColor,
  type Achievement,
} from "@/services/achievement";

const positionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "1st": Trophy,
  "1st Place": Trophy,
  "2nd": Medal,
  "2nd Place": Medal,
  "3rd": Medal,
  "3rd Place": Medal,
  Winner: Award,
  "Runner Up": Award,
  Finalist: Star,
  Participant: Star,
  "Honorable Mention": Star,
};

const getPositionIcon = (position: string) => {
  const normalized = position.toLowerCase();

  if (positionIcons[position]) return positionIcons[position];
  if (normalized.includes("1st") || normalized.includes("first")) return Trophy;
  if (normalized.includes("2nd") || normalized.includes("second")) return Medal;
  if (normalized.includes("3rd") || normalized.includes("third")) return Medal;
  if (normalized.includes("winner") || normalized.includes("runner")) return Award;
  return Star;
};

const isFirstPlace = (position: string) => {
  const normalized = position.toLowerCase();
  return normalized.includes("1st") || normalized.includes("first");
};

const isWin = (position: string) => {
  const normalized = position.toLowerCase();
  return isFirstPlace(position) || normalized === "winner";
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface LightboxState {
  achievement: Achievement;
  index: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadAchievements() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAchievements(PORTFOLIO_USER_ID);
        if (!ignore) {
          setAchievements(data);
        }
      } catch (error) {
        if (!ignore) {
          setAchievements([]);
          setError(
            error instanceof Error ? error.message : "Unable to load achievements.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadAchievements();

    return () => {
      ignore = true;
    };
  }, []);

  const positions = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          achievements
            .map((achievement) => achievement.position)
            .filter(Boolean),
        ),
      ),
    ],
    [achievements],
  );

  useEffect(() => {
    if (filter !== "all" && !positions.includes(filter)) {
      setFilter("all");
    }
  }, [filter, positions]);

  const filteredAchievements = useMemo(
    () =>
      filter === "all"
        ? achievements
        : achievements.filter((achievement) => achievement.position === filter),
    [achievements, filter],
  );

  const stats = useMemo(
    () => ({
      total: achievements.length,
      firstPlace: achievements.filter((achievement) =>
        isFirstPlace(achievement.position),
      ).length,
      wins: achievements.filter((achievement) => isWin(achievement.position)).length,
      competitions: new Set(
        achievements.map((achievement) => achievement.competition_name),
      ).size,
    }),
    [achievements],
  );

  const openLightbox = (
    achievement: Achievement,
    index: number,
  ) => {
    setLightbox({ achievement, index });
  };

  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (dir: 1 | -1) => {
    if (!lightbox) return;
    const total = lightbox.achievement.images.length;
    const newIndex = (lightbox.index + dir + total) % total;
    setLightbox({ ...lightbox, index: newIndex });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Achievements & <span className="gradient-text">Awards</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              A showcase of recognitions, hackathon victories, and competition
              results across my journey.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Total Awards", value: stats.total, icon: Trophy },
              { label: "1st Place", value: stats.firstPlace, icon: Medal },
              { label: "Wins", value: stats.wins, icon: Award },
              { label: "Competitions", value: stats.competitions, icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="card-luxury text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setFilter(pos)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === pos
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                    : "glass text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {pos === "all" ? "All Achievements" : pos}
              </button>
            ))}
          </motion.div>

          {/* Achievements List */}
          {isLoading && (
            <div className="space-y-6">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-80 rounded-2xl border border-border bg-card/40 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                {filteredAchievements.map((achievement, index) => {
                  const Icon = getPositionIcon(achievement.position);
                  const gradient = getPositionColor(achievement.position);
                  const coverImage = achievement.images[0];

                  return (
                    <motion.article
                      key={achievement._id}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="glass-strong rounded-2xl overflow-hidden"
                    >
                      <div className="grid lg:grid-cols-5 gap-0">
                        {/* Left - Hero Image */}
                        <div className="lg:col-span-2 relative h-64 lg:h-auto min-h-[300px] overflow-hidden group">
                          {coverImage ? (
                            <>
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-8 text-center`}
                              >
                                <Icon className="w-20 h-20 text-primary-foreground mb-4" />
                                <p className="text-primary-foreground/90 font-semibold">
                                  {achievement.competition_name}
                                </p>
                              </div>
                              <img
                                src={coverImage.url}
                                alt={coverImage.alt}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                                onClick={() => openLightbox(achievement, 0)}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                                loading="lazy"
                              />
                            </>
                          ) : (
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-8 text-center`}
                            >
                              <Icon className="w-20 h-20 text-primary-foreground mb-4" />
                              <p className="text-primary-foreground/90 font-semibold">
                                {achievement.competition_name}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-primary-foreground text-sm font-bold shadow-lg`}
                            >
                              <Icon className="w-4 h-4" />
                              {achievement.position}
                            </span>
                          </div>
                          {achievement.images.length > 1 && (
                            <button
                              onClick={() => openLightbox(achievement, 0)}
                              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg glass-strong text-foreground text-xs font-medium hover:bg-primary/20 transition-colors"
                            >
                              <Images className="w-4 h-4" />
                              {achievement.images.length} Photos
                            </button>
                          )}
                        </div>

                        {/* Right - Content */}
                        <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">
                          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-primary" />
                              {formatDate(achievement.achievement_date)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-primary" />
                              {achievement.competition_name}
                            </span>
                          </div>

                          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 leading-tight">
                            {achievement.title}
                          </h2>

                          <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                            {achievement.description}
                          </p>

                          {/* Image Gallery Thumbnails */}
                          {achievement.images.length > 1 && (
                            <div className="mb-6">
                              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                                Gallery
                              </p>
                              <div className="grid grid-cols-4 gap-2">
                                {achievement.images.slice(0, 4).map((img, i) => (
                                  <button
                                    key={i}
                                    onClick={() => openLightbox(achievement, i)}
                                    className={`relative aspect-square rounded-lg overflow-hidden group border border-border bg-gradient-to-br ${gradient} hover:border-primary/50 transition-colors`}
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.alt}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                      }}
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          {achievement.certificate_url && (
                            <a
                              href={achievement.certificate_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 transition-colors w-fit text-sm font-medium"
                            >
                              <FileBadge className="w-4 h-4" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && !error && filteredAchievements.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No achievements match this filter.
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-foreground hover:text-primary transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {lightbox.achievement.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox(-1);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-foreground hover:text-primary transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox(1);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-foreground hover:text-primary transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.achievement.images[lightbox.index].url}
                alt={lightbox.achievement.images[lightbox.index].alt}
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center">
                <p className="text-foreground font-medium">
                  {lightbox.achievement.images[lightbox.index].caption ||
                    lightbox.achievement.images[lightbox.index].alt}
                </p>
                {lightbox.achievement.images.length > 1 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {lightbox.index + 1} / {lightbox.achievement.images.length}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
