import  Link from 'next/link';
import styles from '../styles/styles.module.css'
import { useEffect,useState } from 'react';
import {ethers} from 'ethers';


function HomePage()  {

    const[isMetaMaskinstalled,setIsMetaMaskInstalled]=useState(false);
    useEffect(() => {
         setIsMetaMaskInstalled(!!window.ethereum);

    },[]);
    async function handleMetaMaskLogin() {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed!");
    }

   
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log("Connected accounts:", accounts);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected address:", address);

    const response=await fetch('/api/nonce', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({address})

    })
    if(!response.ok) {
        const error=await response.json();
        console.log(error);
    }
    const resp=response.json();
    const nonce=resp.message;
    console.log(nonce);
  } catch (error) {
    console.error("MetaMask login error:", error);
    alert("Failed to login with MetaMask! Check console for details.");
  }
}


    return (

        <div className={styles.container}>
            <h1>Welcome,Please select an option below to continue.</h1>
            <div>
            <button className={styles.btn} onClick={handleMetaMaskLogin}> Login with metamask. </button>
            <br/>
            <br/>
            
            </div>
            <Link href="/signup">
            <button className={styles.btn}>Signup</button>
            </Link>
        </div>
    )
}

export default HomePage;