import React from "react";
import mongoose from "mongoose";
import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { Row, Col } from "react-bootstrap";
import MovieCard from "../../components/MovieCard";

const CastPage = ({
  cast_details,
  cast_bio,
  cast_movies,
  meta_description,
  meta_robots,
  canonical_tag,
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
        <title>Bad {cast_details[0].cast_name} Movies</title>
        <meta name="description" content={meta_description}></meta>
        {meta_robots !== null && <meta name="robots" content="noindex" />}
        <link rel="canonical" href={canonical_tag} />
        <meta
          property="og:url"
          content={"https://trashflixs.com/cast/" + cast_details[0].cast_id}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={
            "All the bad movies " + cast_details[0].cast_name + " has been in"
          }
        />
        <meta
          property="og:description"
          content={
            "Actors are not always proud of the films they've starred in"
          }
        />
        <meta
          property="og:image"
          content={cast_details[0].cast_profile_picture}
        />
      </Head>

      <div
        style={{ backgroundColor: "white", padding: "25px", marginTop: "10px" }}
      >
        <Row>
          <Col md={5}>
            <Image
              src={cast_details[0].cast_profile_picture}
              layout={"intrinsic"}
              width={300}
              height={300}
              alt={cast_details[0].cast_name}
            />
            <h1>{cast_details[0].cast_name}</h1>
            <p>{cast_bio}</p>
          </Col>
          <Col md={7}>
            <h3>
              Bad movies featured in{" "}
              <span style={{ fontSize: "16px", color: "grey" }}>
                ({cast_movies.length})
              </span>
            </h3>
            <div>
              {cast_movies.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: "inline-block", marginRight: "5px" }}
                  >
                    <a
                      title={"Visit " + item.title + " movie page"}
                      href={"/movies/" + item.id}
                    >
                      <MovieCard
                        imgSrc={item.movie_poster}
                        imgSize={130}
                        imgLayout={"intrinsic"}
                        altTxt={item.title + " movie poster"}
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CastPage;

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
  //gets the name and picture of every movie this cast member has been in
  //ONLY MOVIES ON THIS SITE WILL BE SHOWN
  const getMoviesFeaturedIn = async (movie_array) => {
    try {
      var returnData = await Promise.all(
        movie_array.map(async (item) => {
          const res = await axios.get(
            "https://api.themoviedb.org/3/movie/" +
              item +
              "?api_key=" +
              process.env.TMDB_API_KEY +
              "&language=en-US"
          );

          res.data.movie_poster =
            "https://image.tmdb.org/t/p/original" + res.data.poster_path; //moviecard needs img src to be called 'movie_poster'
          res.data.movie_title = res.data.title;

          return res.data;
        })
      );

      return returnData;
    } catch {
      console.log("cannot fetch the cast members movies theyve been in");
    }
  };

  //generates string for meta description based on current cast member
  const generateMetaDescription = async (movie_array, cast_member) => {
    if (movie_array.length === 0) {
      return "Bad movies " + cast_member + " has been in";
    }
    //no need to shorten string
    else if (movie_array.length <= 4) {
      const data = await Promise.all(
        movie_array.map((item) => {
          return item.title;
        })
      );

      return (
        "Discover bad movies " +
        cast_member +
        " has been in, including - " +
        data.join(", ")
      );
    } else {
      movie_array.length = 4; //makes sure desription is short
      const data = await Promise.all(
        movie_array.map((item) => {
          return item.title;
        })
      );

      return (
        "Discover bad movies " +
        cast_member +
        " has been in, including - " +
        data.join(", ")
      );
    }
  };

  const castID = context.params.cast_id;

  const castSchema = new mongoose.Schema({}, { collection: "movie_cast" });
  const CastModel =
    (await mongoose.models.CastModel) ||
    (await mongoose.model("CastModel", castSchema));
  var castDetails = await CastModel.find({ cast_id: castID });
  castDetails = await JSON.parse(JSON.stringify(castDetails));

  const canonicalTag = "https://trashflixs.com/cast/" + castDetails[0].cast_id;

  const starredIn = await getMoviesFeaturedIn(castDetails[0].movies); //contains all the movies cast member has been in featured on this website

  var metaDiscription = await generateMetaDescription(
    starredIn,
    castDetails[0].cast_name
  );

  const castBio = await axios.get(
    "https://api.themoviedb.org/3/person/" +
      castID +
      "?api_key=" +
      process.env.TMDB_API_KEY +
      "&language=en-US"
  );
  var bio = castBio.data.biography;

  //if there is no biography, set text and robots meta tag
  //page without much text will not help with seo, so dont index page
  var index = null; //null by default, do not change unless page should NOT be indexed
  if (castBio.data.biography === "") {
    bio = "No biography for this person";
    index = false;
  }

  return {
    props: {
      cast_details: castDetails,
      cast_bio: bio,
      cast_movies: starredIn,
      meta_description: metaDiscription,
      meta_robots: index,
      canonical_tag: canonicalTag,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths = async () => {
  //grab all cast members stored and make path for each
  const castSchema = new mongoose.Schema({}, { collection: "movie_cast" });
  const CastModel =
    (await mongoose.models.CastModel) ||
    (await mongoose.model("CastModel", castSchema));
  var castPaths = await CastModel.find(); //get all cast members stored
  castPaths = await JSON.parse(JSON.stringify(castPaths));

  const paths = await castPaths.map((item) => {
    return {
      params: { cast_id: String(item.cast_id) },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};
