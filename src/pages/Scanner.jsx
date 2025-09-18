import { useState, useRef, useEffect } from "react";
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
import LeaveImage from '../../public/images/leave-with-fungus.jpg'
const Scanner = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Start camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Capture photo
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
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
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

  // Fake analysis
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisComplete(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  // Navigate on complete
  useEffect(() => {
    if (analysisComplete) {
      navigate("/analyze", {
        state: {
          plantName: "Tomato Plant",
          healthStatus: "Healthy",
          confidence: "94%",
          growthStage: "Flowering",
          recommendations: [
            "Continue regular watering schedule",
            "Apply balanced fertilizer weekly",
            "Monitor for early blight symptoms",
          ],
        },
      });
      setAnalysisComplete(false);
    }
  }, [analysisComplete, navigate]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setProgress(0);
    setAnalysisComplete(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-white to-green-50 py-12">
        <div className="max-w-2xl mx-auto px-4 space-y-8">

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

          {/* Good vs Bad Example Top */}
<div className="bg-gradient-to-r from-green-100 to-green-50 rounded-3xl p-6 shadow-lg border border-green-200">
  <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 text-center">
    📷 How to Take Plant Photos
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Good Example */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-300">
      <img
        src={LeaveImage}
        alt="Good Example"
        className="w-full h-48 sm:h-40 object-cover"
      />
      <div className="p-3 text-center">
        <p className="text-green-600 font-semibold text-sm sm:text-base">✅ Good Image</p>
        <p className="text-xs sm:text-sm text-green-700 mt-1">
          Bright, focused, shows multiple leaves.
        </p>
      </div>
    </div>

    {/* Bad Example */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-300">
      <img
        src={LeaveImage}
        alt="Bad Example"
        className="w-full h-48 sm:h-40 object-cover"
      />
      <div className="p-3 text-center">
        <p className="text-red-600 font-semibold text-sm sm:text-base">❌ Bad Image</p>
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
                {/* Camera Preview */}
                <div className="aspect-video bg-black rounded-xl relative overflow-hidden border-2 border-green-200 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Focus frame overlay */}
                  <div className="absolute inset-0 border-4 border-white/30 rounded-xl pointer-events-none">
                    <ScanLine className="absolute top-1/2 left-0 w-full text-green-400 animate-pulse" />
                  </div>
                </div>

                {/* Action Buttons */}
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
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative rounded-xl overflow-hidden shadow-md border border-green-100">
                  <img
                    src={capturedImage}
                    alt="Captured plant"
                    className="w-full aspect-video object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white px-4">
                      <Loader2 className="w-12 h-12 animate-spin mb-3" />
                      <p className="text-base font-medium mb-2">
                        Analyzing your plant...
                      </p>

                      {/* Progress bar */}
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

                {/* Retake & Analyze Buttons */}
                {!isAnalyzing && (
                  <div className="flex gap-4">
                    <button
                      onClick={retakePhoto}
                      className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl transition-all text-base font-medium"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Retake
                    </button>

                    <button
                      onClick={handleAnalyze}
                      className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-base font-medium"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Analyze
                    </button>
                  </div>
                )}
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
    </>
  );
};

export default Scanner;
