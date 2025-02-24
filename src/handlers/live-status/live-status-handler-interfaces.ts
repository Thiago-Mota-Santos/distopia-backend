interface TwitchBearerToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TwitchHelixStream {
  data: Object[];
  pagination: Object;
}

interface LiveStatusCacheTable {
  key: 'LiveStatus' | 'BearerToken';
  expiresAt: string;
  value: TwitchBearerToken | boolean;
}
