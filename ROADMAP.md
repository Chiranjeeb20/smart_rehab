# Smart Rehab System - Feature Roadmap

This document outlines the desired features and implementation plan for the Smart Rehab System.

## Patient Side Features

- [ ] **User Registration/Login**
  - Integrate JWT or Firebase Auth.
  - Profile linking (age, injury type, therapy plan).
- [ ] **Exercise Library**
  - Collection of videos + instructions for prescribed movements.
- [ ] **AI Exercise Monitoring**
  - Device camera integration for real-time posture detection.
  - Pose comparison (User Pose vs Correct Pose).
  - Instant visual/voice/text feedback during exercises.
- [ ] **Daily Task List**
  - Dynamic fetched list of routines assigned by the Doctor.
- [ ] **Progress Tracking**
  - Dashboard tracking completed exercises.
  - Accuracy score visualizations over time.
  - Improvement graphs.
- [ ] **Notifications/Reminders**
  - Push/In-app reminders for upcoming sessions or missed workouts.
- [ ] **Chat with Doctor (Optional)**
  - Direct messaging interface.

---

## Doctor Side Features

- [ ] **Secure Login** 
  - Admin/Doctor authenticated routes.
- [ ] **Doctor Dashboard**
  - List of assigned patients.
  - Quick patient status overview (compliance flags, misses).
- [ ] **Patient Profile View**
  - Injury details and history tracking.
  - Exercise performance analytics (accuracy and session rates).
- [ ] **Assign Exercises**
  - Author/Modify custom plans.
  - Set specific reps, duration, and ranges of motion per movement.
- [ ] **Monitor Progress**
  - Visual graphs measuring adherence, accuracy, and consistency.
  - Ability to view patient session recordings (if opted-in).
- [ ] **Feedback System**
  - Interface to send notes, motivational nudges, or medical recommendations.
- [ ] **Alerts System**
  - Automated flags for patients exhibiting stagnant progress or skipped sessions.
