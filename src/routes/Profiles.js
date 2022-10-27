import React, { useEffect, useState } from 'react'
import { authService, db } from "fbase";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Tweet from '../components/Tweet';

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const OnLogOutClick = () => {
    authService.signOut();
    navigate('/');
  }

  const getMyTweets = async () => {
    const q = query(
      collection(db, "tweets"),
      where("createId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id});
    });
    setTweets(newArray);
  }

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = e => {
    const {target: {value}} = e;
    setNewDisplayName(value);
    // console.log(newDisplayName);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName, photoURL: ""
      });
    }
    setNewDisplayName("");
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={OnLogOutClick}>Logout</button>
      <div>
        {tweets.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.createId === userObj.uid}
          />
        ))}
      </div>
    </>
  )
}

export default Profiles