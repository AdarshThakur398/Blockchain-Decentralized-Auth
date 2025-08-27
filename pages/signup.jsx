import { useState } from "react";
import styles from "../styles/signup.module.css";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError(false);
    setPrivateKey("");

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
        setPrivateKey(data.privateKey || "");
        setName("");
        setEmail("");
      }
    } catch (err) {
      setError(true);
      setMessage("Server error, please try again!");
    }
  }

  const handleCopy = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      setMessage("Private key copied to clipboard! Import it into MetaMask.");
    }
  };

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
            required
          />
        </label>
        <label>
          <span className={styles.label}>Email: </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <button className={styles.btn} type="submit">
          Submit
        </button>
      </form>

      {message && (
        <div className={styles.messageContainer}>
          <p className={error ? styles.error : styles.success}>{message}</p>
          {privateKey && (
            <div className={styles.privateKeyContainer}>
              <p>
                <strong>Private Key:</strong>
              </p>
              <div className={styles.privateKeyBox}>
                {privateKey}
              </div>
              <button className={styles.copyBtn} onClick={handleCopy}>
                Copy Private Key
              </button>
              <p className={styles.warning}>
                Warning: Keep your private key secure. Do not share it. Import it into MetaMask to use your account.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SignupPage;