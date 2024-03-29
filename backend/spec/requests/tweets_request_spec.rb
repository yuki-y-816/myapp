require 'rails_helper'

RSpec.describe "Tweets", type: :request do
  describe "tweets#create" do
    let(:user) { FactoryBot.create(:testuser) }

    before do
      user
      login_as_testuser
    end

    it "ツイート総数が増加する" do
      expect do
        post tweets_url, params: { tweet: {
          content: "test"
        }}
      end.to change(Tweet, :count).by(1)
    end

    context "ハッシュタグ付きの場合" do
      it "ハッシュタグ総数が増加する" do
        expect do
          post tweets_url, params: {
            tweet: {
              content: "test"
            },
            hashtag: "test_tag"
          }
        end.to change(Hashtag, :count).by(1)
      end
    end
  end

  describe "tweets#destroy" do
    let(:user) { FactoryBot.create(:testuser) }
    let(:admin) { FactoryBot.create(:administrator) }

    context "削除に成功" do
      context "自分のツイートを削除する場合" do
        before do
          @id = user.tweets.first.id
          login_as_testuser
        end

        it "ツイート総数が減少する" do
          expect{
            delete tweet_url(@id)
          }.to change{ Tweet.count }.by(-1)
        end

        it "JSONが返ってくる" do
          delete tweet_url(@id)
          json = JSON.parse(response.body)

          expect(json['message']).to eq "ツイート削除"
        end
      end

      context "adminユーザーが削除する場合" do
        before do
          admin
          user
          login_as_admin
          @id = user.tweets.first.id
        end

        it "ツイート総数が減少する" do
          expect{
            delete tweet_url(@id)
          }.to change{ Tweet.count }.by(-1)
        end

        it "JSONが返ってくる" do
          delete tweet_url(@id)
          json = JSON.parse(response.body)

          expect(json['message']).to eq "ツイート削除"
        end
      end
    end

    context "削除に失敗" do
      it "エラーメッセージが返ってくる" do
        user
        user2 = FactoryBot.create(:testuser2)
        login_as_testuser

        id = user2.tweets.first.id

        delete tweet_url(id)
        json = JSON.parse(response.body)

        expect(json['alert']).to eq "ツイートがありません"
      end
    end
  end

  describe "tweets#favorite" do
    before do
      FactoryBot.create(:favorite)
      id = Tweet.first
      get favorite_tweet_url(id)
      @user = User.find_by(name: "TEST_USER_2")
      @json = JSON.parse(response.body)
    end

    it "いいねしたユーザーの情報が返ってくる" do
      expect(@json['favorited_users'][0]).to include(
        "email" => @user.email,
        "name" => @user.name,
        "id" => @user.id
      )
    end

    it "いいね総数が返ってくる" do
      expect(@json['favorite_count']).to eq 1
    end
  end


  describe "tweets#index" do
    before do
      @user = FactoryBot.create(:testuser)
      login_as_testuser
      get tweets_url
      @json = JSON.parse(response.body)
    end

    it "15件分データが返ってくる" do
      expect(@json['hot_tweet_data'].length).to eq 15
    end

    it "ツイート情報が返ってくる" do
      expect(@json['hot_tweet_data'][0]).to include(
        "content" => @user.tweets.first.content,
        "id" => @user.tweets.first.id,
        "name" => @user.name,
        "user_id" => @user.id
      )
    end
  end


  describe "tweets#show" do
    before do
      @user = FactoryBot.create(:testuser)
      @tweet = Tweet.first
      login_as_testuser
      get tweet_url(@tweet.id)
      @json = JSON.parse(response.body)
    end

    it "ツイート詳細情報が返ってくる" do
      expect(@json['tweet'][0]).to include(
        "content" => @tweet.content,
        "id" => @tweet.id,
        "name" => @tweet.user.name,
        "user_id" => @tweet.user.id
      )
    end

    it "いいね総数が返ってくる" do
      expect(@json['favorite_count']).to eq @tweet.user_favorited.count
    end

    it "current_userがいいねをしているかの情報が返ってくる" do
      expect(@json['favorite_or_not']).to eq @tweet.favorited?(@user)
    end
  end
end
