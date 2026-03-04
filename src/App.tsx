import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Camera, 
  Video, 
  Heart, 
  Mail, 
  MapPin, 
  Calendar, 
  Instagram, 
  Facebook, 
  X, 
  ChevronRight,
  Menu,
  Phone,
  Loader2
} from 'lucide-react';

// --- Types ---
interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: 'Photography' | 'Cinematography';
  size: 'normal' | 'tall' | 'short';
}

// --- Data ---
// Updated to look for images in /images/ folder named by numbers
const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, url: '/images/1.jpg', title: 'The First Look', category: 'Photography', size: 'tall' },
  { id: 2, url: '/images/2.jpg', title: 'Eternal Vows', category: 'Photography', size: 'short' },
  { id: 3, url: '/images/3.jpg', title: 'Golden Hour Love', category: 'Photography', size: 'normal' },
  { id: 4, url: '/images/4.jpg', title: 'The Celebration', category: 'Photography', size: 'tall' },
  { id: 5, url: '/images/5.jpg', title: 'Intimate Moments', category: 'Photography', size: 'short' },
  { id: 6, url: '/images/6.jpg', title: 'The Dance', category: 'Photography', size: 'normal' },
  { id: 7, url: '/images/7.jpg', title: 'Bridal Grace', category: 'Photography', size: 'tall' },
  { id: 8, url: '/images/8.jpg', title: 'Floral Details', category: 'Photography', size: 'short' },
];

// Fallback images if the local ones don't exist yet
const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/wedding1/800/1200',
  'https://picsum.photos/seed/wedding2/800/600',
  'https://picsum.photos/seed/wedding3/800/800',
  'https://picsum.photos/seed/wedding4/800/1000',
  'https://picsum.photos/seed/wedding5/800/600',
  'https://picsum.photos/seed/wedding6/800/800',
  'https://picsum.photos/seed/wedding7/800/1200',
  'https://picsum.photos/seed/wedding8/800/600',
];

const VIDEOS = [
  { id: 1, title: 'Sarah & James | Cinematic Highlight', thumbnail: 'https://picsum.photos/seed/vid1/1280/720', duration: '4:20' },
  { id: 2, title: 'The Royal Wedding | Full Film', thumbnail: 'https://picsum.photos/seed/vid2/1280/720', duration: '12:45' },
  { id: 3, title: 'Love in Tuscany | Destination Wedding', thumbnail: 'https://picsum.photos/seed/vid3/1280/720', duration: '3:15' },
];

