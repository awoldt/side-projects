import React from "react";
import mongoose from "mongoose";
import axios from "axios";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import dateFormat from "date-and-time";
import Head from "next/head";
import { useRouter } from "next/router";
import Sequels from "../../components/Sequels";
import Search from "../../components/Search";
import CastCard from "../../components/CastCard";
import MovieStats from "../../components/MovieStats";
import CommaNumber from "comma-number";
import RelatedMovies from "../../components/RelatedMovies";

const MovieDetailsPage = ({
  data,
  castData,
  meta_description,
  canonical_tag,
  related_movie_data,
}) => {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <div>
        <p>loading....</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {data.movie_title} ({data.movie_release_date.split("-")[0]}) | Bad
          Movies to Watch
        </title>
        <meta name="description" content={meta_description}></meta>
        <link rel="canonical" href={canonical_tag} />
        <meta
          property="og:url"
          content={"https://trashflixs.com/movies/" + data.movie_id}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={"Bad movie to watch - " + data.movie_title}
        />
        <meta
          property="og:description"
          content={
            data.movie_title +
            " is one of those movies so bad that it's funny to watch."
          }
        />
        <meta property="og:image" content={data.movie_poster} />
      </Head>

      <div
        style={{
          padding: "25px",
          backgroundColor: "white",
          marginTop: "25px",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{ marginTop: "10px", marginBottom: "10px", maxWidth: "400px" }}
        >
          <Search />
        </div>

        <br></br>
        <Row>
          <Col md={3}>
            <Image
              src={data.movie_poster}
              layout={"intrinsic"}
              width={650}
              height={650}
              alt={data.movie_title + " movie poster"}
            />
          </Col>
          <Col md={9}>
            <h1 style={{ display: "inline-block" }}>{data.movie_title} </h1>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                marginLeft: "5px",
              }}
            >
              ({data.movie_release_date.split("-")[0]})
            </span>
            <br></br>

            <div>
              <span>Tags: </span>
              <span
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: "5px",
                  borderRadius: "10px",
                }}
              >
                {data.movie_genre}
              </span>
            </div>

            <p style={{ marginTop: "15px" }}>{data.movie_description}</p>

            <Row className="mt-3">
              <Col lg="6">
                <MovieStats
                  release_date={data.movie_release_date_descriptive}
                  budget={data.movie_budget}
                  runtime={data.movie_runtime}
                  production_company={data.movie_production_company}
                />
              </Col>
              <Col lg="6">
                {data.movie_collection_details !== undefined && (
                  <Sequels c={data.movie_collection_details} />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <hr></hr>
        <CastCard data={castData} />
        <RelatedMovies related={related_movie_data} />
      </div>
    </>
  );
};

export default MovieDetailsPage;

