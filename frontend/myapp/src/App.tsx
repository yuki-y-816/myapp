import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import { UserType } from 'types/typeList';

import ModalField from 'common/modalField';
import HomeBase from 'home/homeBase';

// モーダルを共有するためのコンテクスト
export const ModalStateContext = createContext({} as {
  modalState: boolean,
  setModalState: any
});

// ログイン状態を共有
export const LoginStateContext = createContext({} as {
  loginState: boolean,
  setLoginState: any
});

export const CurrentUserContext = createContext({} as {
  currentUser: Partial<UserType>,
  //currentUser: Partial<currentUserType>,
  setCurrentUser: any
});

// 対象のユーザーの情報を共有
export const UserContext = createContext({} as {
  user: Partial<UserType>,
  //user: Partial<currentUserType>,
  setUser: any
});

// 対象ユーザーのフォロー状況を共有
export const FollowOrNotContext = createContext({} as {
  followOrNot: boolean,
  setFollowOrNot: any
});


// 格納したメッセージを共有
export const MessageContext = createContext({} as {
  message: string[],
  setMessage: any
});

const App = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserType | {}>({});
  const [message, setMessage] = useState<string[]>([]);

  const [user, setUser] = useState<Partial<UserType>>({});
  const [followOrNot, setFollowOrNot] = useState<boolean>(false);

  useEffect(() => {
    if (loginState === false) {
      checkLoginStatus();
    }
  }, [loginState]);

  const checkLoginStatus = () => {
    axios.get("http://localhost:3000/check_login", { withCredentials: true }).then(response => {
      if (response.data.logged_in === true) {
        setLoginState(true);
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser({});
      }
    }).catch(response => {
      console.log("ログインエラー", response);
    })
  }
  console.log(loginState);
  return (
    <>
      <Router>
        <LoginStateContext.Provider value={{ loginState, setLoginState }}>
          <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <UserContext.Provider value={{ user, setUser }}>
              <FollowOrNotContext.Provider value={{ followOrNot, setFollowOrNot }}>
                <ModalStateContext.Provider value={{ modalState, setModalState }}>
                  <MessageContext.Provider value={{ message, setMessage }}>
                    <HomeBase />
                    <ModalField />
                  </MessageContext.Provider>
                </ModalStateContext.Provider>
              </FollowOrNotContext.Provider>
            </UserContext.Provider>
          </CurrentUserContext.Provider>
        </LoginStateContext.Provider>
      </Router>
    </>
  );

}

export default App;
