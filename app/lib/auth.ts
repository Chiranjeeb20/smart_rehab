// =============================================================================
// Auth Utility — localStorage-based user database & session management
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  designation?: string;
  doctorCode?: string;
  connectedDoctorCode?: string; // For patients: the doctor they're connected to
  phone?: string;
  createdAt: string;
  patientProfile?: {
    condition: "knee" | "shoulder" | "back" | "neck" | "ankle" | "general" | "posture" | "balance" | "coordination";
    severity: "mild" | "moderate" | "severe";
    goal: "pain-relief" | "mobility" | "strength" | "coordination";
    recommendedSpecialist?: "Physiotherapist" | "Occupational Therapist" | "Neuropsychologist";
    age?: number;
  };
  assignedExercises?: string[]; // IDs of current routine
  planType?: "demo" | "ai" | "doctor";
  performanceHistory?: {
    exerciseId: string;
    date: string;
    accuracy: number;
    completed: boolean;
  }[];
}

export interface Session {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
  designation?: string;
  doctorCode?: string;
  connectedDoctorCode?: string;
  patientProfile?: User["patientProfile"];
  assignedExercises?: string[];
  planType?: User["planType"];
}

export interface DoctorInfo {
  name: string;
  designation: string;
  doctorCode: string;
  phone: string;
}

const USERS_KEY = "smart_rehab_users";
const SESSION_KEY = "smart_rehab_session";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  let users: User[] = [];
  if (raw) {
    try {
      users = JSON.parse(raw);
    } catch {
      users = [];
    }
  }

  // Ensure sample doctors are in the database so their codes work
  const sampleDoctors = [
    { name: "Dr. Arjun Mehta", role: "doctor", doctorCode: "934158", designation: "Chief Physiotherapist", phone: "+91 99012 34567" },
    { name: "Dr. Kavitha Nair", role: "doctor", doctorCode: "627491", designation: "Occupational Therapist", phone: "+91 88901 23456" },
    { name: "Dr. Priya Sharma", role: "doctor", doctorCode: "305726", designation: "Neuropsychologist", phone: "+91 76543 21098" },
    { name: "Dr. Rajesh Iyer", role: "doctor", doctorCode: "719384", designation: "Sports Physiotherapist", phone: "+91 87654 32109" },
    { name: "Dr. Ananya Verma", role: "doctor", doctorCode: "482910", designation: "Clinical OT Specialist", phone: "+91 98765 43210" },
  ];

  let modified = false;
  sampleDoctors.forEach(sd => {
    if (!users.find(u => u.doctorCode === sd.doctorCode)) {
      users.push({
        id: `sample-${sd.doctorCode}`,
        email: `contact@${sd.name.toLowerCase().replace(/ /g, "")}.com`,
        password: "password123",
        name: sd.name,
        role: "doctor",
        doctorCode: sd.doctorCode,
        designation: sd.designation,
        phone: sd.phone,
        createdAt: new Date().toISOString(),
      });
      modified = true;
    }
  });

  if (modified) {
    saveAllUsers(users);
  }

  return users;
}

function saveAllUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateDoctorCode(existingUsers: User[]): string {
  const existingCodes = new Set(
    existingUsers.filter((u) => u.doctorCode).map((u) => u.doctorCode)
  );
  let code: string;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (existingCodes.has(code));
  return code;
}

function createSession(user: User): Session {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    designation: user.designation,
    doctorCode: user.doctorCode,
    connectedDoctorCode: user.connectedDoctorCode,
    patientProfile: user.patientProfile,
    assignedExercises: user.assignedExercises,
  };
}

// ---------------------------------------------------------------------------
// Public API — Auth
// ---------------------------------------------------------------------------

export type AuthResult =
  | { success: true; user: Session }
  | { success: false; error: string };

