import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { TimelineType, UserType } from "types/typeList";

import useTimeline from "hooks/useTimeline";


const SearchResult = (prop: any) => {
  console.log("!!SearchResult!!");
  const keyword = Object.values(useParams());
  const [tweetData, setTweetData] = useState<Partial<TimelineType[]>>([]);
  const [userData, setUserData] = useState<Partial<UserType[]>>([]);

  console.log(keyword);
  const getSearchResult = () => {
    setTweetData([]);
    setUserData([]);
    const url = `http://localhost:3000/search/${keyword}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      res.data.searched_tweet.forEach((e: TimelineType) => setTweetData(tweetData => [...tweetData, e]));
      res.data.searched_user.forEach((e: UserType) => setUserData(userData => [...userData, e]));
    });
  };

  useEffect(getSearchResult, [prop.match.params]);

  const searchedTweet = useTimeline(tweetData);

  const searchedUser = userData.map((e, i) => {
    if (e) {
      const imageUrl = `http://localhost:3000/${e.profile_image?.url}`;
      const userUrl = `/user/${e.id}`;

      return (
        <div key={i}>
          {e.profile_image?.url && <img src={imageUrl} alt="user" />}
          <Link to={userUrl}>{e.name}</Link>
        </div>
      );
    }
  });

  return (
    <div>
      <h3>" {keyword} " の検索結果</h3>
      {tweetData.toString() !== [].toString() &&
        <h4>↓ツイート↓</h4>}
      <div>{searchedTweet}</div>
      {userData.toString() !== [].toString() &&
        <h4>↓ユーザー↓</h4>}
      <div>{searchedUser}</div>
    </div>
  );
};

export default SearchResult;