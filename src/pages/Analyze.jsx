import { Share2, Download, MoreHorizontal, Droplets, Sun, Thermometer, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state; 

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-gray-800">No analysis data found</h1>
        <p className="text-gray-600 mb-4">Please scan a plant first.</p>
        <button
          onClick={() => navigate("/camera")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Camera
        </button>
      </div>
    );
  }

  const getHealthStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-md";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-md";
      case "diseased":
        return "bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-md";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-md";
    }
  };

  const careData = [
    {
      icon: Droplets,
      label: "Watering",
      value: "2-3 times/week",
      description: "Check soil moisture before watering",
    },
    {
      icon: Sun,
      label: "Sunlight",
      value: "6-8 hours/day",
      description: "Direct morning sunlight preferred",
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: "20-25°C",
      description: "Optimal growth temperature range",
    },
    {
      icon: Calendar,
      label: "Fertilizer",
      value: "Weekly",
      description: "Balanced NPK fertilizer recommended",
    },
  ];

  const regionTips = [
    "Best to plant tomatoes after monsoon season.",
    "Watch for early blight in humid conditions.",
    "Use organic mulch to retain soil moisture.",
  ];

  return (
    <>
  <Header />
  <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-white to-green-50 py-10">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            🌿Analysis Results
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered plant health assessment
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Plant Identification */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                ߌߍ
              </div>
              <span className="text-lg font-medium text-gray-800">
                Plant Details
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {data.plantName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Scientific identification
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {data.confidence} confidence
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Health Status</p>
                  <div className={getHealthStatusColor(data.healthStatus)}>
                    {data.healthStatus}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Growth Stage</p>
                  <div className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-sm font-medium inline-block">
                    {data.growthStage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Care Recommendations */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                ߒǍ
              </div>
              <span className="text-lg font-medium text-gray-800">
                Care Recommendations
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {careData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="p-2 rounded-lg bg-white shadow">
                      <Icon className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.label}
                      </h4>
                      <p className="text-base font-semibold text-gray-800">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">
                ⚡
              </div>
              <span className="text-lg font-medium text-gray-800">
                Immediate Actions
              </span>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Region-based Tips */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                🌏
              </div>
              <span className="text-lg font-medium text-gray-800">
                Regional Tips
              </span>
            </div>
            <div className="space-y-3">
              {regionTips.map((tip, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 p-3 bg-orange-50 rounded-xl border border-orange-200"
                >
                  • {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Save & Share */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm space-y-4">
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg shadow-sm transition"
              onClick={() => navigate("/history")}
            >
              Save to History
            </button>
            <button className="w-full border border-green-300 text-green-700 hover:bg-green-50 py-2 rounded-lg transition">
              Share Report
            </button>
            <button
              className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg transition"
              onClick={() => navigate("/scanner")}
            >
              Analyze Another Plant
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div className="text-lg font-medium mb-4 text-gray-800">
              Quick Actions
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                <p className="font-medium text-gray-900">Set Reminder</p>
                <p className="text-sm text-gray-600">
                  Schedule care notifications
                </p>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                <p className="font-medium text-gray-900">Find Local Suppliers</p>
                <p className="text-sm text-gray-600">
                  Locate nearby fertilizer shops
                </p>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                <p className="font-medium text-gray-900">Expert Consultation</p>
                <p className="text-sm text-gray-600">
                  Connect with agricultural experts
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
};

export default Analyze