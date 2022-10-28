import React, { useEffect, useState } from 'react';
import { authService, db, storage } from "fbase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Tweet from '../components/Tweet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'styles/profiles.scss';

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [attachment, setAttachment] = useState("");

  const OnLogOutClick = () => {
    authService.signOut();
    navigate('/');
    window.location.reload();
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

  const onClearAttachment = () => setAttachment("");

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName} required className='formInput' />
        <label htmlFor='attach-file' className='profileInput__label'>
          <span>Edit Photos</span>
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </label>
        <input type="file" accept="image/*" onChange={onFileChange} id='attach-file' style={{opacity: 0}} />
        {attachment && (
          <div className='profileForm__attachment'>
            <img src={attachment} style={{backgroundImage: attachment}} />
            <div onClick={onClearAttachment} className='profileForm__clear'>
              <span>Clear</span>
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </div>
          </div>
        )}
        <input type="submit" value="Edit Profile" className='formBtn' style={{marginTop: 10}} />
      </form>
      <span onClick={OnLogOutClick} className='formBtn cancelBtn logOut'>Logout</span>
      <div>
        {tweets.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.createId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
}

export default Profiles;