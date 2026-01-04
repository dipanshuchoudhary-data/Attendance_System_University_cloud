import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";

interface ClassItem {
  class_id: string;
  subject_code: string;
  subject_name: string;
  group: string;
}

export default function TakeAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState("");
  const [threshold, setThreshold] = useState(5);

  const [status, setStatus] = useState("Idle");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  /* ---------------- LOAD CLASSES ---------------- */
  useEffect(() => {
    api.getClasses().then((data) => {
      setClasses(Array.isArray(data) ? data : []);
    });
  }, []);

  /* ---------------- START CAMERA ---------------- */
  const startCamera = async () => {
    if (runningRef.current) return;

    if (!classId) {
      alert("Please select a class");
      return;
    }

    setStatus("Initializing camera...");
    setElapsed(0);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
    });

    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;

    await new Promise((resolve) => {
      videoRef.current!.onloadedmetadata = () => resolve(true);
    });

    await api.startCamera(classId, threshold);

    runningRef.current = true;
    setRunning(true);
    setStatus("Camera started. Waiting for face...");

    intervalRef.current = window.setInterval(sendFrame, 1000);
  };

  /* ---------------- STOP CAMERA ---------------- */
  const stopCamera = async () => {
    runningRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());

    await api.stopCamera(classId);

    setRunning(false);
    setElapsed(0);
    setStatus("Attendance stopped");
  };

  /* ---------------- SEND FRAME ---------------- */
  const sendFrame = async () => {
    if (!runningRef.current) return;
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const frameBase64 = canvas.toDataURL("image/jpeg");

    try {
      const data = await api.sendFrame(classId, frameBase64);

      if (data.status === "tracking") {
        setElapsed(data.elapsed);
        setStatus(`Tracking face… ${data.elapsed}s`);
      }

      if (data.status === "marked") {
        setElapsed(data.elapsed);
        setStatus("Attendance marked ✅");
      }

      if (data.status === "no_face") {
        setElapsed(0);
        setStatus("No face detected");
      }

      if (data.status === "inactive") {
        setStatus("Session inactive");
      }
    } catch (err) {
      setStatus("Frame send failed");
    }
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: 900 }}>
      <h1>Take Attendance</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.class_id} value={c.class_id}>
              {c.class_id} — {c.subject_code}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={3}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />

        {!running ? (
          <button onClick={startCamera}>Start Attendance</button>
        ) : (
          <button onClick={stopCamera}>Stop Attendance</button>
        )}
      </div>

      <p>
        <b>Status:</b>{" "}
        <span style={{ color: running ? "green" : "gray" }}>{status}</span>
      </p>

      <p>
        <b>Elapsed:</b> {elapsed}s
      </p>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: 640, border: "2px solid #333" }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
