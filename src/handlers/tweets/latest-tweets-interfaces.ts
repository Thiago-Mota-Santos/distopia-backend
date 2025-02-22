interface LatestTweet {
  id: string;
  blockquote: string;
  created_date: string;
}

interface TwitterApiResponse {
  data: TwitterApiData[];
  meta: {
    next_token: string;
    result_count: number;
    newest_id: string;
    oldest_id: string;
  };
}

interface TwitterApiData {
  text: string;
  id: string;
  created_at: string;
  edit_history_tweet_ids: string[];
}
