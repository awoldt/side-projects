/* eslint-disable @typescript-eslint/no-explicit-any */
import { Playlist, SpotifyTokenDetails } from "./types";

export async function DeletePlaylist(
  playlistID: string,
  userAccessToken: SpotifyTokenDetails,
  userID: number,
  setPlaylistData: React.Dispatch<React.SetStateAction<Playlist[] | null>>
) {
  try {
    const req = await fetch(`/api/delete_playlist`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playlistID,
        userAccessToken,
        userID,
      }),
    });
    if (!req.ok) {
      alert("Error while deleting playlist");
      return;
    }

    setPlaylistData((prev) => {
      if (prev === null || prev === undefined) return prev;

      const data = [...prev];
      const index = data.findIndex((x) => x.spotify_playlist_id === playlistID);

      if (index !== -1) {
        data.splice(index, 1);
        return data;
      }

      return prev;
    });
  } catch (error) {
    alert("error while deleting playlist");
  }
}

export async function CreatePlaylist(
  playlistTitle: string,
  genres: string[],
  spotifyUserID: string,
  userID: number,
  spotifyTokenDetails: SpotifyTokenDetails,
  refreshFrequency: number,
  numOfSongs: number,
  setPlaylistData: React.Dispatch<React.SetStateAction<Playlist[] | null>>,
  setShowCreatePlaylistModal: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    const req = await fetch("/api/create_playlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        genres,
        spotifyUserID,
        userID,
        spotifyTokenDetails,
        playlistTitle,
        refreshFrequency,
        numOfSongs,
      }),
    });
    const res = await req.json();

    if (req.ok) {
      setPlaylistData((prev) => {
        if (prev === null) return prev;
        return [...prev, res.data];
      });

      setShowCreatePlaylistModal(false);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function UpdatePlaylist(
  title: string,
  genres: string[],
  numOfSongs: number,
  userTokenDetails: SpotifyTokenDetails,
  userID: number,
  spotifyPlaylistID: string,
  playlistID: number,
  setPlaylistData: React.Dispatch<React.SetStateAction<Playlist[] | null>>,
  setPlaylistBeingEdited: React.Dispatch<React.SetStateAction<Playlist | null>>
) {
  try {
    const req = await fetch("/api/update_playlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        genres,
        numOfSongs,
        userTokenDetails,
        userID,
        spotifyPlaylistID,
        playlistID,
      }),
    });
    if (!req.ok) {
      alert("Error while updating playlist");
    } else {
      // update the playlist with new details
      setPlaylistData((prev) => {
        if (prev === null) return prev;

        return prev.map((playlist) => {
          if (playlist.id === playlistID) {
            return { ...playlist, name: title };
          }
          return playlist;
        });
      });
      setPlaylistBeingEdited(null);
    }
  } catch (error) {
    console.log(error);
  }
}

export function GetRefreshHoursString(nextRefreshAtUTC: string) {
  const now = new Date();
  const timezoneOffsetMinutes = now.getTimezoneOffset();
  const nowUTC = new Date(now.getTime() + timezoneOffsetMinutes * 60 * 1000);

  const nextRefreshUTC = new Date(nextRefreshAtUTC);
  const differenceMs = nextRefreshUTC.getTime() - nowUTC.getTime();
  const differenceHours = differenceMs / (1000 * 60 * 60);
  const differenceDays = Math.round(differenceHours / 24);

  if (differenceHours >= 24) {
    return differenceDays === 1
      ? `This playlist will refresh in about 1 day`
      : `This playlist will refresh in about ${differenceDays} days`;
  }

  const resfreshRounded = Math.round(differenceHours);

  if (resfreshRounded === 0) {
    return "This playlist will refresh very soon. Check back later!";
  } else if (resfreshRounded === 1) {
    return "This playlist will update in about an hour";
  }

  return `This playlist will refresh in approx ${resfreshRounded} hours`;
}

