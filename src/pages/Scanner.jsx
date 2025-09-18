import { useState, useRef, useEffect } from "react";
import { Camera, Upload, RotateCcw, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Scanner = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Start camera (for desktop)
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Take picture from video stream
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

      // Stop video stream after capture
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  // Upload image (gallery / mobile camera)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCapturedImage(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Analyze simulation
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
    }, 200);
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
        <div className="max-w-2xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-800 mb-3">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Plant Analysis
              </span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Capture or upload an image of your plant for{" "}
              <span className="text-green-700 font-medium">
                AI-powered health analysis
              </span>
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 transition-all duration-300 hover:shadow-xl">
            {!capturedImage ? (
              <div className="space-y-6">
                {/* Camera Preview */}
                <div className="aspect-video bg-black rounded-xl flex items-center justify-center border-2 border-dashed border-green-200 shadow-inner relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openCamera}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Open Camera
                  </button>

                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-green-700 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Capture Photo
                  </button>

                  <label className="flex-1 flex items-center justify-center border border-green-300 text-green-700 hover:bg-green-50 py-2.5 rounded-xl transition-all duration-300 cursor-pointer">
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
                {/* Preview */}
                <div className="relative rounded-xl overflow-hidden shadow-md">
                  <img
                    src={capturedImage}
                    alt="Captured plant"
                    className="w-full aspect-video object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
                        <p className="text-base font-medium">
                          Analyzing your plant...
                        </p>
                        <p className="text-sm mt-1 opacity-80">{progress}% complete</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Retake + Analyze */}
                {!isAnalyzing && (
                  <div className="flex gap-4">
                    <button
                      onClick={retakePhoto}
                      className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Retake
                    </button>

                    <button
                      onClick={handleAnalyze}
                      className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Analyze Plant
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Tips Section */} <div className="mt-10 bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm"> <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2"> ߒTips for Best Results </h3> <ul className="text-green-700 space-y-1.5 text-sm leading-relaxed"> <li>• Ensure good natural lighting</li> <li>• Focus on leaves showing symptoms</li> <li>• Keep the camera steady</li> <li>• Include multiple leaves in the frame</li> <li>• Avoid blurry or overexposed images</li> </ul> </div>
        </div>
      </div>
    </>
  );
};

export default Scanner;
