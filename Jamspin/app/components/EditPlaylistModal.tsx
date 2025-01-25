/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { genres, UpdatePlaylist } from "~/utils";
import { useOutletContext } from "@remix-run/react";
import { AppContext } from "~/types";

export default function EditPlaylistModal() {
  const context = useOutletContext<AppContext>();

  const [playlistTitle, setPlaylistTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [numOfSongs, setNumOfSongs] = useState(25);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context.playlistBeingEdited) {
      setPlaylistTitle(context.playlistBeingEdited.name);
      setSelectedGenres(context.playlistBeingEdited.genres);
      setNumOfSongs(context.playlistBeingEdited.num_of_songs);
    }
  }, [context.playlistBeingEdited]);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedGenres.includes(selectedValue)) return;

    if (selectedGenres.length < 5) {
      setSelectedGenres([...selectedGenres, selectedValue]);
    }
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres((prevGenres) => prevGenres.filter((g) => g !== genre));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistTitle.trim() === "") return;

    setLoading(true);

    if (context.userDetails && context.playlistBeingEdited) {
      await UpdatePlaylist(
        playlistTitle,
        selectedGenres,
        numOfSongs,
        {
          accessToken: context.userDetails.spotify_access_token,
          refreshToken: context.userDetails.spotify_refresh_token,
          expiresAt: context.userDetails.spotify_access_token_expires_at_ms,
        },
        context.userDetails.id,
        context.playlistBeingEdited.spotify_playlist_id,
        context.playlistBeingEdited.id,
        context.setPlaylistData,
        context.setPlaylistBeingEdited
      );
    }

    setLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-start`}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
        <div className="p-6">
          <img
            className="w-[250px] mx-auto mb-5 rounded"
            src={context.playlistBeingEdited!.image}
            alt={context.playlistBeingEdited!.name + " playlist cover"}
          />
          <form onSubmit={handleSubmit}>
            {/* Playlist Title */}
            <div className="mb-4">
              <label
                htmlFor="playlistTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Playlist Title
              </label>
              <input
                type="text"
                id="playlistTitle"
                value={playlistTitle}
                onChange={(e) => setPlaylistTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter playlist title"
                required
                disabled={loading}
              />
            </div>

            {/* Genre Selection */}
            <div className="mb-4">
              <label
                htmlFor="genres"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Genres (up to 5)
              </label>
              <select
                id="genres"
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleGenreChange}
                disabled={loading || selectedGenres.length >= 5}
              >
                {genres.map((x, i) => (
                  <option key={i} value={x.value}>
                    {x.name}
                  </option>
                ))}
              </select>
              {/* Display selected genres */}
              <div className="mt-3 flex flex-wrap">
                {selectedGenres.map((genre, i) => (
                  <span
                    key={i}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer"
                    onClick={() => removeGenre(genre)}
                  >
                    {genres.find((g) => g.value === genre)?.name} &times;
                  </span>
                ))}
              </div>
            </div>

            {/* Number of Songs */}
            <div className="mb-6">
              <label
                htmlFor="numOfSongs"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                # of Songs
              </label>
              <select
                id="numOfSongs"
                value={numOfSongs}
                onChange={(e) => setNumOfSongs(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                The number of songs that will be added to playlist
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => context.setPlaylistBeingEdited(null)}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Playlist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
