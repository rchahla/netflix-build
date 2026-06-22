import React, { useEffect, useRef, useState } from "react";
import "./Row.css";
import axios from "./axios";

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleScroll = (direction) => {
    const container = rowRef.current;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__container">
        <button
          className="row__arrow row__arrow--left"
          onClick={() => handleScroll("left")}
        >
          &#8249;
        </button>

        <div className="row__posters" ref={rowRef}>
          {movies.map(
            (movie) =>
              ((isLargeRow && movie.poster_path) ||
                (!isLargeRow && movie.backdrop_path)) && (
                <div
                  key={movie.id}
                  className={`row__card ${isLargeRow ? "row__card--large" : ""}`}
                >
                  <img
                    className="row__poster"
                    src={`${base_url}${
                      isLargeRow ? movie.poster_path : movie.backdrop_path
                    }`}
                    alt={movie.name || movie.title}
                  />
                  {!isLargeRow && (
                    <div className="row__card__overlay">
                      <span className="row__card__overlayTitle">
                        {movie.name || movie.title || movie.original_name}
                      </span>
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        <button
          className="row__arrow row__arrow--right"
          onClick={() => handleScroll("right")}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

export default Row;
