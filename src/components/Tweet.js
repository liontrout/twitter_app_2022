import React, { useEffect, useState } from 'react'
import { db, storage } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { async } from '@firebase/util';

function Tweet({tweetObj, isOwner}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [nowDate, setNowDate] = useState(tweetObj.createAt);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      // console.log(tweetObj.id);
      // const data = await db.doc(`tweets/${tweetObj.id}`);
      const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`));
      // console.log(data);
      if (tweetObj.attachmentUrl !== "") {
        const deleteRef = ref(storage, tweetObj.attachmentUrl);
        await deleteObject(deleteRef);
      }
    }
  }

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }

  const onChange = e => {
    const {target: {value}} = e;
    setNewTweet(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(tweetObj.id, newTweet);
    const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`);
    await updateDoc(newTweetRef, {
      text: newTweet,
      createAt: Date.now()
    });
    setEditing(false);
  }

  useEffect(() => {
    let timeStamp = tweetObj.createAt;
    const now = new Date(timeStamp);
    // console.log(now);
    setNowDate(now.toUTCString()); // .toUTCString() .toDateString()
  }, [])
  

  return (
    <div>
      {editing ? (// 수정화면
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} value={newTweet} required />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="50" height="50" />
          )}
          <span>{nowDate}</span>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Tweet