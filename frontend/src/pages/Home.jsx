import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PiggyBank,
  TrendingUp,
  Shield,
  Target,
  BookOpen,
  Users,
  Zap,
  Star,
  ArrowRight,
  ChevronRight,
  BarChart3,
  CheckCircle,
  Sparkles,
  Lock,
  Trophy,
  Globe
} from "lucide-react";

const FEATURE_CARDS = [
  {
    icon: PiggyBank,
    key: "finance",
    color: "from-blue-500 to-cyan-400",
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30"
  },
  {
    icon: Target,
    key: "goals",
    color: "from-emerald-500 to-teal-400",
    bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
  },
  {
    icon: TrendingUp,
    key: "reports",
    color: "from-purple-500 to-violet-400",
    bgColor: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30"
  },
  {
    icon: BookOpen,
    key: "education",
    color: "from-orange-500 to-amber-400",
    bgColor: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30"
  }
];

const STAT_CARDS = [
  { key: "users", icon: Users, color: "from-blue-400 to-cyan-300" },
  { key: "goals", icon: Trophy, color: "from-emerald-400 to-teal-300" },
  { key: "savings", icon: PiggyBank, color: "from-purple-400 to-violet-300" }
];

const TESTIMONIAL_CARDS = [
  { key: "maria", color: "from-blue-500 to-cyan-400" },
  { key: "joao", color: "from-emerald-500 to-teal-400" },
  { key: "ana", color: "from-purple-500 to-violet-400" }
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleDemoAccess = async () => {
    setLoading(true);
    localStorage.setItem("demoMode", "true");
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo premium */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-sky-400 to-blue-500 dark:from-zinc-950 dark:via-violet-950/30 dark:to-purple-950/50" />
        <div className="absolute -top-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-violet-400/30 to-purple-500/30 blur-3xl" />
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-sky-500/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute left-1/3 top-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 blur-2xl"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header premium */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl shadow-lg"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <PiggyBank className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{t("brand.short")}</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleDemoAccess}
              disabled={loading}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  {t("home.header.demoLoading")}
                </div>
              ) : (
                t("home.header.demo")
              )}
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              {t("home.header.login")}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero premium */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative px-6 py-32 text-center text-white"
      >
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              {t("home.hero.badge")}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 bg-gradient-to-r from-white via-white to-blue-100 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl"
          >
            {t("brand.name")}
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6 text-2xl font-semibold md:text-4xl"
          >
            {t("home.hero.subtitle")}{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {t("home.hero.subtitleHighlight")}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto mb-12 max-w-3xl text-lg opacity-90 leading-relaxed"
          >
            {t("home.hero.description")}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              onClick={handleDemoAccess}
              disabled={loading}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-2xl transition-all hover:shadow-white/25"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600/30 border-t-indigo-600"></div>
                  {t("home.hero.loading")}
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  {t("home.hero.demo")}
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
            
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Lock className="h-5 w-5" />
              {t("home.hero.login")}
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features premium */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-indigo-50/50 to-blue-50/80 backdrop-blur-sm dark:from-zinc-900/90 dark:via-violet-950/30 dark:to-purple-950/50"></div>
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="mb-4 text-4xl font-bold text-zinc-800 dark:text-white md:text-5xl">
              {t("home.features.title")}{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("brand.short")}
              </span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              {t("home.features.subtitle")}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group rounded-3xl border border-white/20 bg-gradient-to-br ${feature.bgColor} p-8 text-center shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl`}
              >
                <div className="mb-6 flex justify-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h4 className="mb-3 text-xl font-bold text-zinc-800 dark:text-white">
                  {t(`home.features.items.${feature.key}.title`)}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {t(`home.features.items.${feature.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats premium */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="mb-4 text-4xl font-bold md:text-5xl">{t("home.stats.title")}</h3>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              {t("home.stats.subtitle")}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {STAT_CARDS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className="mb-4 flex justify-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="mb-2 text-5xl font-extrabold">{t(`home.stats.${stat.key}.number`)}</h4>
                <p className="text-white/80">{t(`home.stats.${stat.key}.label`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos premium */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/30 to-indigo-50/60 backdrop-blur-sm dark:from-zinc-900/95 dark:via-violet-950/20 dark:to-purple-950/40"></div>
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="mb-4 text-4xl font-bold text-zinc-800 dark:text-white md:text-5xl">
              {t("home.testimonials.title")} {' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("home.testimonials.highlight")}
              </span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              {t("home.testimonials.subtitle")}
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIAL_CARDS.map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group rounded-3xl border border-white/20 bg-white/60 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl dark:bg-zinc-900/60"
              >
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                  "{t(`home.testimonials.items.${user.key}.text`)}"
                </p>
                <div className="flex items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${user.color} text-white font-bold shadow-lg transition-transform group-hover:scale-110`}>
                    {t(`home.testimonials.items.${user.key}.name`).charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-zinc-800 dark:text-white">{t(`home.testimonials.items.${user.key}.name`)}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{t(`home.testimonials.items.${user.key}.role`)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA premium */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-4xl text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-4xl font-bold md:text-5xl">
              {t("home.cta.title")}{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {t("home.cta.highlight")}
              </span>
            </h3>
            <p className="mb-12 text-lg opacity-90 leading-relaxed">
              {t("home.cta.description")}
            </p>
            
            <motion.button
              onClick={handleDemoAccess}
              disabled={loading}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-indigo-600 shadow-2xl transition-all hover:shadow-white/25"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600/30 border-t-indigo-600"></div>
                  {t("home.cta.loading")}
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  {t("home.cta.button")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-6 text-sm opacity-75"
            >
              {t("home.cta.badge")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer premium */}
      <footer className="relative border-t border-white/10 bg-gradient-to-br from-zinc-900 via-gray-900 to-black px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">{t("brand.short")}</span>
            </div>
            
            <div className="mb-4 space-y-2">
              <p className="text-white/80">{t("home.footer.copyright", { year: currentYear })}</p>
              <p className="text-sm text-white/60">
                {t("home.footer.note")}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-white/50">
              <Globe className="h-4 w-4" />
              <span>{t("home.footer.tagline")}</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
