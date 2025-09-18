import { Camera, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Background from '../../public/images/bg-image.jpg'

const Hero = () => {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0.9"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1684229864513-8399b70a838d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/30"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Tagline with sparkle animation */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="text-yellow-500 animate-pulse" size={28} />
            <span className="text-emerald-600 font-semibold text-xl tracking-wide">
              AI-Powered Agriculture Platform
            </span>
            <Sparkles className="text-yellow-500 animate-pulse" size={28} />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 
              bg-gradient-to-r from-emerald-700 via-green-600 to-lime-600 
              bg-clip-text text-transparent leading-tight drop-shadow-lg"
          >
            Smart Farming for
            <br />
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-orange-500 drop-shadow-xl"
            >
              Modern India
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed"
          >
            Transform your agriculture with{" "}
            <span className="text-emerald-600 font-semibold">
              AI-powered plant health analysis
            </span>
            , expert farming advice, and real-time crop monitoring.
            <br />
            <span className="font-bold text-emerald-700">
              Join 50,000+ farmers
            </span>{" "}
            already growing smarter.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to={"/scanner"}>
              <button className="bg-gradient-to-r from-emerald-500 via-green-600 to-lime-600 
                hover:from-emerald-600 hover:via-green-700 hover:to-lime-700 
                text-white px-12 py-3 rounded-2xl shadow-2xl transform hover:scale-105 
                transition-all duration-300 flex items-center gap-4 text-lg font-semibold">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                  <Camera size={20} />
                </div>
                Start AI Scan
              </button>
            </Link>
            
            <Link to={'/scanner'}>
            <button className="bg-white/90 hover:bg-white text-emerald-700 border-2 border-emerald-200 
              hover:border-emerald-300 px-12 py-3 rounded-2xl shadow-xl transform hover:scale-105 
              transition-all duration-300 flex items-center gap-4 text-lg font-semibold backdrop-blur-sm">
              <Upload size={20} />
              Upload Image
            </button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500,000+</div>
              <div className="text-gray-600 font-medium">Happy Farmers</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">125,000+</div>
              <div className="text-gray-600 font-medium">Plants Analyzed</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-orange-600 mb-2">96%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-green-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-ping"></div>
    </section>
  );
};

export default Hero;
