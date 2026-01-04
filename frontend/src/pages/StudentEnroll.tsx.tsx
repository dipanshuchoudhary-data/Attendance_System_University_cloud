import { useRef, useState, useEffect } from "react";

export default function StudentEnroll() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    student_id: "",
    name: "",
    course: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  /* ---------------- CAMERA CONTROL ---------------- */

  const startCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");

      if (videoDevices.length === 0) {
        alert("No camera found on this device.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: videoDevices[0].deviceId },
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch {
      alert("Unable to access camera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach(track => track.stop());
    setCameraStarted(false);
  };

  /* ---------------- COUNTDOWN + CAPTURE ---------------- */

  const startCountdownAndCapture = () => {
    if (!cameraStarted) return;

    setCountdown(3);
    let value = 3;

    const timer = setInterval(() => {
      value -= 1;
      setCountdown(value);

      if (value === 0) {
        clearInterval(timer);
        setCountdown(null);
        captureImage();
      }
    }, 1000);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const image = canvas.toDataURL("image/jpeg");
    setCapturedImage(image);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  /* ---------------- SUBMIT ---------------- */

  const submitEnrollment = async () => {
    setMessage("");

    if (!form.student_id || !form.name || !form.course) {
      alert("All fields are required.");
      return;
    }

    if (!/^A100\d{8,9}$/.test(form.student_id)) {
      alert("Enrollment ID must start with A100 followed by 8–9 digits.");
      return;
    }

    if (!capturedImage) {
      alert("Please capture your photo first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: form.student_id,
          name: form.name,
          course: form.course,
          image_base64: capturedImage
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          alert("This face is already enrolled.");
        } else {
          alert(data.detail || "Enrollment failed.");
        }
        return;
      }

      setMessage("Enrollment successful 🎉");
      setForm({ student_id: "", name: "", course: "" });
      setCapturedImage(null);
    } catch {
      alert("Server or network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Student Enrollment</h1>

      <input
        placeholder="Enrollment Number"
        value={form.student_id}
        onChange={e => setForm({ ...form, student_id: e.target.value })}
      />

      <input
        placeholder="Full Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.course}
        onChange={e => setForm({ ...form, course: e.target.value })}
      >
        <option value="">Select Course</option>
        <option value="BCA">BCA</option>
        <option value="BCA(Eve)">BCA (Evening)</option>
        <option value="BTech">BTech</option>
        <option value="MBA">MBA</option>
      </select>

      {!capturedImage && (
        <>
          {!cameraStarted ? (
            <button onClick={startCamera}>Start Camera</button>
          ) : (
            <button onClick={stopCamera}>Stop Camera</button>
          )}

          <div style={{ position: "relative", marginTop: 10 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%" }}
            />

            {countdown !== null && (
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "45%",
                  fontSize: "48px",
                  color: "red",
                  fontWeight: "bold"
                }}
              >
                {countdown}
              </div>
            )}
          </div>

          {cameraStarted && (
            <button onClick={startCountdownAndCapture} style={{ marginTop: 10 }}>
              Capture Photo
            </button>
          )}
        </>
      )}

      {capturedImage && (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", marginTop: 10 }}
          />
          <button onClick={retakePhoto} style={{ marginTop: 10 }}>
            Retake Photo
          </button>
        </>
      )}

      <button
        onClick={submitEnrollment}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {loading ? "Submitting..." : "Submit Enrollment"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
