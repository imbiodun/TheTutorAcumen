"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string; success?: string };

export async function createStudentRequest(_state: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: verification } = await supabase.auth.getClaims();
  const userId = verification?.claims.sub;
  if (!userId) return { error: "Please log in to submit a tutoring request." };
  const subject = String(formData.get("subject") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const goals = String(formData.get("goals") ?? "").trim();
  const language = String(formData.get("language") ?? "").trim();
  const budget = Number(formData.get("budget_max"));
  const availability = formData.getAll("availability").map(String).filter(Boolean);
  if (!subject || !level || !goals || !language || !Number.isFinite(budget) || budget <= 0 || !availability.length) return { error: "Please complete every field so we can find a good match." };
  const { error } = await supabase.from("student_requests").insert({ student_id: userId, subject, level, goals, language, budget_max: budget, availability });
  return error ? { error: error.message } : { success: "Your request is in. We’ll be in touch with your tutor suggestions soon." };
}

async function isAdmin() {
  const supabase = await createClient();
  const { data: verification } = await supabase.auth.getClaims();
  const userId = verification?.claims.sub;
  if (!userId) return { supabase, admin: false };
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return { supabase, admin: data?.role === "admin" };
}

export async function createMatch(formData: FormData): Promise<void> {
  const { supabase, admin } = await isAdmin();
  if (!admin) return;
  const requestId = String(formData.get("request_id") ?? "");
  const tutorId = String(formData.get("tutor_application_id") ?? "");
  if (!requestId || !tutorId) return;
  await supabase.from("matches").insert({ request_id: requestId, tutor_application_id: tutorId, status: "proposed", score: Number(formData.get("score") ?? 0), notes: String(formData.get("notes") ?? "") });
}

export async function introduceMatch(formData: FormData): Promise<void> {
  const { supabase, admin } = await isAdmin();
  if (!admin) throw new Error("You do not have permission to introduce matches.");
  const matchId = String(formData.get("match_id") ?? "");
  const requestId = String(formData.get("request_id") ?? "");
  const tutorId = String(formData.get("tutor_application_id") ?? "");
  const [{ data: request }, { data: tutor }] = await Promise.all([
    supabase.from("student_requests").select("student_id, subject").eq("id", requestId).single(),
    supabase.from("tutor_applications").select("full_name, email").eq("id", tutorId).single(),
  ]);
  if (!request || !tutor) throw new Error("Could not load both sides of this match.");
  const { data: student } = await supabase.from("profiles").select("full_name, email").eq("id", request.student_id).single();
  if (!student?.email || !tutor.email) throw new Error("Both sides need an email address before introduction.");
  if (!process.env.RESEND_API_KEY || !process.env.INTRO_FROM_EMAIL) throw new Error("Set RESEND_API_KEY and INTRO_FROM_EMAIL before sending introductions.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INTRO_FROM_EMAIL,
      to: [student.email, tutor.email],
      subject: `Your Tutor Acumen ${request.subject} introduction`,
      text: `Hi ${student.full_name ?? "there"} and ${tutor.full_name},\n\nWe think you could be a great learning match for ${request.subject}. Please reply-all to this email to arrange your first conversation.\n\nTutor Acumen`,
    }),
  });
  if (!response.ok) throw new Error("The introduction email could not be sent.");
  const { error } = await supabase.from("matches").update({ status: "introduced" }).eq("id", matchId);
  if (error) throw new Error(error.message);
}

export async function submitContactMessage(_state: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !message) return { error: "Please complete all fields." };
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  return error ? { error: error.message } : { success: "Thanks — your message has been sent." };
}

export async function submitTutorApplication(_state: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subjects = String(formData.get("subjects") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  const levels = String(formData.get("levels") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  const languages = String(formData.get("languages") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  const hourlyRate = Number(formData.get("hourly_rate"));
  const experience = String(formData.get("experience") ?? "").trim();
  const availability = formData.getAll("availability").map(String).filter(Boolean);
  const cv = formData.get("cv");
  if (!fullName || !email || !subjects.length || !levels.length || !languages.length || !experience || !availability.length || !Number.isFinite(hourlyRate) || !(cv instanceof File) || cv.size === 0) return { error: "Please complete every field and attach your CV." };
  if (cv.size > 5 * 1024 * 1024 || !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(cv.type)) return { error: "CVs must be PDF, DOC, or DOCX files under 5MB." };
  const path = `${crypto.randomUUID()}-${cv.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
  const upload = await supabase.storage.from("cvs").upload(path, cv, { contentType: cv.type, upsert: false });
  if (upload.error) return { error: "We couldn’t upload your CV. Please try again." };
  const { error } = await supabase.from("tutor_applications").insert({ full_name: fullName, email, subjects, levels, languages, hourly_rate: hourlyRate, experience, availability, cv_url: path });
  if (error) {
    await supabase.storage.from("cvs").remove([path]);
    return { error: error.message };
  }
  return { success: "Application received. We’ll review it and be in touch." };
}
