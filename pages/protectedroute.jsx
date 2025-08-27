import { useEffect, useState } from "react";
import { ethers } from "ethers";
import withAuth from "../Utils/withAuth";
import styles from "../styles/protectedroutes.module.css";

function Protectedroute() {
  const [balance, setBalance] = useState(null);
  const [chainName, setChainName] = useState("");
  const [chainClass, setChainClass] = useState("unknown");
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function loadBalance() {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not installed!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const addr = await signer.getAddress();
        setAccount(addr);

        const rawBalance = await provider.getBalance(addr);
        const formattedBalance = ethers.formatEther(rawBalance);

        const network = await provider.getNetwork();
        const chainMap = {
          1: { name: "Ethereum", class: "ethereum" },
          137: { name: "Polygon", class: "polygon" },
          56: { name: "Binance Smart Chain", class: "bsc" },
          43114: { name: "Avalanche", class: "avalanche" },
          10: { name: "Optimism", class: "optimism" },
          42161: { name: "Arbitrum", class: "arbitrum" },
        };

        const chainInfo = chainMap[network.chainId] || { name: "Unknown", class: "unknown" };
        setChainName(chainInfo.name);
        setChainClass(chainInfo.class);

        setBalance(formattedBalance);

        window.ethereum.on("accountsChanged", loadBalance);
        window.ethereum.on("chainChanged", () => window.location.reload());
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }

    loadBalance();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Protected Route</h1>

        {account ? (
          <>
            <div className={styles.infoBox}>
              <div className={styles.label}>Connected Account:</div>
              <div className={styles.value}>{account}</div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.label}>Balance:</div>
              <div className={styles.value}>
                {balance}{" "}
                <span className={`${styles.chainBadge} ${styles[chainClass]}`}>
                  {chainName}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280" }}>Loading account info...</p>
        )}
      </div>
    </div>
  );
}

export default withAuth(Protectedroute);
