"use client";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import type { Pose, Results } from "@mediapipe/pose";

interface PoseTrackerProps {
  onRep: () => void;
  onFeedback: (msg: string, isCorrect: boolean) => void;
  onAccuracy: (score: number) => void;
  exerciseType: "leg-raise" | "flexion" | "squat" | "arm-raise" | "neck-stretch" | "posture-hold" | "balance-hold";
}

export default function PoseTracker({ onRep, onFeedback, onAccuracy, exerciseType }: PoseTrackerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Movement State
  const prevPosition = useRef<"up" | "down">("down");
  const accuracyHistory = useRef<number[]>([]);

  useEffect(() => {
    let pose: Pose | null = null;
    let camera: any = null;

    const setupPose = async () => {
      const { Pose } = await import("@mediapipe/pose");
      const { Camera } = await import("@mediapipe/camera_utils");
      const { drawConnectors, drawLandmarks } = await import("@mediapipe/drawing_utils");
      const { POSE_CONNECTIONS } = await import("@mediapipe/pose");

      pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults((results: Results) => {
        if (!canvasRef.current || !results.poseLandmarks) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Skeleton
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#0ea5e9", lineWidth: 2 });
        drawLandmarks(ctx, results.poseLandmarks, { color: "#f8fafc", lineWidth: 1, radius: 2 });
        ctx.restore();

        // RUN ANALYTICS LOGIC
        analyzePose(results.poseLandmarks, exerciseType);
      });

      try {
        if (webcamRef.current && webcamRef.current.video) {
          camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (webcamRef.current && webcamRef.current.video) {
                await pose!.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480,
          });
          await camera.start();
          setIsLoaded(true);
        }
      } catch (err: any) {
        console.error("Camera Error: ", err);
        setCameraError(
          "Camera blocked by browser security. To test on Android, open Chrome, enter chrome://flags/#unsafely-treat-insecure-origin-as-secure, add http://192.168.1.3:3000, enable the flag, and restart Chrome."
        );
        setIsLoaded(true);
      }
    };

    setupPose();

    return () => {
      if (camera) camera.stop();
      if (pose) pose.close();
    };
  }, [exerciseType]);


  const calculateAngle = (p1: any, p2: any, p3: any) => {
    if (!p1 || !p2 || !p3) return 0;
    const rad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((rad * 180) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const analyzePose = (landmarks: any[], type: string) => {
    if (!landmarks || landmarks.length === 0) {
      onFeedback("No body detected", false);
      return;
    }

    // MediaPipe Landmarks: 11=Lshoul, 13=Lelbow, 23=Lhip, 25=Lknee, 27=Lankle, 7=LEar
    const leftEar = landmarks[7];
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const isVisible = (leftShoulder?.visibility || 0) > 0.5;
    if (!isVisible) {
      onFeedback("Adjust your body to fit the frame", false);
      onAccuracy(0);
      return;
    }

    let currentAngle = 0;
    let accuracy = 100;

    switch (type) {
      case "flexion": 
        currentAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        
        if (currentAngle < 40 && prevPosition.current === "down") {
           prevPosition.current = "up";
           onRep();
           onFeedback("Great range of motion", true);
        } else if (currentAngle > 100) {
           prevPosition.current = "down";
           onFeedback("Ready for next rep", true);
        }
        break;

      case "squat":
        currentAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        
        if (currentAngle < 100 && prevPosition.current === "down") {
           prevPosition.current = "up";
           onRep();
           onFeedback("Good depth!", true);
        } else if (currentAngle > 160) {
           prevPosition.current = "down";
           onFeedback("Keep your core tight", true);
        }
        break;

      case "leg-raise":
        currentAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

        if (currentAngle > 40 && prevPosition.current === "down") {
           prevPosition.current = "up";
           onRep();
           onFeedback("Keep knee straight!", true);
        } else if (currentAngle < 15) {
           prevPosition.current = "down";
        }
        break;
      
      case "posture-hold":
        currentAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
        accuracy = Math.max(0, 100 - Math.abs(180 - currentAngle) * 2);
        if (accuracy > 80) onFeedback("Excellent posture!", true);
        else onFeedback("Align your back", false);
        break;

      case "balance-hold":
        currentAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
        accuracy = Math.max(0, 100 - Math.abs(180 - currentAngle) * 3);
        if (accuracy > 70) onFeedback("Stay steady...", true);
        else if (accuracy < 50) onFeedback("Find your balance", false);
        break;
      
      case "arm-raise":
      case "neck-stretch":
      default:
        // Track Shoulder Rolls / Arm Raises
        if (leftEar && leftShoulder) {
          const verticalDist = leftShoulder.y - leftEar.y; // distance between ear and shoulder
          
          if (verticalDist < 0.12 && prevPosition.current === "down") {
             prevPosition.current = "up";
             onRep();
             onFeedback("Good contraction!", true);
          } else if (verticalDist > 0.16) {
             prevPosition.current = "down";
          }
        }
        break;
    }

    onAccuracy(Math.round(accuracy));
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
      {!isLoaded && !cameraError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-900">
           <span className="material-symbols-outlined text-4xl text-sky-400 animate-spin">progress_activity</span>
           <p className="text-slate-400 text-sm font-bold uppercase">Preparing AI Tracker...</p>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center">
           <span className="material-symbols-outlined text-4xl text-rose-400">videocam_off</span>
           <p className="text-rose-400 text-sm font-bold uppercase leading-relaxed max-w-sm">{cameraError}</p>
        </div>
      )}
      
      <Webcam
        ref={webcamRef}
        mirrored={true}
        className="w-full h-full object-cover opacity-60"
        videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1]"
        width={640}
        height={480}
      />

      {/* OVERLAY: AI STATUS */}
      <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-[#0F172A]/80 backdrop-blur-md border border-sky-400/30 flex items-center gap-4">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Active</span>
         </div>
      </div>
    </div>
  );
}
