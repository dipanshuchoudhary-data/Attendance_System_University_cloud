import cv2
from face_engine import extract_face_embedding
from app.firebase_service import save_student


def enroll_student(student_id, name):
    cap = cv2.VideoCapture(0)
    print("Look at camera. Press 's' to save face.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow("Student Enrollment", frame)

        if cv2.waitKey(1) & 0xFF == ord('s'):
            embeddings = extract_face_embedding(frame)
            if embeddings:
                save_student(student_id, name, embeddings[0])
                print("Enrollment successful")
                break

    cap.release()
    cv2.destroyAllWindows()
