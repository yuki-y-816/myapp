import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { UserType, TweetType } from "types/typeList";

const TweetDetail = () => {
  const tweetId = Object.values(useParams());

  const [user, setUser] = useState<Partial<UserType>>({});
  const [tweet, setTweet] = useState<Partial<TweetType>>({});
  const [count, setCount] = useState<number>(0);
  const [favoriteOrNot, setFavoriteOrNot] = useState<boolean>(false);

  const getDetail = () => {
    const url = `http://localhost:3000/tweets/${tweetId}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setUser(res.data.user);
      setTweet(res.data.tweet);
      setCount(res.data.favorite_count);
      setFavoriteOrNot(res.data.favorite_or_not);
    });

    console.log("Used Effect///");
  };

  useEffect(getDetail, []);
  console.log(user);
  console.log(tweet);

  const clickFavoriteButton = () => {
    const url = `http://localhost:3000/favorites`;
    const data = { favorite_tweet_id: tweet.id };
    const config = { withCredentials: true };
    axios.post(url, data, config).then(res => {
      console.log(res);
      setFavoriteOrNot(!favoriteOrNot);
      setCount(count + 1);
    });
  };

  const clickUnFavoriteButton = () => {
    const url = `http://localhost:3000/unfavorite`;
    const data = { tweet_id: tweet.id };
    const config = { withCredentials: true };
    axios.post(url, data, config).then(res => {
      console.log(res);
      setFavoriteOrNot(!favoriteOrNot);
      setCount(count - 1);
    });
  };

  const profileImageUrl = `http://localhost:3000/${user.profile_image?.url}`;
  const tweetImageUrl = `http://localhost:3000/${tweet.tweet_image?.url}`;
  return (
    <div>
      <h1>tweet detail</h1>

      {user.profile_image?.url && <img src={profileImageUrl} alt="user" />}
      <p>{user.name}</p>
      <p>{tweet.content}</p>
      {tweet.tweet_image?.url && <img src={tweetImageUrl} alt="tweet" />}
      <p>{tweet.created_at}</p>

      <p>{count} いいね</p>
      {!favoriteOrNot && <button onClick={clickFavoriteButton}>いいね</button>}
      {favoriteOrNot && <button onClick={clickUnFavoriteButton}>いいね取消</button>}
    </div>
  );
}

export default TweetDetail;
