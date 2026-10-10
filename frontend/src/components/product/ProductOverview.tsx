"use client";

import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  Sparkles,
  Camera,
  Battery,
  Zap,
  Layers,
  RotateCw,
} from "lucide-react";
import { IProduct } from "@/types";

interface ProductOverviewProps {
  product: IProduct;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  // 1. Overview Stats (5-column ribbon)
  const overviewStats =
    product.overviewBanner?.stats && product.overviewBanner.stats.length > 0
      ? product.overviewBanner.stats
      : [
          { label: "Sensor", value: "1-Inch CMOS" },
          { label: "Video", value: "4K/120fps HDR" },
          { label: "Stabilization", value: "3-Axis Gimbal" },
          { label: "Color Profile", value: "10-bit D-Log M" },
          { label: "Internal Storage", value: "107GB Built-in" },
        ];

  // 2. Bento Feature Cards (3 cards)
  const bentoCards =
    product.featureCards && product.featureCards.length > 0
      ? product.featureCards
      : [
          {
            title: "Rotatable OLED Display",
            description:
              "Rotate to power on and switch seamlessly between horizontal and vertical aspect ratios with full tactile touchscreen controls.",
            image: (product.images && product.images[1]) || product.mainImage,
            tag: "OLED Touch",
          },
          {
            title: "Pocket-Sized Portability",
            description:
              "Engineered into an ultra-compact frame that fits in your palm or pocket, ready for spontaneous Australian travel adventures.",
            image: (product.images && product.images[2]) || product.mainImage,
            tag: "Ultra Compact",
          },
          {
            title: "Lossless Hybrid Zoom",
            description:
              "High-resolution pixel binning delivers tack-sharp 2x to 4x clarity without compromising image detail or introducing noise.",
            image: (product.images && product.images[3]) || product.mainImage,
            tag: "Pure Optics",
          },
        ];

  // 3. Feature Story Blocks (Alternating Split Layouts)
  const storyBlocks =
    product.storyBlocks && product.storyBlocks.length > 0
      ? product.storyBlocks
      : [
          {
            title: "Next-Gen 1-Inch CMOS Sensor. Master Any Lighting Condition.",
            description:
              "The high-sensitivity 1-inch sensor captures breathtaking 4K/60fps HDR and high-speed slow motion. Equipped with an industry-leading 14 stops of dynamic range, it preserves crisp shadow details and prevents highlight blowouts even in harsh Australian midday sun.",
            image: (product.images && product.images[1]) || product.mainImage,
            tag: "Imaging Revolution",
            badge: "1-INCH CMOS",
          },
          {
            title: "ActiveTrack 7.0. Next-Level AI Subject Locking.",
            description:
              "Powered by deep-learning AI algorithms, ActiveTrack 7.0 detects and locks onto faces, human bodies, and fast vehicles with infallible accuracy. Even in chaotic crowded markets or high-speed sports, dynamic framing automatically keeps you centered.",
            image: (product.images && product.images[2]) || product.mainImage,
            tag: "Intelligent Tracking",
            badge: "ACTIVETRACK 7.0",
          },
          {
            title: "3-Axis Mechanical Gimbal vs Digital EIS.",
            description:
              "Unlike action cameras and smartphones that crop up to 30% of your frame using electronic stabilization (EIS)—which introduces motion blur and suffers in low light—the system utilizes physical brushless 3-axis motors operating at 1000Hz for buttery smooth cinema pans without losing a single pixel.",
            image: (product.images && product.images[3]) || product.mainImage,
            tag: "Physical Stabilization",
            badge: "TRUE 3-AXIS",
          },
          {
            title: "Pro 32-Bit Float Audio & Dual DJI Mic Link.",
            description:
              "Equipped with a tri-microphone omnidirectional array and intelligent ambient noise reduction. Built-in dual Wi-Fi audio receivers allow direct wireless pairing with two DJI Mic transmitters simultaneously without needing any external receiver plugged into the USB port.",
            image: (product.images && product.images[0]) || product.mainImage,
            tag: "Broadcast Audio",
            badge: "32-BIT FLOAT",
          },
        ];

  // 4. Hardware Performance Matrix
  const hardwareMatrix = [
    {
      icon: Battery,
      stat: "210 Mins",
      subtitle: "Continuous 1080p Recording",
      title: "Power Your Day",
      desc: "Upgraded high-density battery cell delivers up to 3.5 hours of operating time, or 160 minutes in full 4K/60fps without overheating.",
    },
    {
      icon: Zap,
      stat: "16 Mins",
      subtitle: "Recharge to 80% Capacity",
      title: "Rapid PD Quick Charge",
      desc: "Charges from 0% to 80% in just 16 minutes with standard 65W PD chargers, getting you back to shooting fast.",
    },
    {
      icon: Layers,
      stat: "107 GB",
      subtitle: "Built-In Solid State Flash",
      title: "High-Speed Storage",
      desc: "Never miss a shot if you forget your microSD card. Internal high-speed flash memory records hours of pristine 4K video instantly.",
    },
    {
      icon: RotateCw,
      stat: "800 MB/s",
      subtitle: "Direct USB 3.1 Gen 2 Transfer",
      title: "Blazing Data Offload",
      desc: "Wired high-speed transfer directly to your iPhone, Android, Mac or PC without needing an external card reader.",
    },
  ];

