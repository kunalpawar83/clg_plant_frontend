import { Search, Calendar, MoreVertical, TrendingUp, Leaf, Trash2 } from "lucide-react";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const safeJSONParse = (s) => {
  try {
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = safeJSONParse(localStorage.getItem("analyze_history"));

    const formatted = (stored || [])
      .filter((entry) => entry && entry.item) // skip invalid entries
      .map((entry, idx) => {
        const item = entry.item || {};
        return {
          id: idx + 1,
          raw: entry, // keep full entry for navigation
          plantName: item.plant || "Unknown Plant",
          healthStatus:
            item.status === true
              ? "Diseased"
              : item.status === false
              ? "Healthy"
              : "Unknown",
          date: entry.seenAt
            ? new Date(entry.seenAt).toLocaleDateString()
            : "N/A",
          image: item.imageUrl || item.image || "/images/placeholder.png",
          growthStage: item.stage || "N/A",
          confidence: item.confidence ? `${item.confidence}%` : "—",
        };
      });

    setHistoryData(formatted);
  }, []);

  // ✅ Delete entry
  const handleDelete = (id) => {
    const updated = historyData.filter((item) => item.id !== id);
    setHistoryData(updated);
    localStorage.setItem("analyze_history", JSON.stringify(updated.map(i => i.raw)));
  };

  // ✅ Navigate to detail page
  const handleCardClick = (item) => {
    navigate("/analyze-report", { state: item.raw });
  };

  const getHealthStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-700 border border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "diseased":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.plantName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      item.healthStatus.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const healthCounts = {
    healthy: historyData.filter(
      (item) => item.healthStatus.toLowerCase() === "healthy"
    ).length,
    warning: historyData.filter(
      (item) => item.healthStatus.toLowerCase() === "warning"
    ).length,
    diseased: historyData.filter(
      (item) => item.healthStatus.toLowerCase() === "diseased"
    ).length,
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              🌱 Analysis History
            </h1>
            <p className="text-gray-600 mt-2 text-base md:text-lg">
              Track your plant health assessments over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Scans</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {historyData.length}
                  </p>
                </div>
                <Leaf className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Healthy Plants</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {healthCounts.healthy}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Needs Attention</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {healthCounts.warning}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md p-6 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Diseased</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {healthCounts.diseased}
                  </p>
                </div>
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  placeholder="Search by plant name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "healthy", "warning", "diseased"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                      selectedFilter === filter
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-5">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)} // ✅ navigate to report
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                  {/* Plant Image */}
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={item.image}
                      alt={item.plantName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Plant Info */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.plantName}
                        </h3>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>

                      {/* Delete button */}
                      <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent opening report
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(
                          item.healthStatus
                        )}`}
                      >
                        {item.healthStatus}
                      </span>
                      <span className="text-gray-600">
                        Stage:{" "}
                        <span className="font-medium">{item.growthStage}</span>
                      </span>
                      <span className="text-gray-600">
                        Confidence:{" "}
                        <span className="font-medium">{item.confidence}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center mt-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => navigate("/scanner")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition"
              >
                Scan Your First Plant
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default History;
