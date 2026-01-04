University Smart Attendance System

Face-based Classroom Attendance Platform

A production-ready attendance system that verifies continuous physical presence using computer vision and records attendance securely in Firebase. Designed for live demos, evaluations, and real-world deployment.

Key Capabilities

Face-based attendance (no proxy)

Time-threshold verification (student must stay in frame for N seconds)

Single identity enforcement

Same face cannot enroll with different IDs, names, or courses

Admin-controlled attendance sessions

Real-time attendance marking

Secure admin access

Cloud-ready architecture (no server camera dependency)

Technology Stack
Frontend

React + TypeScript

Browser Camera API

Deployed as static web app

Backend

FastAPI

Firebase Admin SDK (Firestore)

MediaPipe (face detection)

REST-based camera frame ingestion

Database

Firebase Firestore

Roles
Student

Enrolls once using face + enrollment details

Uses personal phone or laptop camera

Admin / Judge

Manages classes & schedules

Starts and stops attendance sessions

Reviews attendance records

Core Flow (High Level)

Student Enrollment

Student submits ID, name, course, and face

System blocks:

Duplicate face

Invalid enrollment ID

Re-enrollment across courses

Admin Starts Class

Admin selects class

Starts attendance session with time threshold

Live Attendance

Browser streams frames to backend

Backend tracks face presence time

Attendance marked only after threshold

Admin Stops Class

Session finalizes attendance

Present & absent students are stored

Review

Attendance visible in dashboard with filters

Enrollment Rules (Strict)

Enrollment ID must:

Start with A100

Be 10 or 11 characters only

One face = one identity forever

Same face cannot enroll again with:

Different ID

Different name

Different course

Attendance Rules

Face must remain visible continuously

Timer resets if face disappears

Attendance marked once per session

Absent students are auto-derived at session end

How Judges Test the System (Step-by-Step)
Step 1: Open Admin Dashboard

Login as admin (preconfigured for demo)

Verify dashboard loads:

Students

Classes

Schedules

Step 2: Enroll a Student

Go to Student Enrollment

Fill:

Enrollment ID

Name

Course

Start camera → Submit

Expected:

Success message

Student visible in Students list

Duplicate enrollment blocked

Step 3: Start Attendance Session

Go to Take Attendance

Select:

Class

Time threshold (e.g. 5 seconds)

Click Start Attendance

Expected:

Camera activates

Status shows “Tracking face…”

Step 4: Verify Live Attendance

Student stays in front of camera

After threshold:

Status shows “Attendance marked”

Move away:

Timer resets (no false marking)

Step 5: Stop Attendance

Click Stop Attendance

Expected:

Session closes

Attendance finalized

Step 6: Review Attendance

Go to Attendance Page

Apply filters:

Class

Date

Verify:

Present students listed

Absent students listed

Data persists after refresh
