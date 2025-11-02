// src/lib/spotify.js
export async function getSpotifyToken() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function searchTrack(query, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!data.tracks.items.length) return null;

  const track = data.tracks.items[0];
  return {
    title: track.name,
    artist: track.artists[0].name,
    albumCover: track.album.images[0].url,
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
  };
}
