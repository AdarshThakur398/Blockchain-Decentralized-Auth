import Link from 'next/link';
import styles from '../styles/styles.module.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


function HomePage() {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    
    useEffect(() => {
        setIsMetaMaskInstalled(!!window.ethereum);
    }, []);

    async function handleMetaMaskLogin() {
        try {
            console.log("Button clicked");
            console.log("window.ethereum:", window.ethereum);
            console.log("typeof window.ethereum:", typeof window.ethereum);
            
            if (typeof window.ethereum === "undefined") {
                throw new Error("MetaMask is not installed!");
            }

            console.log("MetaMask detected, creating provider...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            console.log("Requesting accounts...");
            const accounts = await provider.send("eth_requestAccounts", []);
            console.log("Connected accounts:", accounts);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            console.log("Connected address:", address);

            const response = await fetch('/api/nonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });

            let responseData;
            
            if (!response.ok) {
                try {
                    responseData = await response.json();
                    console.log("Error response:", responseData);
                    alert(responseData.message || "Failed to get nonce");
                } catch (e) {
                    console.log("Failed to parse error response");
                    alert("Server error occurred");
                }
                return;
            }

            responseData = await response.json();
            const nonce = responseData.message;
            console.log("Nonce received:", nonce);

            const signedMessage = await signer.signMessage(nonce);
            
            const data = { signedMessage, nonce, address };

         
            const authResponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!authResponse.ok) {
                const error = await authResponse.json();
                console.log("Auth error:", error);
                alert(error.message || "Authentication failed");
                return;
            }

            const token = await authResponse.json();
            console.log("Token received:", token);
            
           
            localStorage.setItem(`token_${address}`, token.token);
            window.location.href='./protectedroute';
            
        } catch (error) {
            console.error("MetaMask login error:", error);
            alert("Failed to login with MetaMask! Check console for details.");
        }
    }

    return (
        <div className={styles.container}>
            <h1>Welcome, Please select an option below to continue.</h1>
            <div>
                <button 
                    className={styles.btn} 
                    onClick={handleMetaMaskLogin}
                    disabled={!isMetaMaskInstalled}
                >
                    {isMetaMaskInstalled ? 'Login with MetaMask' : 'MetaMask not installed'}
                </button>
                <br/>
                <br/>
            </div>
            <Link href="/signup">
                <button className={styles.btn}>Signup</button>
            </Link>
        </div>
    );
}

export default HomePage;