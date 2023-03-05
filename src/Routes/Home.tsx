import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getMovies,
  IGetTopMoviesResult,
  getTopMovies,
  getPopularMovies,
  getTopMovies2,
  getTopMovies3,
} from "../api";
import { makeImgPath } from "../utils";
import "./Home.css";

const Wrapper = styled.div`
  margin-top: 10vh;
  height: 100vh;
`;
const Box = styled.div<{ bgPhoto: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  margin: 10px;
  padding: 16px;
  font-weight: 600;
  text-align: center;
  border-radius: 16px;
  width: 220px;
  background: rgba(255, 255, 255, 0.05);
  background-image: url(${(data) => data.bgPhoto});
  background-size: cover;
  background-position: center center;
  font-weight: 600;
  font-size: 18px;
`;

const InfiniteLooper = function InfiniteLooper({
  speed,
  direction,
  children,
}: {
  speed: number;
  direction: "right" | "left";
  children: React.ReactNode;
}) {
  const [looperInstances, setLooperInstances] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  function resetAnimation() {
    if (innerRef?.current) {
      innerRef.current.setAttribute("data-animate", "false");

      setTimeout(() => {
        if (innerRef?.current) {
          innerRef.current.setAttribute("data-animate", "true");
        }
      }, 10);
    }
  }

  const setupInstances = useCallback(() => {
    if (!innerRef?.current || !outerRef?.current) return;

    const { width } = innerRef.current.getBoundingClientRect();

    const { width: parentWidth } = outerRef.current.getBoundingClientRect();

    const widthDeficit = parentWidth - width;

    const instanceWidth = width / innerRef.current.children.length;

    if (widthDeficit) {
      setLooperInstances(
        looperInstances + Math.ceil(widthDeficit / instanceWidth) + 1
      );
    }

    resetAnimation();
  }, [looperInstances]);

  /*
    6 instances, 200 each = 1200
    parent = 1700
  */

  useEffect(() => setupInstances(), [setupInstances]);

  useEffect(() => {
    window.addEventListener("resize", setupInstances);

    return () => {
      window.removeEventListener("resize", setupInstances);
    };
  }, [looperInstances, setupInstances]);

  return (
    <div className="looper" ref={outerRef}>
      <div className="looper__innerList" ref={innerRef} data-animate="true">
        {[...Array(looperInstances)].map((_, ind) => (
          <div
            key={ind}
            className="looper__listInstance"
            style={{
              animationDuration: `${speed}s`,
              animationDirection: direction === "right" ? "reverse" : "normal",
            }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};

function Home() {
  const { data: nowMovie, isLoading: nowLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: topMovie, isLoading: topLoading } =
    useQuery<IGetTopMoviesResult>(["topmovies", "top"], getTopMovies);
  const { data: topMovie2, isLoading: topLoading2 } =
    useQuery<IGetTopMoviesResult>(["topmovies2", "top2"], getTopMovies2);
  const { data: popMovie, isLoading: popLoading } =
    useQuery<IGetTopMoviesResult>(["popmovies", "pop"], getPopularMovies);
  const { data: topMovie3, isLoading: topLoading3 } =
    useQuery<IGetTopMoviesResult>(["topmovies3", "top3"], getTopMovies3);
  return (
    <Wrapper>
      {nowLoading &&
      topLoading &&
      popLoading &&
      topLoading2 &&
      topLoading3 ? null : (
        <div>
          <InfiniteLooper speed={15} direction="right">
            {nowMovie?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={20} direction="right">
            {topMovie?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={17} direction="right">
            {topMovie2?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={16} direction="right">
            {topMovie3?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={18} direction="right">
            {popMovie?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
        </div>
      )}
    </Wrapper>
  );
}
export default Home;
