
export interface Exercise {
  id: string;
  name: string;
  specialist: "Physiotherapist" | "Occupational Therapist" | "Neuropsychologist" | "General";
  category: "knee" | "shoulder" | "back" | "neck" | "ankle" | "general" | "posture" | "balance" | "coordination";
  type: "warm-up" | "main" | "cool-down";
  difficulty: "beginner" | "intermediate" | "advanced";
  illustration: string;
  video: string;
  sets: number;
  reps: number;
  duration?: string;
  status: "not-started" | "in-progress" | "completed";
  instructions: string[];
  poseConfig?: {
    type: "leg-raise" | "flexion" | "squat" | "arm-raise" | "neck-stretch" | "posture-hold" | "balance-hold";
    targetJoints: number[];
  }
}

export const DUMMY_EXERCISES: Exercise[] = [
  // --- PHYSIOTHERAPIST (Knee & Joint Rehab) ---
  {
    id: "physio-wu-1",
    name: "Ankle Pumps",
    specialist: "Physiotherapist",
    category: "ankle",
    type: "warm-up",
    difficulty: "beginner",
    illustration: "accessibility",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 1,
    reps: 15,
    status: "not-started",
    instructions: ["Pump your foot up and down.", "Repeat 15 times.", "Increases blood flow."],
  },
  {
    id: "physio-main-1",
    name: "Heel Slides",
    specialist: "Physiotherapist",
    category: "knee",
    type: "main",
    difficulty: "beginner",
    illustration: "straighten",
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-performing-leg-extensions-at-the-gym-23425-large.mp4",
    sets: 3,
    reps: 10,
    status: "not-started",
    instructions: ["Slide heel toward buttocks.", "Bend knee as far as comfortable.", "Slowly return."],
    poseConfig: { type: "flexion", targetJoints: [23, 25, 27] }
  },
  {
    id: "physio-main-2",
    name: "Straight Leg Raises",
    specialist: "Physiotherapist",
    category: "knee",
    type: "main",
    difficulty: "intermediate",
    illustration: "straighten",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 3,
    reps: 12,
    status: "not-started",
    instructions: ["Keep leg straight.", "Raise to 45 degrees.", "Lower slowly."],
    poseConfig: { type: "leg-raise", targetJoints: [23, 24, 25, 26] }
  },
  {
    id: "physio-main-3",
    name: "Wall Support Squats",
    specialist: "Physiotherapist",
    category: "knee",
    type: "main",
    difficulty: "intermediate",
    illustration: "straighten",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 3,
    reps: 12,
    status: "not-started",
    instructions: ["Back against wall.", "Slide down slowly.", "Hold 5 seconds."],
    poseConfig: { type: "squat", targetJoints: [23, 25, 27] }
  },

  // --- OCCUPATIONAL THERAPIST (Posture & Daily Mobility) ---
  {
    id: "ot-wu-1",
    name: "Shoulder Rolls",
    specialist: "Occupational Therapist",
    category: "posture",
    type: "warm-up",
    difficulty: "beginner",
    illustration: "accessibility",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 1,
    reps: 12,
    status: "not-started",
    instructions: ["Raise shoulders toward ears.", "Rotate them back and down.", "Release slowly."],
    poseConfig: { type: "arm-raise", targetJoints: [11, 12] }
  },
  {
    id: "ot-main-1",
    name: "Gentle Neck Tilts",
    specialist: "Occupational Therapist",
    category: "neck",
    type: "main",
    difficulty: "beginner",
    illustration: "accessibility",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 3,
    reps: 10,
    status: "not-started",
    instructions: ["Tilt head to side.", "Hold for 5 seconds.", "Repeat opposite side."],
    poseConfig: { type: "neck-stretch", targetJoints: [0, 11, 12] }
  },
  {
    id: "ot-main-2",
    name: "Posture Alignment Hold",
    specialist: "Occupational Therapist",
    category: "posture",
    type: "main",
    difficulty: "beginner",
    illustration: "person",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 3,
    reps: 1,
    duration: "45s",
    status: "not-started",
    instructions: ["Align head, shoulders, and hips.", "Hold the straight posture.", "Breathe normally."],
    poseConfig: { type: "posture-hold", targetJoints: [0, 11, 12, 23, 24] }
  },

  // --- NEUROPSYCHOLOGIST (Balance & Coordination) ---
  {
    id: "neuro-wu-1",
    name: "Controlled Eye-Hand Tracking",
    specialist: "Neuropsychologist",
    category: "coordination",
    type: "warm-up",
    difficulty: "beginner",
    illustration: "visibility",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 1,
    reps: 10,
    status: "not-started",
    instructions: ["Follow your finger with your eyes.", "Move your hand in circles.", "Maintain steady focus."],
  },
  {
    id: "neuro-main-1",
    name: "Tandem Stance Balance",
    specialist: "Neuropsychologist",
    category: "balance",
    type: "main",
    difficulty: "intermediate",
    illustration: "accessibility",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 3,
    reps: 1,
    duration: "30s",
    status: "not-started",
    instructions: ["Place one foot directly in front of other.", "Heel touching toe.", "Maintain balance for 30s."],
    poseConfig: { type: "balance-hold", targetJoints: [27, 28, 23, 24] }
  },
  {
    id: "neuro-main-2",
    name: "Controlled Movement Slow-Step",
    specialist: "Neuropsychologist",
    category: "coordination",
    type: "main",
    difficulty: "beginner",
    illustration: "directions_walk",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 2,
    reps: 10,
    status: "not-started",
    instructions: ["Step forward very slowly.", "Hold mid-step for 1 second.", "Focus on stability."],
  },

  // --- COOL DOWN (Shared/General) ---
  {
    id: "general-cd-1",
    name: "Deep Breathing Stretch",
    specialist: "General",
    category: "general",
    type: "cool-down",
    difficulty: "beginner",
    illustration: "air",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-wall-stretches-41001-large.mp4",
    sets: 1,
    reps: 5,
    status: "not-started",
    instructions: ["Inhale deeply while raising arms.", "Exhale while lowering."],
    poseConfig: { type: "arm-raise", targetJoints: [11, 12, 13, 14] }
  }
];
