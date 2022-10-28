import { useEffect, useState } from 'react';
import AppRouter from 'Router';
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
library.add(fas, faTwitter, faGoogle, faGithub)

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); // 로그인한 사용자 정보

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      // console.log(user);
      if (user) {
        // signed in
        setIsLoggedIn(user);
        setUserObj(user);
        // const uid = user.uid;
      } else {
        // signed out
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  // console.log(authService.currentUser); // currentUser는 현재 로그인한 사람을 확인하는 함수

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "initializing..."}
      <footer>
        &copy; {new Date().getFullYear()} Twitter App
      </footer>
    </>
  );
}

export default App;