export const genres = [
  { name: "Acoustic", value: "acoustic" },
  { name: "Afrobeat", value: "afrobeat" },
  { name: "Alt Rock", value: "alt-rock" },
  { name: "Alternative", value: "alternative" },
  { name: "Ambient", value: "ambient" },
  { name: "Anime", value: "anime" },
  { name: "Black Metal", value: "black-metal" },
  { name: "Bluegrass", value: "bluegrass" },
  { name: "Blues", value: "blues" },
  { name: "Bossa Nova", value: "bossanova" },
  { name: "Brazil", value: "brazil" },
  { name: "Breakbeat", value: "breakbeat" },
  { name: "British", value: "british" },
  { name: "Cantopop", value: "cantopop" },
  { name: "Chicago House", value: "chicago-house" },
  { name: "Children", value: "children" },
  { name: "Chill", value: "chill" },
  { name: "Classical", value: "classical" },
  { name: "Club", value: "club" },
  { name: "Comedy", value: "comedy" },
  { name: "Country", value: "country" },
  { name: "Dance", value: "dance" },
  { name: "Dancehall", value: "dancehall" },
  { name: "Death Metal", value: "death-metal" },
  { name: "Deep House", value: "deep-house" },
  { name: "Detroit Techno", value: "detroit-techno" },
  { name: "Disco", value: "disco" },
  { name: "Disney", value: "disney" },
  { name: "Drum And Bass", value: "drum-and-bass" },
  { name: "Dub", value: "dub" },
  { name: "Dubstep", value: "dubstep" },
  { name: "EDM", value: "edm" },
  { name: "Electro", value: "electro" },
  { name: "Electronic", value: "electronic" },
  { name: "Emo", value: "emo" },
  { name: "Folk", value: "folk" },
  { name: "Forro", value: "forro" },
  { name: "French", value: "french" },
  { name: "Funk", value: "funk" },
  { name: "Garage", value: "garage" },
  { name: "German", value: "german" },
  { name: "Gospel", value: "gospel" },
  { name: "Goth", value: "goth" },
  { name: "Grindcore", value: "grindcore" },
  { name: "Groove", value: "groove" },
  { name: "Grunge", value: "grunge" },
  { name: "Guitar", value: "guitar" },
  { name: "Happy", value: "happy" },
  { name: "Hard Rock", value: "hard-rock" },
  { name: "Hardcore", value: "hardcore" },
  { name: "Hardstyle", value: "hardstyle" },
  { name: "Heavy Metal", value: "heavy-metal" },
  { name: "Hip-Hop", value: "hip-hop" },
  { name: "Holidays", value: "holidays" },
  { name: "Honky-Tonk", value: "honky-tonk" },
  { name: "House", value: "house" },
  { name: "IDM", value: "idm" },
  { name: "Indian", value: "indian" },
  { name: "Indie", value: "indie" },
  { name: "Indie Pop", value: "indie-pop" },
  { name: "Industrial", value: "industrial" },
  { name: "Iranian", value: "iranian" },
  { name: "J Dance", value: "j-dance" },
  { name: "J Idol", value: "j-idol" },
  { name: "J Pop", value: "j-pop" },
  { name: "J Rock", value: "j-rock" },
  { name: "Jazz", value: "jazz" },
  { name: "K Pop", value: "k-pop" },
  { name: "Kids", value: "kids" },
  { name: "Latin", value: "latin" },
  { name: "Latino", value: "latino" },
  { name: "Malay", value: "malay" },
  { name: "Mandopop", value: "mandopop" },
  { name: "Metal", value: "metal" },
  { name: "Metal Misc", value: "metal-misc" },
  { name: "Metalcore", value: "metalcore" },
  { name: "Minimal Techno", value: "minimal-techno" },
  { name: "Movies", value: "movies" },
  { name: "MPB", value: "mpb" },
  { name: "New Age", value: "new-age" },
  { name: "New Release", value: "new-release" },
  { name: "Opera", value: "opera" },
  { name: "Pagode", value: "pagode" },
  { name: "Party", value: "party" },
  { name: "Philippines OPM", value: "philippines-opm" },
  { name: "Piano", value: "piano" },
  { name: "Pop", value: "pop" },
  { name: "Pop Film", value: "pop-film" },
  { name: "Post Dubstep", value: "post-dubstep" },
  { name: "Power Pop", value: "power-pop" },
  { name: "Progressive House", value: "progressive-house" },
  { name: "Psych Rock", value: "psych-rock" },
  { name: "Punk", value: "punk" },
  { name: "Punk Rock", value: "punk-rock" },
  { name: "R N B", value: "r-n-b" },
  { name: "Rainy Day", value: "rainy-day" },
  { name: "Reggae", value: "reggae" },
  { name: "Reggaeton", value: "reggaeton" },
  { name: "Road Trip", value: "road-trip" },
  { name: "Rock", value: "rock" },
  { name: "Rock N Roll", value: "rock-n-roll" },
  { name: "Rockabilly", value: "rockabilly" },
  { name: "Romance", value: "romance" },
  { name: "Sad", value: "sad" },
  { name: "Salsa", value: "salsa" },
  { name: "Samba", value: "samba" },
  { name: "Sertanejo", value: "sertanejo" },
  { name: "Show Tunes", value: "show-tunes" },
  { name: "Singer Songwriter", value: "singer-songwriter" },
  { name: "Ska", value: "ska" },
  { name: "Sleep", value: "sleep" },
  { name: "Songwriter", value: "songwriter" },
  { name: "Soul", value: "soul" },
  { name: "Soundtracks", value: "soundtracks" },
  { name: "Spanish", value: "spanish" },
  { name: "Study", value: "study" },
  { name: "Summer", value: "summer" },
  { name: "Swedish", value: "swedish" },
  { name: "Synth Pop", value: "synth-pop" },
  { name: "Tango", value: "tango" },
  { name: "Techno", value: "techno" },
  { name: "Trance", value: "trance" },
  { name: "Trip Hop", value: "trip-hop" },
  { name: "Turkish", value: "turkish" },
  { name: "Work Out", value: "work-out" },
  { name: "World Music", value: "world-music" },
];
