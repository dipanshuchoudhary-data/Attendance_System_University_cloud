## University Smart Attendance System

**Face-Based Classroom Attendance Platform**

A production-grade attendance solution that validates **continuous physical presence** using computer vision and securely records results in Firebase. Built for live demonstrations, formal evaluations, and real-world deployment.

---

## Overview

* Face-based attendance with strong anti-proxy controls
* Continuous presence verification using a configurable time threshold
* Single-identity enforcement across the entire system
* Admin-controlled attendance sessions with real-time tracking
* Cloud-ready architecture with no dependency on a fixed server camera

---

## Key Capabilities

* Face-based attendance (proxy-resistant)
* Time-threshold verification (student must remain in frame for *N* seconds)
* One face mapped to one identity for life
* Prevention of duplicate enrollment across IDs, names, or courses
* Real-time attendance marking during live sessions
* Secure admin access and session control
* Scalable, cloud-native design

---

## Technology Stack

### Frontend

* React with TypeScript
* Browser Camera API
* Deployed as a static web application

### Backend

* FastAPI
* Firebase Admin SDK (Firestore)
* MediaPipe for face detection
* REST-based ingestion of camera frames

### Database

* Firebase Firestore

---

## User Roles

### Student

* One-time enrollment using face and academic details
* Uses personal phone or laptop camera for attendance
* Cannot re-enroll with altered identity information

### Admin / Judge

* Manages classes and schedules
* Starts and stops attendance sessions
* Reviews finalized attendance records

---

## Core Workflow (High Level)

### Student Enrollment

* Student submits enrollment ID, name, course, and facial data
* System enforces strict validation and uniqueness rules

### Session Initialization

* Admin selects class and configures time threshold
* Attendance session is started

### Live Attendance Tracking

* Browser streams frames to backend
* Backend tracks continuous face presence
* Attendance is marked only after the threshold is met

### Session Finalization

* Admin stops the session
* Attendance is finalized and persisted
* Absent students are auto-calculated

### Review & Audit

* Attendance records available via dashboard
* Filterable by class and date
* Data persists across refreshes

---

## Enrollment Rules (Strict Enforcement)

* Enrollment ID must:

  * Start with `A100`
  * Be exactly 10 or 11 characters
* One face equals one identity permanently
* Re-enrollment is blocked if the same face attempts:

  * A different enrollment ID
  * A different name
  * A different course

---

## Attendance Rules

* Face must remain continuously visible
* Timer resets immediately if the face disappears
* Attendance is marked only once per session
* Absent students are derived automatically at session end

---

## Judge Testing Procedure (Step-by-Step)

### Step 1: Access Admin Dashboard

* Log in using preconfigured admin credentials
* Verify dashboard loads:

  * Students
  * Classes
  * Schedules

### Step 2: Enroll a Student

* Navigate to Student Enrollment
* Enter:

  * Enrollment ID
  * Name
  * Course
* Activate camera and submit
* Expected outcome:

  * Successful enrollment confirmation
  * Student appears in the Students list
  * Duplicate or invalid enrollment is blocked

### Step 3: Start Attendance Session

* Navigate to Take Attendance
* Select:

  * Class
  * Time threshold (e.g., 5 min)
* Start attendance
* Expected outcome:

  * Camera activates
  * Status indicates active face tracking

### Step 4: Validate Live Attendance

* Student remains in front of the camera
* After threshold completion:

  * Attendance is marked
* If the student moves away:

  * Timer resets, preventing false positives

### Step 5: Stop Attendance Session

* Stop the session from the admin panel
* Expected outcome:

  * Session closes
  * Attendance is finalized

### Step 6: Review Attendance Records

* Open Attendance page
* Apply filters:

  * Class
  * Date
* Verify:

  * Present students are listed
  * Absent students are listed
  * Records persist after page refresh

---

This system prioritizes integrity, auditability, and operational clarity—positioning it as a credible, deployment-ready solution rather than a conceptual prototype.
