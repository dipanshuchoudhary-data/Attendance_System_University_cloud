import cv2
from app.face_recognition import detect_faces
from app.attendance import update_presence


def start_camera(camera_index=0):
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        raise RuntimeError("Camera not accessible")

    print("Camera started. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        faces = detect_faces(frame)

        for (x, y, w, h) in faces:
            student_id = "demo_student"  # MVP fixed ID
            marked = update_presence(student_id)

            color = (0, 255, 0) if marked else (0, 0, 255)
            label = "Attendance Marked" if marked else "Tracking..."

            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(
                frame,
                label,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                color,
                2
            )

        cv2.imshow("Smart Attendance MVP", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
