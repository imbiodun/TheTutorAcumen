"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link"; 

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/request");
  }

  async function signInWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded border p-2"
        />

        
        <input value={email} onChange={(e) => setEmail(e.target.value)} type = "email" placeholder = "youremail@example.com" required className = "w-full rounded border p-2"/> 
        
        < input value={password} onChange = {(e) => setPassword(e.target.value)} type = "password" minLength = {6} required  className = "w-full rounded border p-2"/> 

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200" />OR<span className="h-px flex-1 bg-gray-200" /></div>
      <button type="button" onClick={signInWithGoogle} disabled={loading} className="w-full rounded border border-gray-300 py-2 hover:bg-gray-50 disabled:opacity-50">Continue with Google</button>

      <p className= "mt-6 text-center text-sm text-grey-600">Already have an account?
        <Link href= "/login" className= "text-blue-500 hover:underline"> Login</Link>
      </p>
    </main>
  );
}