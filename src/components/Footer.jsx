import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-emerald-700 via-green-800 to-emerald-900 text-white pt-16 pb-8">
      {/* Glow effects */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-lime-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="text-lime-400 w-10 h-10" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-200 bg-clip-text text-transparent">
                AgriScan
              </h2>
            </div>
            <p className="text-gray-200 leading-relaxed">
              AI-powered farming solutions for modern India. 
              Grow smarter, healthier, and more sustainable crops.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-lime-400 transition">Home</Link></li>
              <li><Link to="/scanner" className="hover:text-lime-400 transition">AI Scanner</Link></li>
              <li><Link to="/history" className="hover:text-lime-400 transition">History</Link></li>
              <li><Link to="/learning" className="hover:text-lime-400 transition">Learning</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><Mail size={18}/> support@agriplatform.com</li>
              <li className="flex items-center gap-2"><Phone size={18}/> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin size={18}/> Pune, India</li>
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-lime-500 transition"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-lime-500 transition"><Twitter size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-lime-500 transition"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-lime-500 transition"><Linkedin size={20} /></a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/20 text-center text-gray-300">
          © {new Date().getFullYear()} AgriScan. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