const connectToMongo = async () => {
  try {
    //establish a connection to the database containing all the movies to be featured on the site
    await mongoose.connect(process.env.MONGODB_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch {
    console.log("Cannot connect to mongodb");
  }
};

connectToMongo(); //connects only once

export const getStaticProps = async (context) => {
  //gets all the data for each sequel movie component
  const getSequelData = async (ids) => {
    //array with all sequel data
    const x = await Promise.all(
      await ids.map(async (item) => {
        const res = await axios.get(
          "https://api.themoviedb.org/3/movie/" +
            item +
            "?api_key=" +
            process.env.TMDB_API_KEY +
            "&language=en-US"
        );
        //have to have specific names for moviecard component
        //dont need to add all elements, just the img is required
        res.data.movie_poster =
          "https://image.tmdb.org/t/p/original" + res.data.poster_path;
        res.data.movie_release_date = await res.data.release_date.split("-")[0];
        res.data.movie_genre = res.data.genres[0].name;
        res.data.movie_title = res.data.title;

        return res.data;
      })
    );

    return x;
  };

  //gets all cast data
  const getCastData = async () => {
    const movieID = context.params.movie_id;
    const res = await axios.get(
      "https://api.themoviedb.org/3/movie/" +
        movieID +
        "/credits?api_key=" +
        process.env.TMDB_API_KEY +
        "&language=en-US"
    );

    //if there are no cast memebers for this movie for some reason
    if (res.data.cast.length === 0) {
      //do nothing
    } else {
      res.data.cast.length = 3; //will only use the top 3 actors from movie to display
      var returnData = []; //array containing all the

      //loop through the cast memembers and create custom return data
      res.data.cast.map(async (item) => {
        var obj = {};
        obj.cast_id = item.id;
        obj.cast_name = item.name;
        //no profile picture
        if (item.profile_path !== null) {
          obj.cast_profile_picture =
            "https://image.tmdb.org/t/p/original" + item.profile_path;
        } else {
          obj.cast_profile_picture =
            "https://img.icons8.com/ios/50/000000/user-not-found.png";
        }
        obj.cast_character_played = item.character;

        await returnData.push(obj);
      });

      //need to store each cast member in a mongo document
      const castSchema = await new mongoose.Schema(
        {
          cast_id: String,
          movies: [String],
          cast_name: String,
          cast_profile_picture: String,
        },
        { collection: "movie_cast" }
      );
      const CastModel =
        (await mongoose.models.CastModel) ||
        (await mongoose.model("CastModel", castSchema));

      //check to see if cast member is already stored in database
      //if not add them
      await returnData.map(async (item) => {
        const castStored = await CastModel.find({ cast_id: item.cast_id });

        //cast member has not been stored yet
        if (castStored.length === 0) {
          const newCast = new CastModel({
            cast_id: item.cast_id,
            cast_name: item.cast_name,
            cast_profile_picture: item.cast_profile_picture,
          });

          await newCast.movies.push(movieID); //pushes the first movie cast member has been detected on, every other movie will be added with updateOne function below

          await newCast.save();
        }
        //already saved cast member
        else {
          //make sure current movieID is not already stored in cast members movies array
          const c = await CastModel.find({ cast_id: item.cast_id });

          //check to see if cast member already has current movie id stored in movies array
          const x = await c[0].movies.indexOf(movieID);
          //current movie id has not already been saved to cast members datbase
          if (x === -1) {
            await CastModel.updateOne(
              {
                cast_id: item.cast_id,
              },
              { $push: { movies: movieID } }
            );
          }
        }
      });

      return returnData;
    }
  };

  //generates meta description tag
  const generateMetaDescription = async (
    actors,
    production_company,
    movieTitle,
    movieGenre
  ) => {
    if (actors.length !== 0) {
      const data = await Promise.all(
        actors.map((item) => {
          return item.cast_name;
        })
      );

      return (
        movieTitle +
        " is a bad " +
        movieGenre +
        " movie produced by " +
        production_company +
        " starring - " +
        data.join(", ")
      );
    } else if (actors.length > 3) {
      actors.length = 3; //shorten meta description

      const data = await Promise.all(
        actors.map((item) => {
          return item.cast_name;
        })
      );

      return (
        movieTitle +
        " is a bad " +
        movieGenre +
        " movie produced by " +
        production_company +
        " starring - " +
        data.join(", ")
      );
    }
  };

  //grabs all the related movies of specific movie id
  //cannot contain movies of same franchise
  const getRelatedMovies = async (
    m_id,
    collection_ids,
    current_movie_genre,
    current_movie_id
  ) => {
    const url =
      "https://api.themoviedb.org/3/movie/" +
      m_id +
      "/recommendations?api_key=" +
      process.env.TMDB_API_KEY +
      "&language=en-US&page=1";
    const res = await axios.get(url);

    //CAN ONLY FEATURE MOVIES THAT ARE STORED IN MONGODB
    var currenlyStoredMovies = await FallbackModel.find();
    currenlyStoredMovies = await JSON.parse(
      JSON.stringify(currenlyStoredMovies)
    );

    var returnData = await Promise.all(
      res.data.results.map((item) => {
        //if movie id of related title is stored in mongodb
        if (currenlyStoredMovies[0].movie_ids.indexOf(String(item.id)) !== -1) {
          //make sure related movie suggestion is not in the franchise of current movie_id page
          //make sure movie has collection
          if (collection_ids !== undefined) {
            if (collection_ids.indexOf(item.id) === -1) {
              return item.id;
            }
          }
        }
      })
    );

    returnData = returnData.filter((x) => x !== undefined);

    returnData.length !== 0 ? null : (returnData = null); //returndata will be null if there is no matching related movies with movies returned from api and ids stored in mongo

    //go through all related movies and generate movie data and movie card
    if (returnData !== null) {
      const relatedMovieData = await Promise.all(
        returnData.map(async (item) => {
          var obj = {};

          const res = await axios.get(
            "https://api.themoviedb.org/3/movie/" +
              item +
              "?api_key=" +
              process.env.TMDB_API_KEY +
              "&language=en-US"
          );

          obj.movie_id = res.data.id;
          obj.movie_title = res.data.title;
          obj.movie_poster =
            "https://image.tmdb.org/t/p/original" + res.data.poster_path;

          return obj;
        })
      );

      return relatedMovieData;
    } else {
      //need to lowercase first letter of genre for it to find matches
      current_movie_genre =
        current_movie_genre[0].toLowerCase() + current_movie_genre.slice(1);

      const genreRelatedSearch = new mongoose.Schema(
        {},
        { collection: "movie_details" }
      );
      const SearchRelatedGenres =
        mongoose.models.SearchRelatedGenres ||
        mongoose.model("SearchRelatedGenres", genreRelatedSearch);

      var match = await SearchRelatedGenres.find({
        movie_genre: current_movie_genre,
      });

      match = await JSON.parse(JSON.stringify(match));

      //remove movie result if it is the same movie being displayed
      match = match.filter((x) => Number(x.movie_id) !== current_movie_id);

      //there are successful matches, there are other movies with the same genre
      if (match.length !== 0) {
        //no more than 4 matches
        if (match.length > 4) {
          match.length = 4;
        }

        return match;
      } else {
        return null;
      }
    }
  };

  //define a model to interact with database
  const fallbackSchema = new mongoose.Schema({}, { collection: "movies" });
  const FallbackModel =
    mongoose.models.FallbackModel ||
    mongoose.model("FallbackModel", fallbackSchema);
  var fallbackGenerate = await FallbackModel.find(); //grabs all movie ids, use TMDB api to gather information
  fallbackGenerate = await JSON.parse(JSON.stringify(fallbackGenerate));

  //requested id is not stored in movie ids array, send 404 page
  //do not do fallback
  if (fallbackGenerate[0].movie_ids.indexOf(context.params.movie_id) === -1) {
    return {
      notFound: true,
    };
    //id exists, generate page data
    //fallback is initiated if path does not exist, will generate page and send it
  } else {
    const movieID = context.params.movie_id;
    const canonicalTag = "https://trashflixs.com/movies/" + movieID;
    var returnData = {}; //important, all data sent back to component

    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/movie/" +
          movieID +
          "?api_key=" +
          process.env.TMDB_API_KEY +
          "&language=en-US"
      );
      returnData.movie_id = res.data.id;
      returnData.movie_title = res.data.title;
      returnData.movie_poster =
        "https://image.tmdb.org/t/p/original" + res.data.poster_path;
      returnData.movie_description = res.data.overview;
      returnData.movie_backdrop =
        "https://image.tmdb.org/t/p/original" + res.data.backdrop_path;
      returnData.movie_release_date = res.data.release_date;
      returnData.movie_runtime = res.data.runtime;
      returnData.movie_production_company =
        res.data.production_companies[0].name;

      //if movie has sequels
      if (res.data.belongs_to_collection !== null) {
        returnData.movie_collection = []; //will populate after map

        try {
          const sequelRes = await axios.get(
            "https://api.themoviedb.org/3/collection/" +
              res.data.belongs_to_collection.id +
              "?api_key=" +
              process.env.TMDB_API_KEY +
              "&language=en-US"
          );

          var storedSquels = await FallbackModel.find(); //movies id array
          storedSquels = await JSON.parse(JSON.stringify(storedSquels));
          storedSquels = await storedSquels[0].movie_ids;

          //go through movie id stored and see if they match tmdb collections data
          await sequelRes.data.parts.map(async (item) => {
            //make sure that movie sequel ids are stored in movies array
            //SOME SEQUELS ARE ACTUALLY GOOD, ONLY SHOW THE SHITTY ONES

            //this sequel is stored in database
            if (storedSquels.indexOf(String(item.id)) !== -1) {
              //make sure sequel is NOT the current movie being displayed
              if (String(item.id) !== movieID) {
                await returnData.movie_collection.push(item.id);
              }
            }
          });

          const sequelDetails = await getSequelData(
            returnData.movie_collection
          );
          returnData.movie_collection_details = sequelDetails;
        } catch {
          console.log("cannot fetch sequel data :(");
        }
      }

      //if movie has budget data
      if (res.data.budget !== null) {
        returnData.movie_budget = await CommaNumber(res.data.budget);
      }

      var d = await dateFormat.parse(res.data.release_date, "YYYY-MM-DD");
      d = await dateFormat.format(d, "ddd, MMM DD YYYY");
      returnData.movie_release_date_descriptive = d; // (tue, feb 23 2010... instead of 2010-02-27)

      returnData.movie_genre = res.data.genres[0].name; //first genre from tmdb is the most likely genre associated with title
    } catch {
      console.log("cannot fetch movie data for id " + movieID + ":(");
    }

    const cast = await getCastData();

    const metaDescription = await generateMetaDescription(
      cast,
      returnData.movie_production_company,
      returnData.movie_title,
      returnData.movie_genre
    );

    const related = await getRelatedMovies(
      movieID,
      returnData.movie_collection,
      returnData.movie_genre,
      returnData.movie_id
    );

    return {
      props: {
        data: returnData,
        castData: cast,
        meta_description: metaDescription,
        canonical_tag: canonicalTag,
        related_movie_data: related,
      },
      revalidate: 3600,
    };
  }
};

export const getStaticPaths = async () => {
  //define a model to interact with database
  const MovieSchema = new mongoose.Schema({}, { collection: "movies" });
  const M = mongoose.models.M || mongoose.model("M", MovieSchema);
  var movieIdsToGenerate = await M.find(); //grabs all movie ids, use TMDB api to gather information
  movieIdsToGenerate = await JSON.parse(JSON.stringify(movieIdsToGenerate));

  const paths = movieIdsToGenerate[0].movie_ids.map((item) => {
    return {
      params: { movie_id: String(item) },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};
