# Insyutagram(仮)
カクテルレシピやBARの情報を登録できる、お酒の情報が集まるSNSアプリです。
<br>
夜な夜な更新され続けるカクテルブック、BAR情報誌を目指しました。


## アプリケーションの概要
- ログイン機能、ポスト投稿、フォロー、いいね機能、検索機能などのSNSとしての基本的な機能
- ポストに紐づけられるハッシュタグに、カクテルレシピやBARの情報を登録しポストと共に情報を一元化

## URL
** 準備中 **

## 利用方法
** 準備中 **

## 開発の背景
成人済みの若年層がBARになかなか足を運べない状況に一石を投じたいという思いが出発点となります。
- メインターゲットである若年層に特に使ってもらいたい
- 情報の鮮度を保ちたい
- BARの情報をGoogleMapと連携させて少しでも身近なものにしたい
- カクテルブックの役割を担えるようにしたい
<br>
以上のようなことから今のようなアプリケーションの形にしました。

## 使用技術
- フロントエンド
  - HTML/CSS
  - JavaScript(TypeScript)
  - React:17.0.2
    - axios
    - Material-UI
- バックエンド
  - Ruby:2.6.6
  - Ruby on Rails:6.0.3
- データベース
  - MySQL:5.7
- インフラ・開発環境
  - Docker/docker-comopose
  - AWS(予定)
    - EC2
    - ECS
    - ECR
    - RDB
    - S3
  - CI/CDツール(予定)
- API
  - GoogleMapsAPI
- テストツール
  - jest
  - testing-library
  - RSpec

## 機能一覧
- アカウント登録、削除、設定変更
- ログイン、ログアウト、ゲストログイン
- ポスト投稿、画像投稿、画像プレビュー、ポスト削除、ハッシュタグ付与、最新ポスト一覧
- ハッシュタグ一覧、ハッシュタグに紐づかせたレシピ登録・GoogleMap登録
- いいね機能、いいね解除、マイいいね一覧
- ユーザーフォロー、フォロー解除、フォローフォロワー一覧
- 検索（ユーザー、ポスト、ハッシュタグ）

<br>

- Reactによる完全SPA
- レスポンシブデザイン対応

## インフラ設計図
** 準備中 **

## データベース設計図
** 準備中 **

## 今後の予定
- AWSへデプロイ
- SSL化
- 独自ドメイン取得
- CI/CDツールの導入
- アプリケーションの機能拡張
