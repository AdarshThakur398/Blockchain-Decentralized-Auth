import {useState,useEffect} from "react";
import {useRouter} from "next/router";
import {ethers} from "ethers";

const withAuth  = (component) => {
    const  Auth = (props) => {
        const router=useRouter();
        const [resp,setresp]=useState('valid');
        useEffect(() => {
            const checkMetamask = async () => {
                if(window.ethereum) {
                    try {
                      await window.ethereum.request({method:'eth_requestAccounts'});
                      const providers=new ethers.providers.Web3Provider(window.ethereum);
                      const signer=provider.getSigner();
                      const currentAddress=await signer.getAddress();
                      const token = localstorage.getItem(currentAddress);
                    if(token !== '') {
                        const response=await fetch('/api/verify', {
                              method :'POST',
                              headers: {
                                 'Content-Type':'application/json',
                                 'Authorization':`Bearer ${token}`
                              }
                        });
                        let newresponse=await response.json();
                        setresp(newresponse.message);
                        if(resp !== 'Valid') {
                            window.localStorage.removeItem(currentAddress);
                            router.push('/');
                        }
                    }
                    else {
                        router.push('/');
                    }
                }
                catch(err) {
                    console.error(err);
                }}
            }
        },[resp.router]);
        return <component {...props} />
    };
    return Auth;

}

export default withAuth;