// --- Components ---

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="cursor-follower"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
          scale: isHovering ? 2.5 : 1,
        }}
      />
      <motion.div
        className="cursor-dot"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6"
      >
        <img 
          src="/logo.png" 
          alt="Arrow Ads Wedding Logo" 
          className="h-24 md:h-48 w-auto mb-8 invert"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
            if (nextSibling) nextSibling.style.display = 'block';
          }}
        />
        <div style={{ display: 'none' }}>
          <h2 className="text-2xl md:text-5xl font-serif tracking-widest text-slate-900 mb-4">
            ARROW ADS <span className="text-gold italic">Wedding</span>
          </h2>
        </div>
        <div className="w-32 md:w-48 h-[1px] bg-slate-100 mx-auto relative overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gold"
          />
        </div>
        <p className="text-slate-400 uppercase tracking-[0.3em] text-[8px] md:text-[10px] mt-6">Capturing Timeless Stories</p>
      </motion.div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const sections = ['home', 'about', 'gallery', 'films', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Our Story', href: '#about', id: 'about' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Films', href: '#films', id: 'films' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3 md:py-4 shadow-sm' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="Arrow Ads Wedding" 
            className={`h-10 md:h-16 w-auto transition-all duration-500 ${isScrolled ? 'invert' : ''}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (nextSibling) nextSibling.style.display = 'block';
            }}
          />
          <span className={`text-xl md:text-2xl font-serif tracking-widest transition-colors duration-300 ml-4 hidden sm:inline-block ${isScrolled ? 'text-slate-900' : 'text-white'}`} style={{ display: 'none' }}>
            ARROW ADS <span className="text-gold italic">Wedding</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:text-gold relative group ${
                activeSection === link.id 
                  ? 'text-gold' 
                  : (isScrolled ? 'text-slate-600' : 'text-white/80')
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 flex flex-col items-center space-y-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm uppercase tracking-widest font-medium transition-colors ${activeSection === link.id ? 'text-gold' : 'text-slate-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/hero-wedding/1920/1080" 
          alt="Wedding Hero" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <img 
            src="/logo.png" 
            alt="Arrow Ads Wedding Logo" 
            className="h-32 md:h-64 w-auto mb-8 md:mb-12"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-white/80 uppercase tracking-[0.3em] text-[10px] md:text-sm mb-4 block">Photography & Cinematography</span>
          <h1 className="text-4xl md:text-8xl text-white mb-8 font-serif leading-tight">
            Capturing Your <br />
            <span className="italic">Timeless Story</span>
          </h1>
          <a 
            href="#gallery" 
            className="inline-block px-10 py-4 bg-white text-slate-900 uppercase tracking-widest text-xs font-semibold hover:bg-gold hover:text-white transition-all duration-300 rounded-sm"
          >
            View Our Work
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-[1px] h-12 bg-white/30 mx-auto"></div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative order-2 md:order-1"
        >
          <img 
            src="https://picsum.photos/seed/about-wedding/800/1000" 
            alt="Photographer at work" 
            className="w-full h-auto rounded-sm shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-10 -right-10 hidden lg:block w-64 h-64 bg-champagne -z-10"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="order-1 md:order-2"
        >
          <span className="text-gold uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-4 block">Our Story</span>
          <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 leading-tight">
            More Than Just <br />
            <span className="italic">A Photograph</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-base md:text-lg">
            At Arrow Ads Wedding, we believe that every wedding is a unique masterpiece waiting to be unveiled. Our philosophy is rooted in the art of observation—capturing the unscripted laughter, the quiet tears of joy, and the electric energy of your celebration.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8 md:mb-10 text-sm md:text-base">
            With over a decade of experience in high-end cinematography and photography, we don't just document events; we craft cinematic legacies. Our style is airy, romantic, and deeply personal, ensuring that your memories feel as vibrant fifty years from now as they do today.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Camera className="text-gold w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium uppercase tracking-tighter">Photography</span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="text-gold w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium uppercase tracking-tighter">Cinematography</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <section id="gallery" className="py-16 md:py-24 px-6 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto mb-12 md:mb-16 text-center">
        <span className="text-gold uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-4 block">The Gallery</span>
        <h2 className="text-3xl md:text-5xl italic">Captured Moments</h2>
      </div>

      <div className="max-w-7xl mx-auto masonry-grid gap-4">
        {GALLERY_IMAGES.map((image, index) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            onClick={() => setSelectedImage(image)}
            className={`relative overflow-hidden cursor-pointer group rounded-sm ${
              image.size === 'tall' ? 'masonry-item-tall' : 
              image.size === 'short' ? 'masonry-item-short' : 'masonry-item'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to picsum if local image not found
                (e.target as HTMLImageElement).src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
              <div className="text-white text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-serif italic text-xl md:text-2xl mb-1">{image.title}</p>
                <p className="text-white/70 uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{image.category}</p>
                <div className="w-8 md:w-12 h-[1px] bg-gold mx-auto mt-4"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img 
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const index = GALLERY_IMAGES.findIndex(img => img.id === selectedImage.id);
                (e.target as HTMLImageElement).src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              }}
            />
            <div className="absolute bottom-8 md:bottom-12 text-center text-white px-6">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-4xl font-serif italic"
              >
                {selectedImage.title}
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gold uppercase tracking-[0.3em] text-[10px] md:text-xs mt-3"
              >
                {selectedImage.category}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Cinematography = () => {
  return (
    <section id="films" className="py-16 md:py-24 px-6 bg-slate-custom text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div>
            <span className="text-gold uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-4 block">Cinematography</span>
            <h2 className="text-3xl md:text-5xl italic">Wedding Films</h2>
          </div>
          <p className="max-w-md text-white/60 leading-relaxed text-sm md:text-base">
            Our films are more than just videos; they are emotional journeys that transport you back to the very heartbeat of your wedding day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {VIDEOS.map((video) => (
            <motion.div 
              key={video.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden rounded-sm mb-6">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 text-[10px] tracking-widest uppercase">
                  {video.duration}
                </div>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-gold transition-colors">{video.title}</h3>
              <div className="flex items-center text-white/40 text-xs uppercase tracking-widest">
                <span>View Film</span>
                <ChevronRight size={14} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    venue: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you shortly.');
    setFormData({ name: '', email: '', date: '', venue: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-20">
        <div>
          <span className="text-gold uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-4 block">Get In Touch</span>
          <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 leading-tight">
            Let's Start Your <br />
            <span className="italic">Journey Together</span>
          </h2>
          <p className="text-slate-600 mb-8 md:mb-12 text-base md:text-lg">
            We'd love to hear about your vision for your big day. Whether it's an intimate elopement or a grand celebration, we're here to capture it all.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-champagne rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="text-gold w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-xs mb-1">Email Us</h4>
                <p className="text-slate-600">hello@arrowadswedding.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-champagne rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-gold w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-xs mb-1">Call Us</h4>
                <p className="text-slate-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-champagne rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-gold w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-widest text-xs mb-1">Studio</h4>
                <p className="text-slate-600">123 Creative Lane, Suite 400<br />Los Angeles, CA 90012</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Heart size={20} /></a>
          </div>
        </div>

        <div className="bg-[#FAFAFA] p-8 md:p-12 rounded-sm shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border-b border-slate-200 py-3 px-0 focus:border-gold outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border-b border-slate-200 py-3 px-0 focus:border-gold outline-none transition-colors"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Wedding Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border-b border-slate-200 py-3 px-0 focus:border-gold outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Venue / Location</label>
                <input 
                  type="text" 
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full bg-white border-b border-slate-200 py-3 px-0 focus:border-gold outline-none transition-colors"
                  placeholder="Where is the magic happening?"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Tell Us Your Story</label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white border-b border-slate-200 py-3 px-0 focus:border-gold outline-none transition-colors resize-none"
                placeholder="Share some details about your big day..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white uppercase tracking-widest text-xs font-bold py-5 hover:bg-gold transition-colors duration-300 rounded-sm mt-4"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <img 
            src="/logo.png" 
            alt="Arrow Ads Wedding" 
            className="h-12 w-auto mb-4 invert"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (nextSibling) nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }}>
            <p className="text-2xl font-serif tracking-widest text-slate-900">
              ARROW ADS <span className="text-gold italic">Wedding</span>
            </p>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">© 2026 Arrow Ads Wedding. All Rights Reserved.</p>
        </div>
        
        <div className="flex space-x-8">
          <a href="#home" className="text-xs uppercase tracking-widest font-medium text-slate-600 hover:text-gold transition-colors">Home</a>
          <a href="#gallery" className="text-xs uppercase tracking-widest font-medium text-slate-600 hover:text-gold transition-colors">Gallery</a>
          <a href="#contact" className="text-xs uppercase tracking-widest font-medium text-slate-600 hover:text-gold transition-colors">Contact</a>
        </div>

        <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">
          Handcrafted for Timeless Memories
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen selection:bg-gold/30 selection:text-gold">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Gallery />
            <Cinematography />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
