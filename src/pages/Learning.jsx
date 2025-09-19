import { useState } from "react";
import {
  BookOpen,
  Play,
  Users,
  Award,
  Search,
  Clock,
  Eye,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Learning = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  // 🌱 Dummy Articles
  const articles = [
    {
      id: 1,
      title: "Organic Farming Techniques for Better Yield",
      excerpt:
        "Learn sustainable farming methods that improve soil health and crop productivity while reducing chemical dependency.",
      image:
        "https://images.unsplash.com/photo-1656250444213-6baf45417252?auto=format&fit=crop&w=800&q=80",
      category: "Sustainable Farming",
      readTime: "8 min read",
      views: 1247,
      likes: 89,
    },
    {
      id: 2,
      title: "Water Conservation in Indian Agriculture",
      excerpt:
        "Discover drip irrigation, rainwater harvesting, and other water-saving techniques perfect for Indian farming conditions.",
      image:
        "https://images.unsplash.com/photo-1589292144899-2f43a71a1b2b?auto=format&fit=crop&w=800&q=80",
      category: "Water Management",
      readTime: "6 min read",
      views: 892,
      likes: 67,
    },
    {
      id: 3,
      title: "Soil Health Management with Natural Methods",
      excerpt:
        "Techniques like crop rotation, mulching, and cover crops can restore soil fertility.",
      image:
        "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=800&q=80",
      category: "Soil Health",
      readTime: "7 min read",
      views: 650,
      likes: 45,
    },
    {
      id: 4,
      title: "Agri-Tech Innovations in India",
      excerpt:
        "Explore drones, AI-based disease detection, and IoT sensors for smart farming.",
      image:
        "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      readTime: "10 min read",
      views: 1876,
      likes: 123,
    },
  ];

  // 🎥 Real YouTube Videos
  const videos = [
    {
      id: 1,
      title: "Smart Irrigation Setup for Small Farms",
      thumbnail: "https://img.youtube.com/vi/8Vdd2R0V4f8/hqdefault.jpg",
      duration: "12:45",
      views: 15420,
      category: "Technology",
      url: "https://www.youtube.com/watch?v=8Vdd2R0V4f8",
    },
    {
      id: 2,
      title: "Composting Techniques for Better Soil",
      thumbnail: "https://img.youtube.com/vi/hDQffS_YOKA/hqdefault.jpg",
      duration: "8:30",
      views: 9876,
      category: "Soil Health",
      url: "https://www.youtube.com/watch?v=hDQffS_YOKA",
    },
    {
      id: 3,
      title: "Organic Farming in India Explained",
      thumbnail: "https://img.youtube.com/vi/n6ZpYdVxAAE/hqdefault.jpg",
      duration: "15:12",
      views: 17890,
      category: "Organic",
      url: "https://www.youtube.com/watch?v=n6ZpYdVxAAE",
    },
    {
      id: 4,
      title: "Modern Greenhouse Farming Technology",
      thumbnail: "https://img.youtube.com/vi/hw5PMflH0J4/hqdefault.jpg",
      duration: "9:42",
      views: 13200,
      category: "Technology",
      url: "https://www.youtube.com/watch?v=hw5PMflH0J4",
    },
  ];

  // 🏛️ Govt Schemes
  const schemes = [
    {
      id: 1,
      title: "PM-KISAN Scheme",
      description:
        "Income support to farmers with direct benefit transfer of ₹6000 per year",
      eligibility: "Small and marginal farmers",
      amount: "₹6,000/year",
      status: "Active",
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description:
        "Crop insurance scheme to protect farmers against crop loss",
      eligibility: "All farmers",
      amount: "Up to ₹2L coverage",
      status: "Active",
    },
    {
      id: 3,
      title: "Soil Health Card Scheme",
      description: "Helps farmers check soil nutrients for better yield",
      eligibility: "All farmers",
      amount: "Soil testing benefits",
      status: "Active",
    },
  ];

  // 🔎 Filter function for search
  const filterData = (data, keys) => {
    return data.filter((item) =>
      keys.some((key) =>
        item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredArticles = filterData(articles, ["title", "excerpt", "category"]);
  const filteredVideos = filterData(videos, ["title", "category"]);
  const filteredSchemes = filterData(schemes, ["title", "description", "eligibility"]);

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-yellow-50 to-green-100 py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
          {/* 🔎 Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search articles, videos, or government schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 text-sm sm:text-base md:text-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* 🔄 Tabs */}
          <div className="grid grid-cols-3 mb-8 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-1 sm:p-2">
            {[
              { key: "articles", label: "Articles", icon: BookOpen },
              { key: "videos", label: "Videos", icon: Play },
              { key: "schemes", label: "Gov. Schemes", icon: Award },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition ${
                  activeTab === tab.key
                    ? "bg-green-600 text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <tab.icon size={16} className="sm:w-5 sm:h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 🔗 Content */}
          {activeTab === "articles" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock size={14} /> <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} /> <span>{article.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                          <Heart size={14} /> <span>{article.likes}</span>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-2xl shadow hover:shadow-lg transition text-sm sm:text-base">
                        Read Article
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No articles found.</p>
              )}
            </div>
          )}

          {activeTab === "videos" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
                  >
                    <div className="relative group">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center"
                        >
                          <Play size={22} className="text-green-600" />
                        </a>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs sm:text-sm px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg text-gray-800 mb-3 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
                        <Eye size={14} className="mr-1" />{" "}
                        {video.views.toLocaleString()} views
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl text-center text-sm sm:text-base"
                      >
                        <Play size={16} className="inline-block mr-1" /> Watch Video
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No videos found.</p>
              )}
            </div>
          )}

          {activeTab === "schemes" && (
            <div className="space-y-6">
              {filteredSchemes.length > 0 ? (
                filteredSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                          {scheme.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-2">{scheme.description}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Eligibility:{" "}
                          <span className="font-medium">{scheme.eligibility}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Benefit: <span className="font-medium">{scheme.amount}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <button className="px-3 sm:px-4 py-2 border rounded-xl hover:bg-gray-100 text-xs sm:text-sm">
                          Learn More
                        </button>
                        <button className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-xs sm:text-sm">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No schemes found.</p>
              )}

              {/* 🌍 Community Section */}
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-xl rounded-2xl p-6 sm:p-8 mt-8">
                <div className="text-center">
                  <Users size={40} className="sm:size-48 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl mb-4">Join Our Farming Community</h3>
                  <p className="mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                    Connect with thousands of farmers across India. Share
                    experiences, ask questions, and learn from each other's
                    success stories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-green-700 rounded-xl hover:bg-gray-100 text-sm sm:text-base">
                      Join Community Forum
                    </button>
                    <button className="px-4 sm:px-6 py-2 sm:py-3 border border-white text-white rounded-xl hover:bg-white hover:text-green-700 text-sm sm:text-base">
                      Ask a Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Learning;
