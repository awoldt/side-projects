// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import mongoose from "mongoose";
import axios from "axios";

var addedMovies;

const searchQuery = async (user_query) => {
  //establish a connection to the database containing all the movies to be featured on the site
  await mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  //define a model to interact with database
  //addedmovies are all the movies currenly stored in trashflix databases
  //when user searches for movies, only THESE select movies can pop up in search results
  const MovieSchema = new mongoose.Schema({}, { collection: "movies" });
  const M = mongoose.models.M || mongoose.model("M", MovieSchema);
  addedMovies = await M.find();
  addedMovies = await JSON.parse(JSON.stringify(addedMovies));

  var tmdbQueryUrl =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    process.env.TMDB_API_KEY +
    "&language=en-US&page=1&query=" +
    user_query;

  try {
    const res = await axios.get(tmdbQueryUrl);

    var all = await Promise.all(
      res.data.results.map(async (item) => {
        var s = await addedMovies[0].movie_ids.indexOf(String(item.id));
        if (s === -1) {
          //do nothing
        } else {
          return {
            id: item.id,
            title: item.title,
            poster: "https://image.tmdb.org/t/p/original" + item.poster_path,
          };
        }
      })
    );
    all = await all.filter((x) => x !== undefined);

    return all;
  } catch {
    console.log("error trying to get tmdb api search results");
  }
};

export default async function handler(req, res) {
  var searchResults = await searchQuery(req.query.genre);

  res.status(200).json({ data: searchResults });
}
