import { useState } from "react";
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

import {
  detailedAchievements,
  getPositionColor,
} from "@/app/data/appData";
import { PositionEnum, type DetailedAchievement } from "@/app/types/achievements";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

const positionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  [PositionEnum.FIRST]: Trophy,
  [PositionEnum.SECOND]: Medal,
  [PositionEnum.THIRD]: Medal,
  [PositionEnum.WINNER]: Award,
  [PositionEnum.RUNNER_UP]: Award,
  [PositionEnum.FINALIST]: Star,
  [PositionEnum.PARTICIPANT]: Star,
  [PositionEnum.HONORABLE_MENTION]: Star,
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface LightboxState {
  achievement: DetailedAchievement;
  index: number;
  showCertificate?: boolean;
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<PositionEnum | "all">("all");
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const filteredAchievements =
    filter === "all"
      ? detailedAchievements
      : detailedAchievements.filter((a) => a.position === filter);

  const positions: (PositionEnum | "all")[] = [
    "all",
    PositionEnum.FIRST,
    PositionEnum.WINNER,
    PositionEnum.SECOND,
    PositionEnum.FINALIST,
  ];

  const stats = {
    total: detailedAchievements.length,
    firstPlace: detailedAchievements.filter((a) => a.position === PositionEnum.FIRST)
      .length,
    wins: detailedAchievements.filter(
      (a) => a.position === PositionEnum.FIRST || a.position === PositionEnum.WINNER,
    ).length,
    competitions: new Set(detailedAchievements.map((a) => a.competition_name)).size,
  };

  const openLightbox = (
    achievement: DetailedAchievement,
    index: number,
    showCertificate = false,
  ) => {
    setLightbox({ achievement, index, showCertificate });
  };

  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (dir: 1 | -1) => {
    if (!lightbox) return;
    const total = lightbox.achievement.images.length;
    const newIndex = (lightbox.index + dir + total) % total;
    setLightbox({ ...lightbox, index: newIndex, showCertificate: false });
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
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement, index) => {
                const Icon = positionIcons[achievement.position] || Trophy;
                const gradient = getPositionColor(achievement.position);

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
                      {/* Left — Hero Image */}
                      <div className="lg:col-span-2 relative h-64 lg:h-auto min-h-[300px] overflow-hidden group">
                        <img
                          src={achievement.images[0]?.url}
                          alt={achievement.images[0]?.alt}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                          onClick={() => openLightbox(achievement, 0)}
                          loading="lazy"
                        />
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

                      {/* Right — Content */}
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
                                  className="relative aspect-square rounded-lg overflow-hidden group border border-border hover:border-primary/50 transition-colors"
                                >
                                  <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                          <button
                            onClick={() => openLightbox(achievement, 0, true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 transition-colors w-fit text-sm font-medium"
                          >
                            <FileBadge className="w-4 h-4" />
                            View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredAchievements.length === 0 && (
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

            {!lightbox.showCertificate && lightbox.achievement.images.length > 1 && (
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
                src={
                  lightbox.showCertificate
                    ? lightbox.achievement.certificate_url?.url
                    : lightbox.achievement.images[lightbox.index].url
                }
                alt={
                  lightbox.showCertificate
                    ? lightbox.achievement.certificate_url?.alt
                    : lightbox.achievement.images[lightbox.index].alt
                }
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center">
                <p className="text-foreground font-medium">
                  {lightbox.showCertificate
                    ? `Certificate — ${lightbox.achievement.title}`
                    : lightbox.achievement.images[lightbox.index].caption ||
                      lightbox.achievement.images[lightbox.index].alt}
                </p>
                {!lightbox.showCertificate &&
                  lightbox.achievement.images.length > 1 && (
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
