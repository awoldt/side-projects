import React from "react";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numOfResults, setNumOfResults] = useState(false);

  const searchQuery = async (q) => {
    setLoading(true); //shows loading spinner before results display

    try {
      var res = await axios.get("/api/search?genre=" + q);
      res = await JSON.parse(JSON.stringify(res));

      //there is search data returned
      if (res.data.data.length !== 0) {
        setLoading(false);
        setSearchResults(res.data.data);

        setNumOfResults(res.data.data.length);
      }
      //no data has been returned
      else {
        setLoading(false);
        setSearchResults([]);
        setNumOfResults(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div>
      <InputGroup>
        <FormControl
          placeholder="Search a movie"
          aria-label="search"
          onChange={(e) => {
            searchQuery(e.target.value);
          }}
        />
      </InputGroup>

      {loading && (
        <div style={{ marginTop: "20px" }}>
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      )}

      {numOfResults && (
        <p style={{ paddingLeft: "15px", marginTop: "15px" }}>
          showing {numOfResults} results
        </p>
      )}

      {searchResults.map((item) => {
        return (
          <Link href={"/movies/" + item.id} passHref key={item.id}>
            <a
              style={{ textDecoration: "none" }}
              onClick={() => {
                setSearchResults([]);
              }}
            >
              <div style={{ marginTop: "10px", paddingLeft: "15px" }}>
                <Image
                  src={item.poster}
                  layout={"intrinsic"}
                  width={100}
                  height={100}
                  alt={item.title + " movie poster"}
                />
                <span style={{ display: "inline-block", marginLeft: "10px" }}>
                  {item.title}
                </span>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default Search;
