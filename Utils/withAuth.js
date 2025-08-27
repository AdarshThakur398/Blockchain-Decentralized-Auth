import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import LoadingSpinner from "./LoadingSpinner";

const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkMetamask = async () => {
        try {
          if (!window.ethereum) {
            console.warn("MetaMask not detected");
            router.push("/?error=metamask_not_installed");
            return;
          }

      
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length === 0) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
          }

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const currentAddress = await signer.getAddress();
          const token = window.localStorage.getItem(currentAddress.toLowerCase());

          if (!token) {
            console.warn("No token found for address:", currentAddress);
            router.push("/?error=no_token");
            return;
          }

          const response = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const newresponse = await response.json();
          console.log("Verify API response:", newresponse);

          if (newresponse.message !== "Valid") {
            window.localStorage.removeItem(currentAddress.toLowerCase());
            router.push("/?error=invalid_token");
            return;
          }

        
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Authentication error:", err);
          router.push("/?error=auth_failed");
        } finally {
          setIsLoading(false);
        }
      };

      checkMetamask();
    }, [router]);

    
    if (isLoading) {
      return <LoadingSpinner />;
    }

    
    return isAuthenticated ? <Component {...props} /> : null;
  };

  return Auth;
};

export default withAuth;