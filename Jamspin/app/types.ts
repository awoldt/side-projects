export interface DB_User {
  id: number;
  created_at: string;
  spotify_account_id: string;
  spotify_access_token: string;
  spotify_refresh_token: string;
  spotify_access_token_expires_at_ms: number;
}

export interface DB_Playlist {
  id: number;
  created_at: string;
  next_refresh_at: string;
  spotify_playlist_id: string;
  refresh_frequency_hrs: number;
  last_refresh_at: string | null;
  num_of_songs: number;
  genres: string[];
}

export interface Playlist extends DB_Playlist {
  image: string;
  name: string;
  description: string;
}

export interface UserWithPlaylists extends DB_User {
  playlists: Playlist[];
}

export interface SpotifyTokenDetails {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// context that wraps the entire app
export interface AppContext extends IndexPageData {
  showCreatePlaylistModal: boolean;
  playlistBeingEdited: Playlist | null;
  setPlaylistBeingEdited: React.Dispatch<React.SetStateAction<Playlist | null>>;
  setPlaylistData: React.Dispatch<React.SetStateAction<Playlist[] | null>>;
  setShowCreatePlaylistModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IndexPageData {
  userDetails: DB_User | null;
  playlistData: Playlist[] | null;
  spotifyClientID: string | null;
  spotifyRedirectURI: string | null;
}
