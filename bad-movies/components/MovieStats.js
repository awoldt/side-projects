import React from 'react'

const MovieStats = ({release_date, budget, runtime, production_company}) => {

    const minToHr = Math.floor(runtime/60) + 'hr and ' + (runtime%60) + ' minutes';


    return (
        <div>
            <p><b>Release date:</b> {release_date}</p>
            {budget !== String(0) &&  <p><b>Budget:</b> ${budget}</p>}
            <p><b>Runtime: </b> {runtime} mins ({minToHr})</p>
            <p><b>Production:</b> {production_company}</p>
        </div>
    )
}

export default MovieStats
