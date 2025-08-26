import {useState} from "react";
import styles from "../styles/signup.module.css";


function SignupPage() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");

    async function handleSubmit() {

        return 0;
     }
    return (
         <div className={styles.container}>

            <h1>Sign Up</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                 <label> 
               <span className={styles.label}>Name: </span>
               <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input}>
               </input>

                 </label>
                     <label> 
               <span className={styles.label}>EMAIL: </span>
               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input}>
               </input>

                 </label>
                 <button className={styles.btn} type="submit"> Submit</button>

            </form>
         </div>
    )

}

export default SignupPage;