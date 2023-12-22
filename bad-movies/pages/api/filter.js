import mongoose from "mongoose";

const searchFilter = async (query) => {
  //establish a connection to the database containing all the movies to be featured on the site
  await mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  //define a model to interact with database
  const filterSchema = new mongoose.Schema({}, { collection: "movie_details" });
  const Filtered =
    mongoose.models.Filtered || mongoose.model("Filtered", filterSchema);

  var addedMovies = await Filtered.find({ movie_genre: query });

  return addedMovies;
};

export default async function handler(req, res) {
  const genre_query = req.body.genre;

  const filteredMovies = await searchFilter(genre_query);

  res.status(200).json({ data: filteredMovies });
}
