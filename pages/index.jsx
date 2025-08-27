import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/styles.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function HomePage() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [message, setMessage] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    setIsMetaMaskInstalled(!!window.ethereum);
  }, []);

  async function handleMetaMaskLogin() {
    try {
      setMessage(""); 

      if (typeof window.ethereum === "undefined") {
        setMessage("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

 
      const response = await fetch("/api/nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to get nonce");
        return;
      }

      const { message: nonce } = await response.json();

      const signedMessage = await signer.signMessage(nonce);

      const data = { signedMessage, nonce, address };

      const authResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!authResponse.ok) {
        const error = await authResponse.json();
        setMessage(error.message || "Authentication failed");
        return;
      }

      const { token } = await authResponse.json();
      localStorage.setItem(address.toLowerCase(), token);

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/protectedroute");
      }, 1500);

    } catch (error) {
      console.error("MetaMask login error:", error);
      if (error.code === 4001) {
        setMessage(" You rejected the MetaMask connection request.");
      } else {
        setMessage(" Failed to login with MetaMask ");
      }
    }
  }

  return (
    <div className={styles.container}>
      <h1>Welcome, Please select an option below to continue.</h1>

     
      {message && <p style={{ color: "red", marginBottom: "10px" }}>{message}</p>}

      <div>
        <button
          className={styles.btn}
          onClick={handleMetaMaskLogin}
          disabled={!isMetaMaskInstalled}
        >
          {isMetaMaskInstalled ? "Login with MetaMask" : "MetaMask not installed"}
        </button>
        <br />
        <br />
      </div>

      <Link href="/signup">
        <button className={styles.btn}>Signup</button>
      </Link>
    </div>
  );
}

export default HomePage;
