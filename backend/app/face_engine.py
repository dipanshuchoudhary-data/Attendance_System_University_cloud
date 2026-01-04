import cv2
import numpy as np
import mediapipe as mp
from typing import Optional, Union


# -------------------------------------------------------------------
# MEDIAPIPE INITIALIZATION
# -------------------------------------------------------------------

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh

_face_detector = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

_face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=False,
    min_detection_confidence=0.6
)


# -------------------------------------------------------------------
# FACE EMBEDDING
# -------------------------------------------------------------------

def extract_face_embedding(frame: np.ndarray) -> Optional[np.ndarray]:
    """
    Extracts a numeric face embedding using MediaPipe landmarks.
    Returns None if no face is detected.
    """

    if frame is None:
        return None

    try:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = _face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            return None

        landmarks = results.multi_face_landmarks[0].landmark

        embedding = []
        for lm in landmarks:
            embedding.extend((lm.x, lm.y, lm.z))

        return np.asarray(embedding, dtype=np.float32)

    except Exception:
        # Hard fail-safe: never crash upstream services
        return None


# -------------------------------------------------------------------
# COSINE SIMILARITY
# -------------------------------------------------------------------

def cosine_similarity(
    vec1: Union[np.ndarray, list],
    vec2: Union[np.ndarray, list]
) -> float:
    """
    Computes cosine similarity between two vectors.
    Safe for list or NumPy input.
    Returns value in range [-1.0, 1.0].
    """

    if vec1 is None or vec2 is None:
        return -1.0

    # 🔒 Normalize inputs (CRITICAL FIX)
    try:
        v1 = np.asarray(vec1, dtype=np.float32)
        v2 = np.asarray(vec2, dtype=np.float32)
    except Exception:
        return -1.0

    if v1.ndim != 1 or v2.ndim != 1:
        return -1.0

    if v1.shape != v2.shape:
        return -1.0

    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0.0 or norm2 == 0.0:
        return -1.0

    similarity = np.dot(v1, v2) / (norm1 * norm2)
    return float(similarity)


# -------------------------------------------------------------------
# FACE DETECTION (BOUNDING BOXES)
# -------------------------------------------------------------------

def detect_face_boxes(frame: np.ndarray):
    """
    Detects face bounding boxes for visualization.
    Returns a list of {x, y, w, h}.
    """

    if frame is None:
        return []

    try:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = _face_detector.process(rgb)

        boxes = []

        if results.detections:
            h, w, _ = frame.shape
            for det in results.detections:
                box = det.location_data.relative_bounding_box
                x = int(box.xmin * w)
                y = int(box.ymin * h)
                bw = int(box.width * w)
                bh = int(box.height * h)
                boxes.append({"x": x, "y": y, "w": bw, "h": bh})

        return boxes

    except Exception:
        return []
