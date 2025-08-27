import { useState } from "react";
import styles from "../styles/signup.module.css";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(false);  

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(""); 
    setError(false);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
      
        setError(true);
        setMessage(data.message || "Something went wrong!");
      } else {
       
        setError(false);
        setMessage(data.message || "Signup successful!");
      }
    } catch (err) {
      setError(true);
      setMessage("Server error, please try again!");
    }
  }

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span className={styles.label}>Name: </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </label>
        <label>
          <span className={styles.label}>Email: </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </label>
        <button className={styles.btn} type="submit">
          Submit
        </button>
      </form>

    
      {message && (
        <p style={{ color: error ? "red" : "green", marginTop: "10px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default SignupPage;
