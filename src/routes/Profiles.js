import React, { useEffect, useState } from 'react'
import { authService, db, storage } from "fbase";
import { addDoc, collection, query, getDocs, where, orderBy, onSnapshot } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Tweet from '../components/Tweet';

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");

  const OnLogOutClick = () => {
    authService.signOut();
    navigate('/');
  }

  useEffect(() => {
    const q = query(
      collection(db, "tweets"),
      where("createId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        // newArray.push(doc.data());
        newArray.push({...doc.data(), id:doc.id});
      });
      // console.log(newArray);
      setTweets(newArray);
    });
  }, []);

  const onChange = e => {
    const {target: {value}} = e;
    setNewDisplayName(value);
    // console.log(newDisplayName);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(ref(storage, response.ref));
    }

    if (userObj.displayName !== newDisplayName || userObj.photoURL !== attachmentUrl) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: attachmentUrl
      });
    }
    setNewDisplayName("");
    setAttachment("");
  };

  const onFileChange = e => {
    // console.log(e.target.files);
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => {
    setAttachment("");
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName} required/>
        <input type="file" accept="image/*" onChange={onFileChange} />{attachment && (
        <div>
          <img src={attachment} width="50" height="50" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
        )}
        <input type="submit" value="Edit Profile" />
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