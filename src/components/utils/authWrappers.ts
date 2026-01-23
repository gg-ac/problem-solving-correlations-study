import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

export function authenticateAnonymously(successCallback:(userUID:string)=>void, failureCallback:(error:any)=>void){
    signInAnonymously(auth)
    .then((userCredentials) => {
        successCallback(userCredentials.user.uid)
    })
    .catch((error) => {
        failureCallback(error)
    });
}