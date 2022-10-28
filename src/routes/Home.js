import React, { useEffect, useState } from 'react'
import { db } from "fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';

function Home({userObj}) {
  // console.log(userObj);
  const [tweets, setTweets] = useState([]);

  /*
    const getTweets = async () => {
      const q = query(collection(db, "tweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        // setTweets(prev => [doc.data(), ...prev]); 새로운 트윗을 가장 먼저 보여준다
        const tweetObject = {...doc.data(), id:doc.id}; // 기존의 값에 id를 추가함
        setTweets(prev => [tweetObject, ...prev]);
      });
    }
  */

  useEffect(() => {// 실시간 데이터베이스 문서들 가져오기
    // getTweets();
    const q = query(
      collection(db, "tweets"),
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

  // console.log(tweets);

  return (
    <div className='container'>
      <TweetFactory userObj={userObj} />
      <div style={{marginTop: 30}}>
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

export default Home;