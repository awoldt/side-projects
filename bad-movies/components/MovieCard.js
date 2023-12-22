import React from "react";
import Image from "next/image";

//IMPROVED MOVIE CARD
//USE THIS ONE FROM NOW ON
const MovieCard2 = ({ imgSrc, imgSize, imgLayout, altTxt }) => {
  return (
    <div>
      <Image
        src={imgSrc}
        layout={imgLayout}
        width={imgSize}
        height={imgSize}
        alt={altTxt}
      />
    </div>
  );
};

export default MovieCard2;
