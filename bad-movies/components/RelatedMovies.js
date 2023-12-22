import React from "react";
import MovieCard from "./MovieCard";
import { Row, Col } from "react-bootstrap";

const RelatedMovies = ({ related }) => {
  return (
    <div>
      {related !== null && (
        <h3 style={{ fontWeight: "normal" }}>Related movies</h3>
      )}

      <Row>
        <Col md={7}>
          <Row>
            {related !== null &&
              related.map((item, index) => {
                return (
                  <Col key={index}>
                    <a
                      style={{ textDecoration: "none", color: "black" }}
                      href={"/movies/" + item.movie_id}
                    >
                      <MovieCard
                        imgSrc={item.movie_poster}
                        imgSize={150}
                        imgLayout={"intrinsic"}
                        altTxt={item.movie_title + " movie poster"}
                      />
                      <p style={{ width: "150px" }}>{item.movie_title}</p>
                    </a>
                  </Col>
                );
              })}
          </Row>
        </Col>
        <Col md={5}></Col>
      </Row>
    </div>
  );
};

export default RelatedMovies;
