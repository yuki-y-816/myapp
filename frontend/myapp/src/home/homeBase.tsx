import { useContext } from 'react';

import { LoginStateContext } from 'App';

import HomeHeader from 'home/homeHeader'
import NotLoginHomeHeader from './notLoginHomeHeader';

const HomeBase = () => {
  const { loginState } = useContext(LoginStateContext);

  return (
    <>
      {loginState && <HomeHeader />}
      {!loginState && <NotLoginHomeHeader />}
    </>
  );
  /*
    if (loginState === true) {
      return (
        <>
          <HomeHeader />
        </>
      );
    } else {
      return (
        <>
          <NotLoginHomeHeader />
        </>
      );
    }
    */
}

export default HomeBase;
