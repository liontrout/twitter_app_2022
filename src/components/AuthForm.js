import React, { useState } from 'react';
import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import 'styles/authForm.scss';

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = e => {
    // console.log(e.target.name);
    const {target: {name, value}} = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create newAccount
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        // login
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      // console.log(data); 회원가입을 마친 사용자 정보
    } catch (error) {
      // console.log(error);
      setError(error.message);
    }
  }

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className='container'>
        <input type="email" placeholder="e-mail" required name="email" value={email} onChange={onChange} className='authInput' />
        <input type="password" placeholder="password" required name="password" value={password} onChange={onChange} className='authInput' />
        <input type="submit" value={newAccount ? "Create Account" : "Login"} className='authInput authSubmit' />
        {error &&
          <span className='authError'>{error}</span>
        }
      </form>
      <span onClick={toggleAccount} className='authSwitch'>{newAccount ? "Sign In" : "Create Account"}</span>
    </>
  )
}

export default AuthForm;