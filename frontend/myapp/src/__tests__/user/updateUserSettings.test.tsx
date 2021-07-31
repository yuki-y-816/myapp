import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("アカウント設定ページの挙動", () => {
  const renderLoginSituation = async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: {
          id: 1,
          name: "テストユーザー",
          email: "email@email.com"
        }
      });
    //HomeContent用
    mock.onGet("http://localhost:3000")
      .reply(200, { home_data: [{}] });
    // アカウント設定変更用
    mock.onPatch("http://localhost:3000/users/1")
      .reply(200, {
        user: {
          id: 1,
          name: "テストユーザー改",
          email: "another@email.com"
        }
      });
    // アカウント削除
    mock.onDelete("http://localhost:3000/users/1").reply(200);
    // マイページ表示
    mock.onGet("http://localhost:3000/users/1")
      .reply(200, {
        user: {
          id: 1,
          name: "テストユーザー改",
        },
        mypage_data: [{}],
        followings: [{}],
        followings_count: 100,
        followers: [{}],
        followers_count: 50
      });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })

    await screen.findAllByText("マイページ");
    const dehazeIcon = screen.getByTestId("dehaze-icon");
    act(() => { userEvent.click(dehazeIcon) });

    const settingLink = await screen.findByRole("link", { name: "アカウント設定" });
    act(() => { userEvent.click(settingLink) });
  };

  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(screen.getByText("ユーザーアカウント設定")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("テストユーザー")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("新しいパスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "アカウント削除" })).toBeInTheDocument();
  });

  it("パスワードに入力をすると確認用フォームが表示される", async () => {
    await renderLoginSituation();
    const target = screen.getByPlaceholderText("新しいパスワード");
    act(() => { userEvent.type(target, "something@email.com") });

    expect(await screen.findByPlaceholderText("パスワードをもう一度入力してください")).toBeInTheDocument();
  });

  it("'アカウント削除'ボタンを押すと警告ダイアログが表示される", async () => {
    await renderLoginSituation();
    const target = screen.getByRole("button", { name: "アカウント削除" });
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("本当にアカウントを削除しますか？"));
    expect(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.getByRole("button", { name: "削除する" }));
  });

  it("編集に成功するとフラッシュメッセージが表示されマイページに遷移する", async () => {
    await renderLoginSituation();
    const nameInputArea = screen.getByPlaceholderText("テストユーザー");
    const emailInputArea = screen.getByPlaceholderText("email@email.com");
    const editButton = screen.getByRole("button", { name: "編集" });

    await act(async () => {
      userEvent.type(nameInputArea, "テストユーザー改");
      userEvent.type(emailInputArea, "another@email.com");
    });
    act(() => { userEvent.click(editButton) });

    expect(await screen.findByText("テストユーザー改"));
    expect(screen.getByText("100"));
    expect(screen.getByText("50"));
    expect(screen.getByText("アカウント設定を変更しました"));
  });
});
