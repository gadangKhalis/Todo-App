"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      // Redirect to /todos on successful login
      router.push("/todos");
    } catch (err: any) {
      setError(err.response?.data?.message || "login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      <p className={styles.p}>
        Dont have an account?{" "}
        <a href="/auth/register" className={styles.link}>
          Register here
        </a>
      </p>

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
        onClick={handleLogin}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}
