import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  RotateCcw,
  Check,
  Loader2,
  ScanLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Background from "../../public/images/bg-image.jpg";
import Footer from "../components/Footer";
import singleLiff from '../../public/images/singleLiff.jpg'

const Scanner = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Languages array
  const indianLanguages = [
    "Assamese",
    "Bengali",
    "Bodo",
    "Dogri",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Kashmiri",
    "Konkani",
    "Maithili",
    "Malayalam",
    "Manipuri",
    "Marathi",
    "Nepali",
    "Odia",
    "Punjabi",
    "Sanskrit",
    "Santali",
    "Sindhi",
    "Tamil",
    "Telugu",
    "Urdu",
  ];

  // Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Camera error:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Capture photo from video
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Upload image
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCapturedImage(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Track clicks on the image
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // percent
    const y = ((e.clientY - rect.top) / rect.height) * 100; // percent
    setSelectedAreas([...selectedAreas, { x, y }]);
  };

  // Send image + selected areas + language to backend
  const sendImageToBackend = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setProgress(0);

    try {
      const formData = new FormData();

      // Convert base64 to File if needed
      let file;
      if (typeof capturedImage === "string" && capturedImage.startsWith("data:image")) {
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        file = new File([blob], "plant.png", { type: blob.type });
      } else {
        file = capturedImage;
      }

      formData.append("image", file);
      formData.append("areas", JSON.stringify(selectedAreas));
      formData.append("language", selectedLanguage); // ✅ add language

      // Save locally too
      localStorage.setItem("preferredLanguage", selectedLanguage);

      // Optional progress bar simulation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const id = localStorage.getItem("userId");
      formData.append("userId", id || "");

      const response = await fetch(
        "https://clg-plant-backend.vercel.app/gemini/id",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server Error: ${text}`);
      }

      const result = await response.json();
      setProgress(100);
      navigate("/analyze", { state: result });
    } catch (error) {
      console.error("Error sending image:", error);
      alert(`Failed to send image: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setProgress(0);
    setSelectedAreas([]);
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen mt-20 py-12 bg-gradient-to-b from-green-50 via-white to-green-50">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 -z-10"
          style={{ backgroundImage: `url(${Background})` }}
        ></div>

        <div className="max-w-2xl mx-auto px-4 space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 mb-3">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Plant Analysis
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Capture or upload your plant image for{" "}
              <span className="text-green-700 font-semibold">
                AI-powered insights
              </span>
            </p>
          </div>

          {/* ✅ Language Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-lg border border-green-300 bg-white px-4 py-2 text-green-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              <option value="">-- Choose a language --</option>
              {indianLanguages.map((lang, idx) => (
                <option key={idx} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {selectedLanguage && (
              <p className="mt-2 text-green-700 text-sm">
                ✅ Selected: <span className="font-semibold">{selectedLanguage}</span>
              </p>
            )}
          </div>

          {/* Good vs Bad Example Top */}
          <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-3xl p-6 shadow-lg border border-green-200">
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 text-center">
              📷 How to Take Plant Photos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-300">
                <img
                  src={singleLiff}
                  alt="Good Example"
                  className="w-full h-48 sm:h-40 object-cover"
                />
                <div className="p-3 text-center">
                  <p className="text-green-600 font-semibold text-sm sm:text-base">
                    ✅ Good Image
                  </p>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Bright, focused, shows single leaves.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-300">
                <img
                  src={singleLiff}
                  alt="Bad Example"
                  className="w-full h-48 sm:h-40 object-cover blur-[2px]"
                />
                <div className="p-3 text-center">
                  <p className="text-red-600 font-semibold text-sm sm:text-base">
                    ❌ Bad Image
                  </p>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    Blurry, dark, or poorly framed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scanner Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 p-6">
            {!capturedImage ? (
              <div className="space-y-6">
                <div className="aspect-video bg-black rounded-xl relative overflow-hidden border-2 border-green-200 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-4 border-white/30 rounded-xl pointer-events-none">
                    <ScanLine className="absolute top-1/2 left-0 w-full text-green-400 animate-pulse" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openCamera}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center text-base font-medium"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Open Camera
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-green-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center text-base font-medium"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Capture
                  </button>
                  <label className="flex-1 flex items-center justify-center border border-green-300 text-green-700 hover:bg-green-50 py-3 rounded-xl transition-all duration-300 cursor-pointer font-medium">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative space-y-6">
                <div className="relative rounded-xl overflow-hidden shadow-md border border-green-100">
                  <img
                    src={capturedImage}
                    alt="Captured plant"
                    className="w-full aspect-video object-cover cursor-crosshair"
                    onClick={handleImageClick}
                  />
                  {selectedAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white"
                      style={{
                        left: `${area.x}%`,
                        top: `${area.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white px-4">
                      <Loader2 className="w-12 h-12 animate-spin mb-3" />
                      <p className="text-base font-medium mb-2">
                        Analyzing your plant...
                      </p>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-400 h-2 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2 opacity-90">{progress}%</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl transition-all text-base font-medium"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retake
                  </button>
                  <button
                    onClick={sendImageToBackend}
                    disabled={!selectedLanguage} // ✅ prevent without language
                    className={`flex-1 flex items-center justify-center py-3 rounded-xl text-base font-medium shadow-md hover:shadow-lg transition-all ${
                      selectedLanguage
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Analyze
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-10 bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
            <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
              🌱 Tips for Best Results
            </h3>
            <ul className="text-green-700 space-y-2 text-sm leading-relaxed">
              <li>• Ensure good natural lighting</li>
              <li>• Focus on leaves showing symptoms</li>
              <li>• Keep the camera steady</li>
              <li>• Include multiple leaves in the frame</li>
              <li>• Avoid blurry or overexposed images</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Scanner;
