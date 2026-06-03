"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      await registerUser(email, password);
      // Redirect to login on successful Register
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />

      {/* display error from backend */}
      {error && <p className={styles.error}>{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Loading..." : "Register"}
      </button>

      <p className={styles.link}>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </div>
  );
}
