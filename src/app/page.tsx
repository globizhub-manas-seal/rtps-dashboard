"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  ChevronDown,
  BarChart3,
  Target,
  Lightbulb,
  Users,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Landmark,
  FileText,
  ShieldCheck,
  X,
  Phone,
  Mail,
  MapPin,
  Check,
  Info,
  ExternalLink,
  Loader2,
  Clock,
  Building2,
  Scale,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // State
  const [username, setUsername] = useState("admin@rtps.assam.gov.in");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "as">("en");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<
    "contact" | "rtps-act" | "forgot-pass" | "privacy" | "terms" | "accessibility" | null
  >(null);

  // Handle Login & Demo Redirection
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    localStorage.setItem("demo_rbac_role", "ASCRTPS_ADMIN");
    document.cookie = "demo_rbac_role=ASCRTPS_ADMIN; path=/; max-age=86400";
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleContinueAsDemo = () => {
    handleRoleDemoLogin("ASCRTPS_ADMIN");
  };

  const handleRoleDemoLogin = (role: string) => {
    setIsSubmitting(true);
    localStorage.setItem("demo_rbac_role", role);
    document.cookie = `demo_rbac_role=${role}; path=/; max-age=86400`;
    setTimeout(() => {
      if (role === "PUBLIC") {
        router.push("/public-performance");
      } else {
        router.push("/dashboard");
      }
    }, 300);
  };

  // Content Translations
  const content = {
    en: {
      govAssam: "GOVERNMENT OF ASSAM",
      govAssamLocal: "অসম চৰকাৰ",
      titleMain: "RTPS",
      titleHighlight: "Performance Intelligence",
      prototypeBadge: "PROTOTYPE",
      subTitle: "Administrative Reforms & RTPS Ecosystem",
      navHome: "Home",
      navAbout: "About",
      navFeatures: "Features",
      navContact: "Contact",
      heroLine1: "Data-Driven",
      heroHighlight: "RTPS",
      heroLine2: "Governance",
      heroLine3: "for a More Responsive Assam",
      heroDesc:
        "A unified platform to monitor, analyze and improve delivery of citizen services under the",
      heroDescHighlight: "Right to Public Services (RTPS) Act.",
      features: [
        {
          id: "monitor",
          title: "Monitor",
          desc: "SLA performance across departments",
          icon: BarChart3,
        },
        {
          id: "identify",
          title: "Identify",
          desc: "Delays and bottlenecks",
          icon: Target,
        },
        {
          id: "enable",
          title: "Enable",
          desc: "Data-driven decision making",
          icon: Lightbulb,
        },
        {
          id: "improve",
          title: "Improve",
          desc: "Citizen service delivery outcomes",
          icon: Users,
        },
      ],
      signInTitle: "Sign In",
      signInDesc: "Access the RTPS Performance Intelligence platform",
      usernameLabel: "Username",
      usernamePlaceholder: "Enter your username",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPass: "Forgot password?",
      signInBtn: "Sign In",
      or: "OR",
      demoTitle: "Continue as Demo User",
      demoSub: "Explore sample data and features",
      stats: {
        depts: "Departments",
        services: "Services (RTPS)",
        districts: "Districts across Assam",
        taglineTitle: "Faster, Transparent",
        taglineSubtitle: "& Accountable",
        taglineDesc: "Service Delivery",
      },
    },
    as: {
      govAssam: "GOVERNMENT OF ASSAM",
      govAssamLocal: "অসম চৰকাৰ",
      titleMain: "RTPS",
      titleHighlight: "পাৰদৰ্শিতা সূচক প্ৰণালী",
      prototypeBadge: "প্ৰট'টাইপ",
      subTitle: "প্ৰশাসনিক সংস্কাৰ আৰু সেৱা সেতু ব্যৱস্থাপনা",
      navHome: "মূল পৃষ্ঠা",
      navAbout: "বিষয়ে",
      navFeatures: "সুবিধাসমূহ",
      navContact: "যোগাযোগ",
      heroLine1: "তথ্য-চালিত",
      heroHighlight: "আৰ.টি.পি.এছ.",
      heroLine2: "সুশাসন",
      heroLine3: "এখন সঁহাৰিমুখী অসমৰ বাবে",
      heroDesc:
        "লোকসেৱা অধিকাৰ আইনৰ অধীনত নাগৰিক সেৱাসমূহ নিৰীক্ষণ, বিশ্লেষণ আৰু ক্ষিপ্ৰ কৰাৰ একত্ৰিত মঞ্চ",
      heroDescHighlight: "লোকসেৱা অধিকাৰ (RTPS) আইন।",
      features: [
        {
          id: "monitor",
          title: "নিৰীক্ষণ",
          desc: "বিভাগসমূহৰ SLA মানদণ্ড পৰ্যবেক্ষণ",
          icon: BarChart3,
        },
        {
          id: "identify",
          title: "চিনাক্তকৰণ",
          desc: "সেৱা প্ৰদানত বিলম্ব আৰু বাধা নিৰ্ধাৰণ",
          icon: Target,
        },
        {
          id: "enable",
          title: "ক্ষমতায়ন",
          desc: "তথ্য-আধাৰিত নীতিগত সিদ্ধান্ত গ্ৰহণ",
          icon: Lightbulb,
        },
        {
          id: "improve",
          title: "উন্নয়ন",
          desc: "নাগৰিক সেৱা প্ৰদানৰ মানদণ্ড বৃদ্ধি",
          icon: Users,
        },
      ],
      signInTitle: "প্ৰৱেশ কৰক (Sign In)",
      signInDesc: "RTPS পাৰদৰ্শিতা সূচক প্ৰণালীত প্ৰৱেশ কৰক",
      usernameLabel: "ব্যৱহাৰকাৰীৰ নাম",
      usernamePlaceholder: "ইউজাৰনেম লিখক",
      passwordLabel: "পাছৱৰ্ড",
      passwordPlaceholder: "পাছৱৰ্ড লিখক",
      rememberMe: "মনত ৰাখক",
      forgotPass: "পাছৱৰ্ড পাহৰিলে নেকি?",
      signInBtn: "প্ৰৱেশ কৰক",
      or: "বা",
      demoTitle: "ডেমো হিচাপে আৰম্ভ কৰক",
      demoSub: "নমুনা তথ্য আৰু সুবিধাসমূহ চাওক",
      stats: {
        depts: "বিভাগসমূহ",
        services: "RTPS সেৱা",
        districts: "অসমৰ জিলাসমূহ",
        taglineTitle: "দ্ৰুত, স্বচ্ছ",
        taglineSubtitle: "আৰু দায়বদ্ধ",
        taglineDesc: "সেৱা প্ৰদান",
      },
    },
  };

  const t = content[currentLang];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#061424] text-white selection:bg-amber-400 selection:text-slate-900 font-sans">
      {/* ========================================================================= */}
      {/* 1. SCENIC BACKGROUND                                                      */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: "url('/images/background.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#031120]/85 via-[#031120]/45 to-[#031120]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020a13] via-transparent to-[#020a13]/70" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP GOVERNMENT NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full pt-4 pb-2 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* Left: Authentic Government of Assam Emblem (FIXED: NOT bleached white) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              {/* Circular clean badge with gold border preserving true emblem colors */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white flex items-center justify-center p-1 shadow-md border-2 border-amber-400/80 flex-shrink-0">
                <img
                  src="/logo/assam-gov-logo.png"
                  alt="Government of Assam Emblem"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] sm:text-sm font-semibold text-white tracking-wide">
                  {t.govAssamLocal}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                  {t.govAssam}
                </span>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden sm:block w-px h-9 bg-amber-400/50 mx-1" />

            {/* Product Title & Subtitle */}
            <div className="hidden sm:flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {t.titleMain}{" "}
                  <span className="text-amber-400">{t.titleHighlight}</span>
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
                  {t.prototypeBadge}
                </span>
              </div>
              <span className="text-[11px] text-sky-100/70 font-normal">
                {t.subTitle}
              </span>
            </div>
          </div>

          {/* Right: Navigation Links & Language Dropdown */}
          <div className="flex items-center gap-4 sm:gap-7">
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-200">
              <Link
                href="/"
                className="text-white font-semibold hover:text-amber-400 transition-colors"
              >
                {t.navHome}
              </Link>
              <Link
                href="/about"
                className="text-slate-300 hover:text-white transition-colors"
              >
                {t.navAbout}
              </Link>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("features-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {t.navFeatures}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("contact")}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {t.navContact}
              </button>
            </nav>

            <div className="hidden md:block w-px h-4 bg-slate-600/80" />

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/70 hover:border-amber-400/60 text-xs font-medium text-slate-200 hover:text-white backdrop-blur-sm transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentLang === "en" ? "English" : "অসমীয়া"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0a1f33] border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("en");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#133554] transition-colors ${
                      currentLang === "en" ? "text-amber-400 font-bold" : "text-slate-200"
                    }`}
                  >
                    <span>English</span>
                    {currentLang === "en" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("as");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#133554] transition-colors ${
                      currentLang === "as" ? "text-amber-400 font-bold" : "text-slate-200"
                    }`}
                  >
                    <span>অসমীয়া (Assamese)</span>
                    {currentLang === "as" && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN HERO & LOGIN SECTION                                              */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Hero Headline & Feature Highlights                       */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Yellow Accent Bar */}
            <div className="w-12 h-1 bg-amber-400 rounded-full mb-5 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />

            {/* Hero Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.12]">
              {t.heroLine1} <br />
              <span className="text-amber-400">{t.heroHighlight}</span> {t.heroLine2} <br />
              {t.heroLine3}
            </h1>

            {/* Subheading with highlighted RTPS Act */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-xl leading-relaxed font-normal">
              {t.heroDesc}{" "}
              <button
                type="button"
                onClick={() => setActiveModal("rtps-act")}
                className="text-amber-400 font-semibold hover:underline inline text-left cursor-pointer"
              >
                {t.heroDescHighlight}
              </button>
            </p>

            {/* 4 Feature Highlights Grid */}
            <div
              id="features-section"
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 max-w-2xl"
            >
              {t.features.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="bg-[#0b2742]/50 hover:bg-[#0b2742]/80 backdrop-blur-md border border-[#1d4d75]/60 hover:border-amber-400/50 transition-all duration-200 rounded-xl p-3.5 flex items-center gap-3 group shadow-md"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0e3b66] border border-sky-400/30 flex items-center justify-center text-sky-300 flex-shrink-0 group-hover:scale-105 group-hover:text-amber-300 transition-all">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {feat.title}
                      </span>
                      <span className="text-[10px] text-slate-300 leading-tight mt-0.5 line-clamp-2">
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Government Sign In Card (ENLARGED LOGOS)                */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-white/90 relative backdrop-blur-sm">
              
              {/* Top Branding Logos Strip - BIGGER & PROPORTIONED */}
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-200">
                {/* 1. Assam Gov Emblem - Noticeably Bigger */}
                <div className="flex flex-col items-center justify-center flex-1 h-16 sm:h-18 px-1">
                  <img
                    src="/logo/assam-gov-logo.png"
                    alt="Govt of Assam"
                    className="h-14 sm:h-16 w-auto max-w-[95px] object-contain drop-shadow-sm"
                  />
                </div>

                <div className="w-px h-12 bg-slate-200" />

                {/* 2. Sewa Setu Logo - Noticeably Bigger */}
                <div className="flex flex-col items-center justify-center flex-1 h-16 sm:h-18 px-1">
                  <img
                    src="/logo/sewa-setu.png"
                    alt="Sewa Setu Assam"
                    className="h-14 sm:h-16 w-auto max-w-[95px] object-contain drop-shadow-sm"
                  />
                </div>

                <div className="w-px h-12 bg-slate-200" />

                {/* 3. Digital India Logo - Noticeably Bigger */}
                <div className="flex flex-col items-center justify-center flex-1 h-16 sm:h-18 px-1">
                  <img
                    src="/logo/digital-india.png"
                    alt="Digital India"
                    className="h-11 sm:h-13 w-auto max-w-[115px] object-contain drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Card Header */}
              <div className="text-center mt-5 mb-5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {t.signInTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t.signInDesc}
                </p>
                <div className="mt-2 inline-block">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {t.prototypeBadge}
                  </span>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.usernameLabel}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t.usernamePlaceholder}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2545]/20 focus:border-[#0b2545] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2545]/20 focus:border-[#0b2545] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0b2545] border-slate-300 focus:ring-[#0b2545] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 select-none">
                      {t.rememberMe}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setActiveModal("forgot-pass")}
                    className="text-xs text-sky-700 hover:text-sky-900 font-medium transition-colors cursor-pointer"
                  >
                    {t.forgotPass}
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0b2545] hover:bg-[#123866] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.signInBtn}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* "OR" Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                  {t.or}
                </span>
              </div>

              {/* Secondary Demo Button */}
              <button
                type="button"
                onClick={handleContinueAsDemo}
                disabled={isSubmitting}
                className="w-full bg-[#eef5fc] hover:bg-[#e1edf9] border border-[#cbe1f7] rounded-xl p-3.5 flex items-center gap-3.5 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0b2545] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4 text-[#0b2545]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#0b2545] group-hover:text-blue-950 transition-colors">
                    {t.demoTitle}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {t.demoSub}
                  </span>
                </div>
              </button>

              {/* Quick Role Demo Selector */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 text-center">
                  Quick Demo By Governance Role:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("ASCRTPS_ADMIN")}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>👑</span>
                    <span className="truncate">State Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("DEPARTMENT_ADMIN")}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>🏛️</span>
                    <span className="truncate">Dept Nodal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("OFFICE_HEAD")}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>🏢</span>
                    <span className="truncate">District DC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("REVIEWER")}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>⚖️</span>
                    <span className="truncate">Inquiry Reviewer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("DPS")}
                    className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>👤</span>
                    <span className="truncate">DPS Officer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleDemoLogin("PUBLIC")}
                    className="p-1.5 rounded border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-semibold text-emerald-800 text-left truncate flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>🌐</span>
                    <span className="truncate">Public Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM KEY STATISTICS STRIP                                            */}
      {/* ========================================================================= */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-10 py-3">
        <div className="max-w-[1440px] mx-auto bg-[#091b2c]/80 backdrop-blur-md border border-[#1b3d5b]/80 rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
            
            {/* Stat 1: 40+ Departments */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Landmark className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  40+
                </span>
                <span className="text-xs text-slate-300 font-medium mt-1">
                  {t.stats.depts}
                </span>
              </div>
            </div>

            {/* Stat 2: 500+ Services */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  500+
                </span>
                <span className="text-xs text-slate-300 font-medium mt-1">
                  {t.stats.services}
                </span>
              </div>
            </div>

            {/* Stat 3: 33+ Districts */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  33+
                </span>
                <span className="text-xs text-slate-300 font-medium mt-1">
                  {t.stats.districts}
                </span>
              </div>
            </div>

            {/* Stat 4: Service Delivery Commitment */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {t.stats.taglineTitle} <br className="hidden sm:inline" />
                  {t.stats.taglineSubtitle}
                </span>
                <span className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {t.stats.taglineDesc}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPANDED RICH GOVERNMENT FOOTER WITH UPLOADED LOGOS                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full pt-10 pb-6 px-4 sm:px-6 lg:px-10 border-t border-slate-800/90 bg-[#020b14]/95 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto space-y-8">
          
          {/* Top Row: Mission Statement & Direct Helpdesk Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80">
            {/* Mission Statement */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md border-2 border-amber-400/80 flex-shrink-0">
                <img
                  src="/logo/assam-gov-logo.png"
                  alt="Government of Assam"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-white tracking-tight">
                    RTPS Performance Intelligence Platform
                  </span>
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded text-[10px] font-bold uppercase tracking-wider">
                    Official Prototype
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  Administrative Reforms, Training, Pension and Public Grievances Department • Government of Assam
                </p>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Established under the mandate of the <strong>Assam Right to Public Services Act, 2012</strong>, this unified intelligence system enables statutory compliance monitoring, automated delivery turnaround tracking, bottleneck identification, and objective officer commendations across 40+ state departments and 33+ administrative districts.
                </p>
              </div>
            </div>

            {/* Quick Contact & Escalation Box */}
            <div className="lg:col-span-4 bg-[#091b2c]/80 border border-slate-700/60 rounded-xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                RTPS Helpdesk & Citizen Escalation
              </span>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Toll-Free: <strong className="text-white">1800-345-3574</strong> (09:00 AM – 06:00 PM)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Email: <strong className="text-white">rtps-support@assam.gov.in</strong></span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Assam Administrative Staff College, Khanapara, Guwahati – 781022</span>
              </div>
            </div>
          </div>

          {/* Middle Row: 4-Column Directory Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-slate-800/80 text-xs text-slate-300">
            {/* Col 1: Statutory Framework */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-[13px] tracking-wide uppercase flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" /> RTPS Framework
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><button type="button" onClick={() => setActiveModal("rtps-act")} className="hover:text-white transition-colors cursor-pointer text-left">Assam RTPS Act 2012</button></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Notified Delivery Timelines</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Designated Public Servants (DPS)</Link></li>
                <li><button type="button" onClick={() => setActiveModal("rtps-act")} className="hover:text-white transition-colors cursor-pointer text-left">Two-Tier Appellate Structure</button></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Statutory Penalty Provisions</Link></li>
              </ul>
            </div>

            {/* Col 2: Government Portals */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-[13px] tracking-wide uppercase flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-400" /> State Portals
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="https://sewasetu.assam.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Sewa Setu Assam <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
                <li><a href="https://assam.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Government of Assam <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
                <li><Link href="/departments" className="hover:text-white transition-colors">State Department Directory</Link></li>
                <li><Link href="/offices" className="hover:text-white transition-colors">District & Circle Offices</Link></li>
                <li><Link href="/public-performance" className="hover:text-white transition-colors">Public Transparency Scorecard</Link></li>
              </ul>
            </div>

            {/* Col 3: Intelligence Modules */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-[13px] tracking-wide uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> System Modules
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Executive KPI Dashboard</Link></li>
                <li><Link href="/sla-monitor" className="hover:text-white transition-colors">Live SLA Breach Monitor</Link></li>
                <li><Link href="/dps" className="hover:text-white transition-colors">DPS Scorecard & Ratings</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">Administrative Reviews & Notices</Link></li>
                <li><Link href="/recognition" className="hover:text-white transition-colors">Merit Citations & Commendations</Link></li>
              </ul>
            </div>

            {/* Col 4: Standards & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-[13px] tracking-wide uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Standards & Policies
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><button type="button" onClick={() => setActiveModal("privacy")} className="hover:text-white transition-colors cursor-pointer text-left">Data Privacy & Sovereignty</button></li>
                <li><button type="button" onClick={() => setActiveModal("accessibility")} className="hover:text-white transition-colors cursor-pointer text-left">GIGW 3.0 & WCAG 2.1 AA</button></li>
                <li><button type="button" onClick={() => setActiveModal("terms")} className="hover:text-white transition-colors cursor-pointer text-left">Terms of Use & Prototype Notice</button></li>
                <li><Link href="/data-integration" className="hover:text-white transition-colors">API & Gateway Integration</Link></li>
                <li><Link href="/audit" className="hover:text-white transition-colors">Immutable Audit Trails</Link></li>
              </ul>
            </div>
          </div>

          {/* Third Row: Official Partner Logos (NIC, MeitY, DPIIT, Digital India, etc.) */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pt-2 pb-2">
            
            {/* Accreditation Logos with the User-Uploaded Assets */}
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6">
              
              {/* 1. NIC (National Informatics Centre) - Uploaded Logo */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/nic-logo.png"
                  alt="National Informatics Centre (NIC)"
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* 2. MeitY (Ministry of Electronics and Information Technology) - Uploaded Logo */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/meiyt.png"
                  alt="Ministry of Electronics and Information Technology (MeitY)"
                  className="h-9 w-auto object-contain"
                />
              </div>

              {/* 3. DPIIT (#startupindia) - Uploaded Logo */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/dpiit-logo.png"
                  alt="Recognised by DPIIT - Department for Promotion of Industry and Internal Trade"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

              {/* 4. Digital India Logo */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/digital-india.png"
                  alt="Digital India"
                  className="h-7 w-auto object-contain"
                />
              </div>

              {/* 5. Make in India */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/make-in-india.png"
                  alt="Make in India"
                  className="h-7 w-auto object-contain"
                />
              </div>

              {/* 6. Azadi Ka Amrit Mahotsav */}
              <div className="bg-white px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center justify-center h-12 transition-transform hover:scale-105">
                <img
                  src="/logo/azadikaamritpahotsav.png"
                  alt="Azadi Ka Amrit Mahotsav"
                  className="h-8 w-auto object-contain"
                />
              </div>

            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 text-slate-300">
              <span className="text-xs text-slate-400 font-medium mr-1">Follow Updates:</span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center hover:text-white transition-all text-xs font-bold"
                aria-label="X (Twitter)"
              >
                𝕏
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center hover:text-red-400 transition-all text-xs font-bold"
                aria-label="YouTube"
              >
                ▶
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center hover:text-sky-400 transition-all text-xs font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>

          </div>

          {/* Bottommost Legal / Copyright Line */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
              <span>© {new Date().getFullYear()} Government of Assam. All rights reserved.</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-amber-400 font-medium">RTPS Performance Intelligence (Prototype)</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span>Compliant with GIGW 3.0 & Digital Personal Data Protection Act</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal("privacy")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setActiveModal("accessibility")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Accessibility
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setActiveModal("terms")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setActiveModal("contact")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE MODALS                                                     */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1c2e] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Contact Modal */}
            {activeModal === "contact" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Government Support & Helpdesk</h3>
                    <p className="text-xs text-slate-400">Assam Right to Public Services Commission</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <Phone className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Toll-Free RTPS Helpline</span>
                      <span>1800-345-3574 (09:00 AM – 06:00 PM, Working Days)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Official Support Email</span>
                      <span>rtps-support@assam.gov.in</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Administrative Directorate</span>
                      <span>Assam Administrative Staff College, Khanapara, Guwahati – 781022</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* RTPS Act Information Modal */}
            {activeModal === "rtps-act" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Assam RTPS Act 2012 Overview</h3>
                    <p className="text-xs text-slate-400">Statutory Right to Public Services Framework</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
                  <p>
                    The <strong>Assam Right to Public Services Act, 2012</strong> mandates that every citizen of Assam has a statutory right to obtain notified government services within specified stipulated timelines.
                  </p>
                  <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-300 block">Core Tenets of the Act:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li><strong>Designated Public Servant (DPS):</strong> Official responsible for service delivery.</li>
                      <li><strong>Fixed Statutory Timelines:</strong> Delivery guaranteed between 3 to 30 days depending on service category.</li>
                      <li><strong>Appellate Hierarchy:</strong> Two-tiered appellate redressal mechanism against delays or wrongful rejection.</li>
                      <li><strong>Statutory Penalty:</strong> Daily fine of up to ₹250/day (max ₹5,000) for ungrounded non-delivery.</li>
                    </ul>
                  </div>
                  <p className="text-slate-400">
                    This Performance Intelligence platform continuously monitors compliance against these statutory benchmarks to identify bottlenecks before statutory breaches occur.
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Link
                    href="/about"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Learn more in About Platform <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Modal */}
            {activeModal === "forgot-pass" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Reset Official Credentials</h3>
                    <p className="text-xs text-slate-400">Authentication Service for Government Officials</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    RTPS Performance Intelligence user accounts are linked with government domain emails (e.g. <code>@assam.gov.in</code> or <code>@nic.in</code>).
                  </p>
                  <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-semibold text-white">In Prototype / Demo Mode:</span>
                    <p className="text-slate-400">
                      You can instantly click <strong>&quot;Continue as Demo User&quot;</strong> on the sign-in card to access the full executive dashboard without needing password resets.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      handleContinueAsDemo();
                    }}
                    className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Access Demo Dashboard Now
                  </button>
                </div>
              </div>
            )}

            {/* General Policy Modal (Privacy, Accessibility, Terms) */}
            {(activeModal === "privacy" || activeModal === "accessibility" || activeModal === "terms") && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 text-white flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">
                      {activeModal.replace("-", " ")} Policy
                    </h3>
                    <p className="text-xs text-slate-400">Government of Assam Digital Standards</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 max-h-[50vh] overflow-y-auto">
                  <p>
                    This prototype platform complies with the Guidelines for Indian Government Websites (GIGW 3.0), Digital Personal Data Protection (DPDP) Act, and WCAG 2.1 Level AA accessibility standards.
                  </p>
                  <p className="text-slate-400">
                    All application metrics and performance indicators displayed are synthesized from anonymized RTPS transaction patterns to maintain complete citizen privacy and data sovereignty.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
