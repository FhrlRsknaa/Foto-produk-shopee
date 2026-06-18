import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Wifi, 
  Battery, 
  Heart,
  Palette,
  Layers,
  Smartphone,
  Laptop,
  Maximize,
  Volume2,
  ShoppingBag,
  X,
  CheckCircle2,
  Star
} from 'lucide-react';

// Import wallpaper images
import wp1 from './assets/images/1.jpg';
import wp2 from './assets/images/2.jpg';
import wp3 from './assets/images/3.jpg';
import wp4 from './assets/images/4.jpg';
import wp5 from './assets/images/5.jpg';
import wp6 from './assets/images/6.jpg';
import wp7 from './assets/images/7.jpg';
import wp8 from './assets/images/8.jpg';

interface Wallpaper {
  id: number;
  title: string;
  artist: string;
  src: string;
  theme: {
    bgStart: string;
    bgEnd: string;
    primary: string;
    secondary: string;
    tertiary: string;
    text: string;
    darkText: string;
  };
}

const WALLPAPERS: Wallpaper[] = [
  {
    id: 1,
    title: "Minty Peach Breeze",
    artist: "Shibuya Crossing • 2026",
    src: wp1,
    theme: {
      bgStart: "from-[#d1eedb]",
      bgEnd: "to-[#fce2ce]",
      primary: "#146c4f",
      secondary: "#a1edd0",
      tertiary: "#ffbf99",
      text: "text-[#0d3f2d]",
      darkText: "#146c4f"
    }
  },
  {
    id: 2,
    title: "Lavender Dreamscape",
    artist: "Golden Hour • Kyoto",
    src: wp2,
    theme: {
      bgStart: "from-[#e4dcf7]",
      bgEnd: "to-[#f8dfeb]",
      primary: "#5c3c92",
      secondary: "#ded2f9",
      tertiary: "#fccee1",
      text: "text-[#2e1c4a]",
      darkText: "#5c3c92"
    }
  },
  {
    id: 3,
    title: "Terracotta Canyon",
    artist: "Red Dunes • Tokyo",
    src: wp3,
    theme: {
      bgStart: "from-[#eed6c5]",
      bgEnd: "to-[#d7e5d8]",
      primary: "#89371f",
      secondary: "#fbd3bb",
      tertiary: "#c4ddc5",
      text: "text-[#3c170c]",
      darkText: "#89371f"
    }
  },
  {
    id: 4,
    title: "Sunny Playdough",
    artist: "Lofi Beats • Shibuya",
    src: wp4,
    theme: {
      bgStart: "from-[#fdf6cf]",
      bgEnd: "to-[#cee5fb]",
      primary: "#254378",
      secondary: "#fdf1ab",
      tertiary: "#dfecfc",
      text: "text-[#0e1d37]",
      darkText: "#254378"
    }
  },
  {
    id: 5,
    title: "Holographic Lemonade",
    artist: "Pastel Sunset • Osaka",
    src: wp5,
    theme: {
      bgStart: "from-[#fef3c7]",
      bgEnd: "to-[#dbeafe]",
      primary: "#92400e",
      secondary: "#fef08a",
      tertiary: "#bfdbfe",
      text: "text-[#78350f]",
      darkText: "#92400e"
    }
  },
  {
    id: 6,
    title: "Sage & Velvet",
    artist: "Spring Blossom • Nara",
    src: wp6,
    theme: {
      bgStart: "from-[#ecfdf5]",
      bgEnd: "to-[#fce7f3]",
      primary: "#065f46",
      secondary: "#a7f3d0",
      tertiary: "#fbcfe8",
      text: "text-[#064e3b]",
      darkText: "#065f46"
    }
  },
  {
    id: 7,
    title: "Glassy Neon Sunset",
    artist: "Shibuya Skyline • 2026",
    src: wp7,
    theme: {
      bgStart: "from-[#ccfbf1]",
      bgEnd: "to-[#ffedd5]",
      primary: "#0f766e",
      secondary: "#99f6e4",
      tertiary: "#fed7aa",
      text: "text-[#115e59]",
      darkText: "#0f766e"
    }
  },
  {
    id: 8,
    title: "Cyber Lime Velvet",
    artist: "Neo Kyoto Pulse",
    src: wp8,
    theme: {
      bgStart: "from-[#f0fdf4]",
      bgEnd: "to-[#fae8ff]",
      primary: "#16a34a",
      secondary: "#bbf7d0",
      tertiary: "#f5d0fe",
      text: "text-[#15803d]",
      darkText: "#16a34a"
    }
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [dragOffset, setDragOffset] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % WALLPAPERS.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + WALLPAPERS.length) % WALLPAPERS.length);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDrag = (_event: any, info: any) => {
    // Keep tracking offset value to shift all cards sideways beautifully
    setDragOffset(info.offset.x);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 70;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Maps logical wallpaper list index to iOS multitasking stack offset indexes (-2, -1, 0, 1)
  const getRelativeIndex = (i: number) => {
    let diff = i - index;
    const len = WALLPAPERS.length;
    while (diff > len / 2) diff -= len;
    while (diff < -len / 2) diff += len;
    return diff;
  };

  const activeWallpaper = WALLPAPERS[index];

  // Colors Extracted (dynamic room light palette themed by wallpaper)
  const roomBgStyles = `min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-tr ${activeWallpaper.theme.bgStart} ${activeWallpaper.theme.bgEnd} transition-all duration-1000 ease-out select-none overflow-hidden relative`;

  // Formatting clock & date
  const formatHour = (date: Date) => date.getHours().toString().padStart(2, '0');
  const formatMinute = (date: Date) => date.getMinutes().toString().padStart(2, '0');
  const formatDateStr = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div className={roomBgStyles}>
      
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/40 blur-[130px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-white/20 blur-[130px] pointer-events-none transition-all duration-1000" />

      {/* TOP HEADER: Simple Material Bar */}
      <div className="w-full max-w-lg z-10 flex flex-col items-center justify-center gap-2 px-4 mt-2">
        {/* FNTICLE Pill */}
        <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/55 backdrop-blur-md border border-white/70 shadow-xs text-sm font-black tracking-widest text-[#1D1B20]">
          <span>FNTICLE</span>
        </div>
        {/* THINKPAD L470 Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/45 backdrop-blur-md border border-white/60 shadow-xs text-xs font-semibold text-[#1D1B20]">
          <Laptop size={13} className="text-[#6750A4]" />
          <span>THINKPAD L470</span>
        </div>
      </div>

      {/* CENTERPIECE VIEWPORT: The iOS Recents Apps Swipable Stack */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 py-4">
        
        {/* The Carousel Platform Slot */}
        <div className="relative w-full h-[430px] flex items-center justify-center overflow-visible">
          {WALLPAPERS.map((wp, i) => {
            const diff = getRelativeIndex(i);
            const isCenter = diff === 0;

            // iOS-style recent applications spacing calculations
            // Cards overlap horizontally
            const cardWidth = 250;
            const horizontalOffsetFactor = 170; // 170px spacing means overlap by 80px
            const xPosition = diff * horizontalOffsetFactor + dragOffset;
            
            // Background scale decrease
            const scale = isCenter ? 1 : 0.85;
            
            // Push background cards slightly down / up
            const yPosition = isCenter ? 0 : 15;
            
            // Opacity decay
            const opacity = isCenter ? 1 : 0.6;

            // Proper iOS overlap layering
            let zIndex = 30;
            if (diff < 0) {
              zIndex = 20 + diff; // e.g. -1 has 19, -2 has 18
            } else if (diff > 0) {
              zIndex = 25 - diff; // e.g. 1 has 24
            }

            return (
              <motion.div
                key={wp.id}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDrag={isCenter ? handleDrag : undefined}
                onDragEnd={isCenter ? handleDragEnd : undefined}
                style={{
                  zIndex,
                  cursor: isCenter ? (Math.abs(dragOffset) > 5 ? 'grabbing' : 'grab') : 'default',
                  touchAction: 'none'
                }}
                animate={{
                  x: xPosition,
                  y: yPosition,
                  scale,
                  opacity,
                  transition: { type: "spring", stiffness: 350, damping: 28 }
                }}
                className="absolute w-[250px] h-[390px] rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(103,80,164,0.15)] bg-white border-[10px] border-white"
              >
                <img 
                  src={wp.src} 
                  alt={wp.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Telegram Username Info Pill */}
        <a 
          href="https://t.me/akuorangbaikkok" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/45 backdrop-blur-md border border-white/50 shadow-xs text-[11px] font-semibold text-[#1D1B20]/80 hover:bg-white/60 hover:text-sky-600 transition-all cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#229ED9] shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.48-.42-1.42-.88.03-.24.37-.48 1.02-.73 3.98-1.73 6.63-2.87 7.95-3.41 3.77-1.55 4.56-1.82 5.07-1.83.11 0 .36.03.53.17.14.12.18.28.2.45-.02.07-.01.15-.02.22z"/>
          </svg>
          <span className="tracking-wide">fhrlvlyn</span>
        </a>

      </div>

      {/* BOTTOM CONTROL TAB: Compact Elegant Pills */}
      <div className="w-full max-w-md z-10 flex flex-col items-center gap-4 mt-auto mb-4">
        
        {/* Controls block */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 px-4 py-3 rounded-[32px] shadow-sm w-full flex items-center justify-between gap-3">
          
          {/* Previous Card */}
          <button 
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] border border-white/50 transition-all active:scale-90 text-[#6750A4]"
            title="Sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Indicators indicator dot */}
          <div className="flex gap-1.5 bg-[#F3EDF7]/80 py-1.5 px-2.5 rounded-full border border-black/5">
            {WALLPAPERS.map((wp, i) => (
              <button
                key={wp.id}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 focus:outline-none ${i === index ? 'w-4 bg-[#6750A4]' : 'w-1 bg-[#CAC4D0] hover:bg-black/30'}`}
                title={`Pilih Wallpaper ${i+1}`}
              />
            ))}
          </div>

          {/* Shopee Buy Button */}
          <a 
            href="https://id.shp.ee/wwL5U9sd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#EE4D2D]/80 backdrop-blur-md hover:bg-[#EE4D2D] transition-all active:scale-95 text-white font-bold text-xs shadow-sm shadow-orange-500/10 cursor-pointer"
            title="Beli Wallpaper"
          >
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>
              <path d="M12 10c-1.1 0-1.5.4-1.5.8s.4.6 1.1.8c1.1.3 1.9.6 1.9 1.7 0 1-.9 1.7-2 1.7s-1.8-.4-1.9-1.2h1.2c.1.4.4.5.7.5s.8-.2.8-.5c0-.4-.4-.5-.9-.6C10.1 13.4 9.3 13 9.3 12c0-1 .9-1.8 2-1.8c1.1 0 1.6.4 1.7 1h-1.1c0-.1-.3-.2-.6-.2z"/>
            </svg>
            <span>Beli</span>
          </a>

          {/* Next Card */}
          <button 
            onClick={handleNext}
            className="p-2.5 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] border border-white/50 transition-all active:scale-90 text-[#6750A4]"
            title="Berikutnya"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Simple Home Pill Indicator typical of iOS & Android fullscreen apps */}
        <div className="w-24 h-1 bg-[#1D1B20]/25 rounded-full animate-pulse mt-1" />
      </div>

      {/* Shopee Checkout Dialog Sheet Overlay */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-t-[36px] md:rounded-[36px] w-full max-w-sm overflow-hidden text-slate-800 p-6 flex flex-col relative shadow-2xl border border-neutral-100"
            >
              <button 
                onClick={() => { setShowBuyModal(false); setOrderSuccess(false); }}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500 active:scale-95"
              >
                <X size={16} />
              </button>

              {orderSuccess ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Pesanan Sukses!</h3>
                  <p className="text-xs text-slate-500 px-3 leading-relaxed">Paket Android 16 Wallpaper "<strong>{activeWallpaper.title}</strong>" berhasil dipesan di Shopee.</p>
                  
                  <button 
                    onClick={() => { setShowBuyModal(false); setOrderSuccess(false); }}
                    className="mt-6 w-full py-3 rounded-full bg-[#EE4D2D] text-white font-semibold text-xs shadow-md hover:bg-[#d83f21] active:scale-98 transition-all"
                  >
                    Selesai Belanja
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-orange-600 text-[10px] font-bold uppercase tracking-widest bg-orange-50 self-start px-2.5 py-1 rounded-full mb-3 border border-orange-100 flex items-center gap-1">
                    <Star size={11} fill="currentColor" /> Shopee Mall Premium
                  </span>

                  <div className="flex gap-4 items-center mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <img 
                      src={activeWallpaper.src} 
                      alt={activeWallpaper.title} 
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200/80"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{activeWallpaper.title}</h4>
                      <p className="text-[9px] text-slate-400 font-mono truncate">{activeWallpaper.artist}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-[#EE4D2D]">
                        <span>Rp59.000</span>
                        <span className="text-[9px] text-slate-400 line-through font-normal ml-1">Rp120.000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs mb-5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Harga Paket Wallpaper</span>
                      <span className="font-semibold text-slate-900">Rp59.000</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Ongkir Terproteksi</span>
                      <span className="font-semibold text-emerald-600">Gratis Ongkir</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-slate-100 pt-2 text-xs">
                      <span className="font-semibold text-slate-800">Total Pembayaran</span>
                      <span className="font-black text-[#EE4D2D] text-sm">Rp59.000</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setOrderSuccess(true)}
                    className="w-full py-3 rounded-full bg-[#EE4D2D] text-white font-bold text-xs shadow-md hover:bg-[#d83f21] active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Confirm Checkout Shopee
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
