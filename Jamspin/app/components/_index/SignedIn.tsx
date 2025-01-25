import { useOutletContext } from "@remix-run/react";
import { RefreshCw, Trash2, Pencil } from "lucide-react";
import CreatePlaylistModal from "../CreatePlaylistModal";
import { DeletePlaylist, GetRefreshHoursString } from "~/utils";
import { AppContext } from "~/types";
import EditPlaylistModal from "../EditPlaylistModal";

export default function PlaylistLayout() {
  const context = useOutletContext<AppContext>();

  return (
    <>
      {context.playlistData === null && (
        <p>There was an error while getting playlist data</p>
      )}
      {context.playlistData && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            You have {context.playlistData.length} JamSpin{" "}
            {context.playlistData.length === 1 ? <>playlist</> : <>playlists</>}
          </h1>
          <div className="flex flex-wrap">
            {context.playlistData.map((playlist, i) => (
              <div
                key={i}
                className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg mt-5 shadow-2xl"
              >
                <img
                  src={playlist.image}
                  alt={playlist.name + " playlist cover"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {playlist.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Created on {new Date(playlist.created_at).toDateString()}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mb-4">
                    <RefreshCw size={16} className="mr-2" />
                    <span>
                      {GetRefreshHoursString(playlist.next_refresh_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={`https://open.spotify.com/playlist/${playlist.spotify_playlist_id}`}
                    >
                      <button className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-full transition-colors duration-300">
                        View on Spotify
                      </button>
                    </a>

                    <button>
                      <Pencil
                        onClick={() => {
                          if (context.playlistData) {
                            context.setPlaylistBeingEdited(
                              context.playlistData[i]
                            );
                          }
                        }}
                      />
                    </button>

                    <button className="text-red-500 hover:text-red-600 transition-colors duration-300">
                      <Trash2
                        size={20}
                        onClick={async () => {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this playlist? This action cannot be undone."
                          );
                          if (confirm) {
                            await DeletePlaylist(
                              playlist.spotify_playlist_id,
                              {
                                accessToken:
                                  context.userDetails!.spotify_access_token,
                                refreshToken:
                                  context.userDetails!.spotify_refresh_token,
                                expiresAt:
                                  context.userDetails!
                                    .spotify_access_token_expires_at_ms,
                              },
                              context.userDetails!.id,
                              context.setPlaylistData
                            );
                          }
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {context.showCreatePlaylistModal && <CreatePlaylistModal />}
          {context.playlistBeingEdited !== null && <EditPlaylistModal />}
          <div className="flex flex-row justify-center items-center space-x-4 mt-20">
            <button
              onClick={() => {
                context.setShowCreatePlaylistModal(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full transition-colors duration-300"
            >
              Create New Playlist
            </button>
            <button
              onClick={() => {
                document.cookie =
                  "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                location.reload();
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full transition-colors duration-300"
            >
              Sign out
            </button>
          </div>

          {context.playlistData.length > 0 && (
            <p className="text-white flex items-center justify-center text-center mt-14">
              All playlist data gathered from
              <svg
                style={{ marginLeft: "5px" }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 496 512"
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.5 372.4c-4.2 0-7.9-1.3-11.3-3.8-61.3-41-153.7-50.2-228.5-28.1-10.1 3-21.2-2.6-24.1-12.8-3-10.1 2.6-21.2 12.8-24.1 85.3-25.6 188.3-15.2 257.9 32.8 9.2 6.1 11.8 18.6 5.7 27.8-3.9 5.8-10.3 8.2-16.5 8.2zm31.1-71.9c-4.8 0-9.5-1.5-13.6-4.6-69.7-47.3-175.4-61.1-257.1-34.2-11.1 3.7-23.1-2.3-26.8-13.4-3.7-11.1 2.3-23.1 13.4-26.8 93.9-31.4 209.4-15.8 288.1 39.1 10 6.8 12.7 20.4 5.9 30.4-4.1 5.8-10.6 9.5-17.3 9.5zm32-73.3c-5.4 0-10.7-1.7-15.3-5.1-79.4-54-218.1-58.7-303.7-32.8-13 4-26.8-3.3-30.8-16.3-4-13 3.3-26.8 16.3-30.8 98.5-30.4 251.2-24.2 342.4 39.1 11.5 7.8 14.5 23.4 6.7 34.9-4.9 7.2-12.9 10.9-20.6 10.9z" />
              </svg>
            </p>
          )}
        </div>
      )}
    </>
  );
}
