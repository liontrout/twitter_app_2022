import React from 'react'
import { authService } from "fbase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import AuthForm from 'components/AuthForm';

function Auth() {
  const onSocialClick = (e) => {
    // console.log(e.target.name);
    const {target: {name}} = e;
    let provider
    if (name === "google") {
      provider = new GoogleAuthProvider();      
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = signInWithPopup(authService, provider);
    // console.log(data);
  }

  return (
    <>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </>
  )
}

export default Auth;