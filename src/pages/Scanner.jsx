import { useState, useRef, useEffect } from "react";
import { Camera, Upload, RotateCcw, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Scanner = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Start Camera with rear camera (environment)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Rear camera
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please allow permissions.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  // Capture Full-Quality Image
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Get the actual resolution from video stream
    const settings = video.srcObject.getVideoTracks()[0].getSettings();
    const width = settings.width || video.videoWidth;
    const height = settings.height || video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    // Save as high-quality JPEG
    const imageData = canvas.toDataURL("image/jpeg", 1.0);
    setCapturedImage(imageData);

    stopCamera();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate after analysis
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

  const retakePhoto = () => {
    setCapturedImage(null);
    setProgress(0);
    setAnalysisComplete(false);
    startCamera();
  };

  // Cleanup when unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gradient-to-b from-green-50 via-white to-green-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Title Section */}
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
                <div className="aspect-video bg-black rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-green-200 shadow-inner">
                  {!streaming ? (
                    <div className="text-center">
                      <Camera className="w-14 h-14 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Camera preview will appear here
                      </p>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!streaming ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Open Camera
                    </button>
                  ) : (
                    <button
                      onClick={handleCapture}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center border border-green-300 text-green-700 hover:bg-green-50 py-2.5 text-base rounded-xl transition-all duration-300"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Image
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
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
                        <p className="text-sm mt-1 opacity-80">
                          {progress}% complete
                        </p>
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

          {/* Hidden Canvas for Capturing */}
          <canvas ref={canvasRef} className="hidden"></canvas>

          {/* Tips Section */}
          <div className="mt-10 bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
            <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
              Tips for Best Results
            </h3>
            <ul className="text-green-700 space-y-1.5 text-sm leading-relaxed">
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