  return (
    <section id="overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[48px] md:py-[64px] space-y-[48px]">
      {/* Hero Cinematic Dark Card */}
      <div className="relative rounded-[28px] overflow-hidden bg-black text-white shadow-2xl border border-neutral-900 group">
        {/* Background Video / Image */}
        {product.overviewBanner?.videoUrl ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={videoRef}
              src={product.overviewBanner.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 pointer-events-none" />
          </div>
        ) : product.overviewBanner?.bgImage ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={product.overviewBanner.bgImage}
              alt={product.name}
              className="w-full h-full object-cover opacity-45 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#111113] via-[#08080a] to-black">
            <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-[#0071e3]/15 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Video Play/Pause Toggle button */}
        {product.overviewBanner?.videoUrl && (
          <button
            type="button"
            onClick={toggleVideo}
            className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
            aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          >
            {isVideoPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>
        )}

        {/* Card Content */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[460px] md:min-h-[520px]">
          <div className="max-w-[800px]">
            {/* Blue Kicker */}
            <span className="text-[#0071e3] font-bold uppercase text-[11px] sm:text-xs tracking-wider block mb-2">
              {product.overviewBanner?.badge || product.badge || "PRO-GRADE ELECTRONICS & IMAGING"}
            </span>

            {/* Big Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-3">
              {product.overviewBanner?.title || `${product.name}.`}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 max-w-[700px] leading-relaxed">
              {product.overviewBanner?.description || product.tagline || product.description}
            </p>
          </div>

          {/* 5-Column Stats Bar */}
          {overviewStats.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-0">
              {overviewStats.map((st: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="md:border-r md:border-white/15 md:last:border-r-0 md:px-6 md:first:pl-0 flex flex-col"
                >
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-semibold mt-1">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bento Feature Highlight Cards (3-Column Grid) */}
      {bentoCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoCards.map((card: any, idx: number) => (
            <div
              key={idx}
              className="rounded-[24px] border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Top Image */}
              <div className="aspect-[16/10] bg-[#0c0c0e] relative overflow-hidden flex items-center justify-center">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
                {card.tag && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                    {card.tag}
                  </span>
                )}
              </div>

              {/* Card Bottom Text */}
              <div className="p-6 md:p-7 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#121212] mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visual Feature Story Blocks */}
      {storyBlocks.length > 0 && (
        <div className="space-y-[32px] pt-4">
          <div className="text-center max-w-[700px] mx-auto mb-8">
            <span className="text-[#0071e3] font-bold uppercase text-[11px] sm:text-xs tracking-wider block mb-2">
              IN-DEPTH ARCHITECTURE
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#121212]">
              Engineered for Perfection.
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Explore the cutting-edge innovations and hardware capabilities built inside {product.name}.
            </p>
          </div>

          {storyBlocks.map((block: any, bIdx: number) => {
            const isEven = bIdx % 2 === 0;
            return (
              <div
                key={bIdx}
                className="bg-[#fbfbfd] border border-gray-200/90 rounded-[28px] p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs hover:shadow-md transition-shadow"
              >
                <div
                  className={`lg:col-span-6 relative aspect-[16/10] bg-black rounded-[22px] overflow-hidden group shadow-md ${
                    !isEven ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={block.image || product.mainImage}
                    alt={block.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {block.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase border border-white/10">
                      {block.badge}
                    </span>
                  )}
                </div>

                <div
                  className={`lg:col-span-6 space-y-4 ${
                    !isEven ? "lg:order-1" : ""
                  }`}
                >
                  {block.tag && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071e3] text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      {block.tag}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight leading-snug">
                    {block.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hardware Performance Matrix */}
      <div className="pt-6">
        <div className="text-center max-w-[700px] mx-auto mb-8">
          <span className="text-[#0071e3] font-bold uppercase text-[11px] sm:text-xs tracking-wider block mb-2">
            HARDWARE PERFORMANCE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#121212]">
            Unmatched Endurance &amp; Efficiency
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hardwareMatrix.map((hp, idx) => {
            const IconComponent = hp.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[22px] p-6 border border-gray-200/90 shadow-xs hover:border-[#0071e3]/40 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-[#0071e3] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#121212] tracking-tight">
                    {hp.stat}
                  </div>
                  <div className="text-xs font-semibold text-[#0071e3] mt-1 uppercase tracking-wide">
                    {hp.subtitle}
                  </div>
                  <h4 className="text-sm font-bold text-[#121212] mt-2">
                    {hp.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {hp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
