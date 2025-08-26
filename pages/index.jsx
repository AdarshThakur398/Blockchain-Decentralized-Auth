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
        return 0;

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