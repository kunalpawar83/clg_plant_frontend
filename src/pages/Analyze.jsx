// src/pages/Analyze.jsx
import React, { useEffect, useState } from "react";
import {
  Share2,
  Download,
  MoreHorizontal,
  Droplets,
  Sun,
  Thermometer,
  Calendar,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const safeJSONParse = (s) => {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const toList = (text) => {
  if (!text) return [];
  // split on newlines, remove leading '- ' and empty lines
  return text
    .split(/\r?\n/)
    .map((t) => t.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);
};

const formatTs = (ts) => {
  if (!ts) return "Unknown";
  const n = Number(ts);
  const date = n > 1e12 ? new Date(n) : new Date(n * 1000);
  return isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
};

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawFromLocation = location.state || null;

  // try sessionStorage fallback
  const [raw, setRaw] = useState(() => {
    if (rawFromLocation) return rawFromLocation;
    if (typeof window !== "undefined") {
      return safeJSONParse(sessionStorage.getItem("analyzeData"));
    }
    return null;
  });

  // save to sessionStorage when navigated with state so reloads still work
  useEffect(() => {
    if (rawFromLocation && typeof window !== "undefined") {
      try {
        sessionStorage.setItem("analyzeData", JSON.stringify(rawFromLocation));
      } catch (e) {
        /* ignore */
      }
      setRaw(rawFromLocation);
    }
  }, [rawFromLocation]);

  const [lang, setLang] = useState(() => {
    // if API tells language, default accordingly
    if (raw?.language && raw.language.toLowerCase().includes("hind")) return "hindi";
    return "english";
  });

  if (!raw) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-gray-800">No analysis data found</h1>
        <p className="text-gray-600 mb-4">Please scan a plant first.</p>
        <button
          onClick={() => navigate("/scanner")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  // Normalise / prepare data for UI
  const item = raw;
  const english = item.english || {
    description: item.description || "",
    prevention: item.prevention || "",
    treatments: item.treatments || "",
  };
  const hindi = item.otherLanguage || {
    description: item.description || "",
    prevention: item.prevention || "",
    treatments: item.treatments || "",
  };

  const imageUrl = item.imageUrl || item.image || null;
  const diseaseTitle = item.diseaseTitle || item.diseaseName || "Unknown Disease";
  const diseaseNameLocalized = lang === "hindi" ? (hindi.diseaseName || item.diseaseName || "") : (english.diseaseName || item.diseaseName || "");
  const plant = item.plant || "Unknown Plant";
  const rawDisease = item.rawDisease || item.raw_disease || "—";
  const detected = typeof item.status === "boolean" ? item.status : item.status ? true : false;
  const observedAt = formatTs(item._ts || item.ts || item.timestamp || item.time);

  // create lists
  const preventionList = toList(lang === "hindi" ? (hindi.prevention || item.prevention) : (english.prevention || item.prevention));
  const treatmentList = toList(lang === "hindi" ? (hindi.treatments || item.treatments) : (english.treatments || item.treatments));
  const description = lang === "hindi" ? (hindi.description || english.description || "") : (english.description || hindi.description || "");
  const regionTips = Array.isArray(item.regionTips) ? item.regionTips : Array.isArray(item.tips) ? item.tips : [];

  // care object is not in API — keep N/A defaults
  const care = item.care || {};

  // Simple Save-to-history (localStorage)
  const saveToHistory = () => {
    try {
      const history = safeJSONParse(localStorage.getItem("analyze_history")) || [];
      history.unshift({ item, seenAt: new Date().toISOString() });
      localStorage.setItem("analyze_history", JSON.stringify(history.slice(0, 200)));
      alert("Saved to history");
    } catch {
      alert("Failed to save");
    }
  };

  const getHealthBadge = () => {
    if (detected) return "bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-md";
    return "bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-md";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-white to-green-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">🌿 Analysis Results</h1>
              <p className="text-gray-600 mt-1">AI-powered plant health assessment</p>
            </div>

            <div className="flex gap-3 items-center">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                aria-label="Choose language"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
              </select>

              {[Share2, Download, MoreHorizontal].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition shadow-sm"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Disease / Identification card */}
              <div className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={imageUrl || "/images/placeholder.png"}
                      alt={diseaseTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{diseaseTitle}</h2>
                    {diseaseNameLocalized && (
                      <p className="text-sm text-gray-600">{diseaseNameLocalized}</p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-3 items-center">
                      <div className={getHealthBadge()}>{detected ? "Diseased" : "Healthy"}</div>
                      <div className="text-sm text-gray-500">
                        Plant: <span className="font-medium text-gray-800">{plant}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: <span className="font-mono">{rawDisease}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Observed: <span className="font-medium text-gray-700">{observedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-5 leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
                  {description || "No description available."}
                </div>

                {/* Prevention & Treatments */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Prevention</h4>
                    {preventionList.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {preventionList.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No prevention info provided.</p>
                    )}
                  </div>

                  <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Treatments</h4>
                    {treatmentList.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {treatmentList.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No treatment info provided.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Care Recommendations */}
              <div className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💧</div>
                  <span className="text-lg font-semibold text-gray-900">Care Recommendations</span>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[{ icon: Droplets, label: "Watering", value: care.watering },
                  { icon: Sun, label: "Sunlight", value: care.sunlight },
                  { icon: Thermometer, label: "Temperature", value: care.temperature },
                  { icon: Calendar, label: "Fertilizer", value: care.fertilizer }].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                          <Icon className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{c.label}</h4>
                          <p className="text-base font-semibold text-gray-800">{c.value || "N/A"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Immediate Actions */}
              <div className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">⚡</div>
                  <span className="text-lg font-semibold text-gray-900">Immediate Actions</span>
                </div>

                <div className="space-y-3">
                  {[...treatmentList.slice(0, 3), ...preventionList.slice(0, 3)].length > 0 ? (
                    [...treatmentList.slice(0, 3), ...preventionList.slice(0, 3)].map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="mt-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{idx + 1}</div>
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No specific actions recommended right now.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Region-based Tips */}
              <div className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🌏</div>
                  <span className="text-lg font-semibold text-gray-900">Regional Tips</span>
                </div>

                <div className="space-y-3">
                  {regionTips && regionTips.length ? (
                    regionTips.map((tip, i) => (
                      <div key={i} className="text-sm text-gray-700 p-3 bg-orange-50 rounded-xl border border-orange-200">• {tip}</div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No regional tips available</p>
                  )}
                </div>
              </div>

              {/* Save & Share */}
              <div className="p-6 rounded-2xl border bg-white shadow space-y-4">
                <button onClick={saveToHistory} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-medium shadow hover:scale-[1.02] transition">Save to History</button>
                <button className="w-full border border-green-300 text-green-700 hover:bg-green-50 py-2 rounded-lg font-medium transition">Share Report</button>
                <button onClick={() => navigate("/scanner")} className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition">Analyze Another Plant</button>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
                <div className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</div>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                    <p className="font-medium text-gray-900">Set Reminder</p>
                    <p className="text-sm text-gray-600">Schedule care notifications</p>
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                    <p className="font-medium text-gray-900">Find Local Suppliers</p>
                    <p className="text-sm text-gray-600">Locate nearby fertilizer shops</p>
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition">
                    <p className="font-medium text-gray-900">Expert Consultation</p>
                    <p className="text-sm text-gray-600">Connect with agricultural experts</p>
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

export default Analyze;
