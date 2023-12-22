import React from "react";
import mongoose from "mongoose";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import Search from "../../components/Search";
import Head from "next/head";
import { useState } from "react";
import MovieCard from "../../components/MovieCard";
import arrayShuffle from "shuffle-array";

const Index = ({ num_of_movies_stored, movie_pages }) => {
  const [displayedMovies, setDisplayedMovies] = useState(movie_pages[0]); //will store an array of all the movies currenly being displayed to user, all in bootstrap row/col setup, defaults to movie data brought back from staticgeneration
  const [pageDisplay, setPageDisplay] = useState(movie_pages);

  const [loadingDisplayedMovies, setLoadingDisplayedMovies] = useState(false); //when use clicks on genre filter, loading will appear until movies pop up
  const [filteredMovies, setFilteredMovies] = useState(null);
  const [genreFilterStats, setGenreFilterStats] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filterMovies = async (type, value) => {
    const fetchGenre = async (x) => {
      const res = await axios.post("/api/filter", {
        genre: x,
      });
      const movie_data = await JSON.parse(JSON.stringify(res));

      setLoadingDisplayedMovies(false);
      setFilteredMovies(movie_data.data.data);
      setGenreFilterStats(movie_data.data.data.length);
    };

    switch (type) {
      case "genre":
        setSelectedGenre(value);
        await fetchGenre(value);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Discover Bad Movies to Watch</title>
        <meta
          name="description"
          content="Discover movies so bad they&#39;re good. Filter movies by genre and use custom search to find just the movie your looking for. Only the worst of movies are featured."
        />
        <link rel="canonical" href="https://trashflixs.com/discover" />
        <meta property="og:url" content="https://trashflixs.com/discover" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Discover some of the worst movies ever made"
        />
        <meta
          property="og:description"
          content="Trashflixs is the go-to-place to easily find bad movies that we all love to watch. Filter movies by genre and use custom search to find just the title you&#39;re looking for."
        />
        <meta
          property="og:image"
          content="https://trashflixs.com/discover-og-img.webp"
        />
      </Head>

      <div>
        <div
          style={{ marginTop: "10px", marginBottom: "10px", maxWidth: "400px" }}
        >
          <Search />
        </div>

        <h1>Discover over {num_of_movies_stored} bad movies to watch</h1>

        <p>Choose a filter: </p>
        <div style={{ marginBottom: "10px" }}>
          <select
            name="genre"
            onChange={(e) => {
              if (e.target.value !== "null") {
                filterMovies("genre", e.target.value);
                setDisplayedMovies([]);
                setLoadingDisplayedMovies(true);
                setPageDisplay(false);
              } else {
                setFilteredMovies(null);
                setGenreFilterStats(null);
                setDisplayedMovies(movie_pages[0]);
                setPageDisplay(movie_pages);
              }
            }}
          >
            <option value="null" defaultValue>
              Genre
            </option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="animation">Animation</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="drama">Drama</option>
            <option value="family">Family</option>
            <option value="fantasy">Fantasy</option>
            <option value="horror">Horror</option>
            <option value="science fiction">Science Fiction</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
          </select>
        </div>

        <Row
          style={{
            backgroundColor: "white",
            padding: "25px",
            marginBottom: "25px",
          }}
          className="text-center"
        >
          {genreFilterStats !== null && (
            <p className="text-start">
              Showing {filteredMovies.length} results for {selectedGenre} movies
            </p>
          )}
          {loadingDisplayedMovies && (
            <Spinner animation="border" role="status" variant="primary" />
          )}
          {displayedMovies.map((item) => {
            return (
              <Col
                lg={2}
                md={3}
                sm={6}
                key={item.movie_id}
                style={{ marginBottom: "10px" }}
              >
                <a
                  style={{ textDecoration: "none", color: "black" }}
                  href={"/movies/" + item.movie_id}
                >
                  <MovieCard
                    imgSrc={item.movie_poster}
                    imgSize={200}
                    imgLayout={"intrinsic"}
                    altTxt={item.movie_title + " movie poster"}
                  />
                  <h4>{item.movie_title}</h4>
                  <span style={{ color: "grey" }}>
                    {item.movie_genre} {item.movie_release_date.split("-")[0]}
                  </span>
                </a>
              </Col>
            );
          })}

          {filteredMovies !== null &&
            filteredMovies.map((item) => {
              return (
                <Col lg={2} md={3} sm={6} key={item.movie_id}>
                  <a
                    style={{ textDecoration: "none", color: "black" }}
                    href={"/movies/" + item.movie_id}
                  >
                    <MovieCard
                      imgSrc={item.movie_poster}
                      imgSize={200}
                      imgLayout={"intrinsic"}
                      altTxt={item.movie_title + " movie poster"}
                    />
                    <h5>{item.movie_title}</h5>
                  </a>
                </Col>
              );
            })}
          <div style={{ marginTop: "15px" }}>
            {pageDisplay !== false && (
              <p style={{ display: "inline-block", marginRight: "8px" }}>
                Page{" "}
              </p>
            )}
            {pageDisplay &&
              pageDisplay.map((item, index) => {
                return (
                  <Button
                    style={{ display: "inline-block", marginRight: "5px" }}
                    variant="primary"
                    onClick={() => {
                      setDisplayedMovies(movie_pages[index]);
                    }}
                    key={index}
                  >
                    {index + 1}
                  </Button>
                );
              })}
          </div>
        </Row>
      </div>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  //establish a connection to the database containing all the movies to be featured on the site
  await mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  //this model is used to pull movie ids from 'movies' collection and statically generate the page
  //THERE IS NOTHING SAVED TO THIS COLLECTION USING THIS MODEL
  const MovieSchema = new mongoose.Schema({}, { collection: "movies" });
  const M =
    (await mongoose.models.M) || (await mongoose.model("M", MovieSchema));
  var movieIdsToGenerate = await M.find(); //grabs all movie ids, use TMDB api to gather information
  movieIdsToGenerate = await JSON.parse(JSON.stringify(movieIdsToGenerate));

  //this model takes all the data pulled from TMDB api and stores it in mongo collection
  //MAIN PURPOSE IT FOR FILTERING MOVIES
  const MovieDetailsSchema = new mongoose.Schema(
    {
      movie_id: String,
      movie_title: String,
      movie_genre: String,
      movie_release_date: String,
      movie_poster: String,
    },
    { collection: "movie_details" }
  );
  const M2 =
    (await mongoose.models.M2) ||
    (await mongoose.model("M2", MovieDetailsSchema));

  //get all the information to statically genreate for the page
  const generateMovieData = async (movieList) => {
    var x = await Promise.all(
      movieList.map(async (item) => {
        //obj to be returned
        var returnData = {};
        try {
          const res = await axios.get(
            "https://api.themoviedb.org/3/movie/" +
              item +
              "?api_key=" +
              process.env.TMDB_API_KEY +
              "&language=en-US"
          );

          //set all return data
          //also save data in movie_details collection for querying purposes
          returnData.movie_title = res.data.title;
          returnData.movie_poster =
            "https://image.tmdb.org/t/p/original" + res.data.poster_path;
          returnData.movie_id = res.data.id;
          returnData.movie_genre = res.data.genres[0].name;
          returnData.movie_release_date = res.data.release_date;

          //before saving new movie details to database, look to see if movie id alreasdy exists
          var alreadyStored = await M2.find({ movie_id: item });

          //movie details are not stored already, save new document in movie_details collection
          if (alreadyStored.length === 0) {
            console.log(
              "no movie details stored on movie id " +
                item +
                ", saving new movie_details document"
            );

            const newMovieDetails = new M2({
              movie_id: item,
              movie_title: res.data.title,
              movie_genre: res.data.genres[0].name.toLowerCase(),
              movie_release_date: res.data.release_date,
              movie_poster:
                "https://image.tmdb.org/t/p/original" + res.data.poster_path,
            });
            await newMovieDetails.save();
          }

          return returnData;
        } catch {
          console.log("cannot get data for movie id " + item);
          return undefined;
        }
      })
    );

    return x;
  };

  var movies = await generateMovieData(movieIdsToGenerate[0].movie_ids); //array with all the movie details objs

  movies = await arrayShuffle(movies);

  //gets the number of pages and sets movie data for each page
  //there can only be 18 movies displayed at once
  const generatePagesData = async (all_movies) => {
    //WILL NOT WORK PROPERLY IF THERE IS LESS THAN 18 MOVIES STORED IN DATABASE
    //NEED TO COME BACK AND FIX CODE WHEN MORE THAN 180 MOVIES ARE STORED......
    if (all_movies.length >= 18) {
      //first, find what the remander is between the total num of movies stored and 18 (18 being the max number of moives to display at once)
      //if 0, there will be exactly 18 movies on each page
      var numOfPages = Math.floor(all_movies.length / 18) + 1;
      var moviesOnLastPage = all_movies.length % 18;

      //each page has equal number of movies
      if (moviesOnLastPage === 0) {
        numOfPages -= 1;
        var moviePageData = [];

        var slicePoint = 0;
        for (var i = 0; i < numOfPages; ++i) {
          var x = all_movies.slice(slicePoint, slicePoint + 18);
          moviePageData.push(x);
          slicePoint += 18;
        }

        //need to randomize the order of movies on each page
        await Promise.all(
          moviePageData.map((item) => {
            arrayShuffle(item);
          })
        );

        return moviePageData;
        //last page will have variable amount of movies
      } else {
        var moviePageData = [];

        var slicePoint = 0;
        for (var i = 0; i < numOfPages; ++i) {
          var x = all_movies.slice(slicePoint, slicePoint + 18);
          moviePageData.push(x);
          slicePoint += 18;
        }

        //need to randomize the order of movies on each page
        await Promise.all(
          moviePageData.map((item) => {
            arrayShuffle(item);
          })
        );

        return moviePageData;
      }
      //more than 180 movies
    } else if (all_movies.length > 180) {
      all_movies.length = 180; //makes sure max of 10 pages

      var numOfPages = Math.floor(all_movies.length / 18) + 1;
      var moviesOnLastPage = all_movies.length % 18;

      numOfPages -= 1;
      var moviePageData = [];

      var slicePoint = 0;
      for (var i = 0; i < numOfPages; ++i) {
        var x = all_movies.slice(slicePoint, slicePoint + 18);
        moviePageData.push(x);
        slicePoint += 18;
      }

      //need to randomize the order of movies on each page
      await Promise.all(
        moviePageData.map((item) => {
          arrayShuffle(item);
        })
      );

      return moviePageData;
    }
  };

  const pageData = await generatePagesData(movies);

  return {
    props: {
      num_of_movies_stored: movies.length,
      movie_pages: pageData,
    },
    revalidate: 3600,
  };
};