export function registerUser(
  name: string,
  email: string,
  password: string,
  role: "patient" | "doctor",
  designation?: string
): AuthResult {
  const users = getAllUsers();

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in instead.",
    };
  }

  const newUser: User = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    password,
    role,
    designation: role === "doctor" ? designation : undefined,
    doctorCode: role === "doctor" ? generateDoctorCode(users) : undefined,
    phone: role === "doctor" ? `+1 (${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);

  const session = createSession(newUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: session };
}

export function loginUser(email: string, password: string): AuthResult {
  const users = getAllUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return { success: false, error: "User not registered. Please sign up first." };
  }
  if (user.password !== password) {
    return { success: false, error: "Invalid credentials. Please check your password." };
  }

  const session = createSession(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function loginWithDoctorCode(
  doctorCode: string,
  password: string
): AuthResult {
  const users = getAllUsers();
  const user = users.find(
    (u) => u.doctorCode === doctorCode && u.role === "doctor"
  );

  if (!user) {
    return { success: false, error: "Invalid Doctor Code. No doctor found with this code." };
  }
  if (user.password !== password) {
    return { success: false, error: "Invalid credentials. Please check your password." };
  }

  const session = createSession(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function getCurrentUser(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    const users = getAllUsers();
    // Return latest user data from storage instead of stale session only
    const user = users.find(u => u.id === session.id);
    return user || session;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// ---------------------------------------------------------------------------
// Public API — Doctor-Patient Connection
// ---------------------------------------------------------------------------

/**
 * Connect a patient to a doctor using a 6-digit doctor code.
 */
export function connectToDoctor(doctorCode: string): {
  success: boolean;
  error?: string;
  doctorName?: string;
} {
  const session = getCurrentUser();
  if (!session || session.role !== "patient") {
    return { success: false, error: "Only patients can connect to doctors." };
  }

  const users = getAllUsers();
  const doctor = users.find(
    (u) => u.doctorCode === doctorCode && u.role === "doctor"
  );

  if (!doctor) {
    return { success: false, error: "No doctor found with this code." };
  }

  // Update the patient's connectedDoctorCode in the users DB
  const updatedUsers = users.map((u) => {
    if (u.id === session.id) {
       // Determine clinician role from doctor's designation
       const desig = doctor.designation?.toLowerCase() || "";
       let specialistRole: "Physiotherapist" | "Occupational Therapist" | "Neuropsychologist" = "Physiotherapist";
       
       if (desig.includes("occupational") || desig.includes("ot") || desig.includes("posture")) {
         specialistRole = "Occupational Therapist";
       } else if (desig.includes("neuro") || desig.includes("psych") || desig.includes("brain")) {
         specialistRole = "Neuropsychologist";
       }
       
       const profile = u.patientProfile || { condition: "general" as any, severity: "moderate" as any, goal: "mobility" as any };
       
       // Override specialist based on the human doctor we just connected to
       const { plan } = generateAIRehabPlan({ ...profile, recommendedSpecialist: specialistRole });
       
       const updatedUser = { 
         ...u, 
         connectedDoctorCode: doctorCode, 
         patientProfile: { 
           ...profile, 
           recommendedSpecialist: specialistRole,
           condition: profile.condition || (specialistRole === "Physiotherapist" ? "knee" : specialistRole === "Occupational Therapist" ? "posture" : "balance")
         }, 
         assignedExercises: plan,
         planType: "doctor" as const
       };
       // Update session too
       localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
       return updatedUser;
    }
    return u;
  });
  saveAllUsers(updatedUsers);

  // Update session
  const finalUser = updatedUsers.find(u => u.id === session.id)!;
  const updatedSession = createSession(finalUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

  return {
    success: true,
    doctorName: doctor.name,
  };
}

/**
 * AI Engine: Generates a personalized rehabilitation routine based on Specialist
 */
export function generateAIRehabPlan(profile: NonNullable<User["patientProfile"]>): { plan: string[], specialist: string } {
  const { DUMMY_EXERCISES } = require("./exercises");
  const plan: string[] = [];

  // Map condition to specialist (Default if not forced)
  let specialist: "Physiotherapist" | "Occupational Therapist" | "Neuropsychologist" = profile.recommendedSpecialist || "Physiotherapist";
  
  if (!profile.recommendedSpecialist) {
    if (["neck", "posture", "back"].includes(profile.condition)) {
      specialist = "Occupational Therapist";
    } else if (["balance", "coordination", "general"].includes(profile.condition)) {
      specialist = "Neuropsychologist";
    }
  }

  // Filter exercises by specialist
  const specialistLibrary = DUMMY_EXERCISES.filter((ex: any) => ex.specialist === specialist || ex.specialist === "General");

  // 1. Pick 1 Warm-up
  const warmups = specialistLibrary.filter((ex: any) => ex.type === "warm-up");
  if (warmups.length > 0) plan.push(warmups[Math.floor(Math.random() * warmups.length)].id);
  
  // 2. Pick Main Therapy
  const mainEx = specialistLibrary.filter((ex: any) => ex.type === "main");
  const count = profile.severity === "severe" ? 2 : profile.severity === "moderate" ? 3 : 2;
  const selectedMain = mainEx.slice(0, count);
  selectedMain.forEach((ex: any) => plan.push(ex.id));
  
  // 3. Pick 1 Cool-down
  const cooldowns = specialistLibrary.filter((ex: any) => ex.type === "cool-down");
  if (cooldowns.length > 0) plan.push(cooldowns[Math.floor(Math.random() * cooldowns.length)].id);

  return { plan, specialist };
}

/**
 * Disconnect a patient from their doctor.
 */
export function disconnectFromDoctor(): void {
  const session = getCurrentUser();
  if (!session) return;

  const users = getAllUsers();
  const updatedUsers = users.map((u) =>
    u.id === session.id ? { ...u, connectedDoctorCode: undefined, assignedExercises: undefined } : u
  );
  saveAllUsers(updatedUsers);

  // Update session
  const finalUser = updatedUsers.find(u => u.id === session.id)!;
  localStorage.setItem(SESSION_KEY, JSON.stringify(createSession(finalUser)));
}

/**
 * Update patient profile and refresh AI plan
 */
export function updatePatientProfile(profile: NonNullable<User["patientProfile"]>): void {
  const session = getCurrentUser();
  if (!session) return;

  const users = getAllUsers();
  const { plan, specialist } = generateAIRehabPlan(profile);
  
  const updatedProfile = { ...profile, recommendedSpecialist: specialist as any };
  
  const updatedUsers = users.map((u) => {
    if (u.id === session.id) {
       const updated = { ...u, patientProfile: updatedProfile, assignedExercises: plan, planType: "ai" as const };
       localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
       return updated;
    }
    return u;
  });
  saveAllUsers(updatedUsers);

  const finalUser = updatedUsers.find(u => u.id === session.id)!;
  localStorage.setItem(SESSION_KEY, JSON.stringify(createSession(finalUser)));
}

/**
 * Log exercise performance
 */
export function logPerformance(exerciseId: string, accuracy: number, completed: boolean): void {
  const session = getCurrentUser();
  if (!session) return;

  const users = getAllUsers();
  const updatedUsers = users.map((u) => {
    if (u.id === session.id) {
       const history = u.performanceHistory || [];
       return { 
         ...u, 
         performanceHistory: [...history, { exerciseId, date: new Date().toISOString(), accuracy, completed }] 
       };
    }
    return u;
  });
  saveAllUsers(updatedUsers);
}

/**
 * Check if the current patient is connected to a doctor.
 */
export function isConnectedToDoctor(): boolean {
  const session = getCurrentUser();
  return !!(session && session.connectedDoctorCode);
}

/**
 * Get info about the doctor connected to the current patient.
 */
export function getConnectedDoctorInfo(): DoctorInfo | null {
  const session = getCurrentUser();
  if (!session || !session.connectedDoctorCode) return null;

  const users = getAllUsers();
  const doctor = users.find(
    (u) => u.doctorCode === session.connectedDoctorCode && u.role === "doctor"
  );

  if (!doctor) return null;
  return {
    name: doctor.name,
    designation: doctor.designation || "Physician",
    doctorCode: doctor.doctorCode || "",
    phone: doctor.phone || "",
  };
}

/**
 * Get a list of all registered doctors (for the specialist slider).
 */
export function getAllDoctors(): DoctorInfo[] {
  const users = getAllUsers();
  return users
    .filter((u) => u.role === "doctor" && u.doctorCode)
    .map((u) => ({
      name: u.name,
      designation: u.designation || "Physician",
      doctorCode: u.doctorCode || "",
      phone: u.phone || "",
    }));
}
