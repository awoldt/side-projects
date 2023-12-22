import React from "react";
import { Row, Col } from "react-bootstrap";
import MovieCard from "./MovieCard";

const Sequels = ({ c }) => {
  //if there are bad sequels in this franchise
  if (c.length !== 0) {
    return (
      <div style={{marginBottom: '25px'}}>
        <h2
          style={{
            fontWeight: "normal",
            display: "inline-block",
            marginRight: "5px",
          }}
        >
          Bad sequels
        </h2>
        <Row>
          {c.map((item, index) => {
            return (
              <Col key={index}>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }} 
                    href={"/movies/" + item.id}
                  >
                    <MovieCard
                      imgSrc={item.movie_poster}
                      imgSize={130}
                      imgLayout={"intrinsic"}
                      altTxt={item.movie_title + " movie poster"}
                    />
                    <p style={{ maxWidth: "130px", marginBottom: "0px" }}>
                      {item.title} <i>({item.release_date.split("-")[0]})</i>
                    </p>
                  </a>
              </Col>
            );
          })}
        </Row>
      </div>
    );
    //no sequels, means there was no movie_collection property added in getStaticProps on [movie_id] page
  } else {
    return null;
  }
};

export default Sequels;
