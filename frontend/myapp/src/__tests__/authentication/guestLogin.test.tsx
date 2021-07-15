import axios from "axios";
import { Router } from "react-router-dom";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("ゲストログイン機能の挙動", () => {
  it("ログインボタンを押すとログイン状態になりHomeHeaderに切り替わる", async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    //ログインボタンを押したとき
    mock.onGet("http://localhost:3000/guest")
      .reply(200);
    //"checkLoginStatus"from"App"でのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      })
    //HomeContent用
    mock.onGet("http://localhost:3000").reply(200);

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });

    userEvent.click(screen.getByRole("link", { name: "アカウント登録" })); //アカウント登録画面に移動

    const button = screen.getByRole("button", { name: "ゲストログイン" });
    userEvent.click(button);

    // <Link>を踏むわけではないのでテスト上は空のコンテンツのURLを踏むことになる
    expect(await screen.findByText("そのページはご利用いただけません。他のページを探してみましょう。")).toBeInTheDocument();
  });
});
