import { useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import { Button, Container, Drawer, Grid, Link, List, ListItem, makeStyles } from '@material-ui/core';
import DehazeIcon from '@material-ui/icons/Dehaze';

import { LoginStateContext } from 'App';
import { ModalStateContext } from 'App';
import { CurrentUserContext } from 'App';

import HomeContent from './homeContent';
import MyPage from 'user/myPage';
import UpdateUserSettings from 'user/updateUserSettings';
import TweetForm from 'tweet/tweetForm';
import UserRelationship from 'user/followings';
import TweetDetail from 'tweet/tweetDetail';
import MyFavorite from 'favorite/myFavorite';
import HashtagIndex from 'hashtag/hashtagIndex';
import HashtagDetail from 'hashtag/hashtagDetail';
import SearchForm from 'search/searchForm';

import SearchResult from 'search/searchResult';


const HomeHeader = () => {
  console.log("!!HomeHeader!!");
  const { setModalState } = useContext(ModalStateContext);
  const { setLoginState } = useContext(LoginStateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [drawerStatus, setDrawerStatus] = useState<boolean>(false);

  const useStyles = makeStyles({
    header: {
      backdropFilter: "blur(20px)",
      padding: "0 20px 0  20px",
      position: "fixed",
      top: 0
    },
    exception: {
      fontSize: "20px",
      textAlign: "center",
    }
  });
  const classes = useStyles();

  const handleLogoutClick = () => {
    const url = `http://localhost:3000/logout`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      console.log("ログアウト状況: ", res);
      setLoginState(false);
    }).catch(error => console.log("ログアウトエラー", error));
  }

  const clickDrawer = () => {
    setDrawerStatus(!drawerStatus);
  };

  return (
    <div className="header-banner">
      <Grid alignItems="center" className={classes.header} container
        direction="row" justifyContent="space-between">
        <Grid item>
          <Grid alignItems="center" container
            direction="row" justifyContent="flex-start" spacing={2}>
            <Grid item>
              <Link color="inherit" component={RouterLink} to="/" underline="none">
                <h2>Insyutagram</h2>
              </Link>
            </Grid>
            <Grid item>
              <Link color="inherit" component={RouterLink} to={`/user/${currentUser.id}`}>
                マイページ
              </Link>
            </Grid>
            <Grid item>
              <Link color="inherit" component={RouterLink} to="/tweet">
                ポスト
              </Link>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid alignItems="center" container
            direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item>
              <SearchForm />
            </Grid>
            <Grid item>
              <Button onClick={clickDrawer}>
                <DehazeIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={drawerStatus} onClose={clickDrawer}>
        <List onClick={clickDrawer}>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink} to={`/user/${currentUser.id}/favorite`} underline="none">
              マイいいね
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink} to={`/hashtag/index`} underline="none">
              タグ一覧
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink} to="/user/edit/account" underline="none">
              アカウント設定
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" href="/" onClick={() => handleLogoutClick()} underline="none">
              ログアウト
            </Link>
          </ListItem>
        </List>
      </Drawer>

      <Container>
        <Switch>
          <Route path="/" exact component={HomeContent} />
          <Route path="/user/:myPageId" exact component={MyPage} />
          <Route path="/tweet" exact component={TweetForm} />
          <Route path="/user/:userId/favorite" exact component={MyFavorite} />
          <Route path="/hashtag/index" exact component={HashtagIndex} />
          <Route path="/user/edit/account" exact component={UpdateUserSettings} />

          <Route path="/user/:myPageId/followings" exact component={UserRelationship} />
          <Route path="/user/:myPageId/followers" exact component={UserRelationship} />

          <Route path="/search/:searchWord" exact component={SearchResult} />
          <Route path="/tweets/:tweetId/detail" exact component={TweetDetail} />

          <Route path="/hashtag/:hashname" exact component={HashtagDetail} />
          <Route >
            <h3 className={classes.exception}>
              そのページはご利用いただけません。他のページを探してみましょう。
            </h3>
          </Route>
        </Switch>

        <button onClick={() => setModalState(true)}>モーダル</button>
      </Container>
    </div>
  );
}

export default HomeHeader;
