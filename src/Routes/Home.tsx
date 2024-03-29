import styled from "styled-components";
import { useEffect, useRef, useCallback } from "react";
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
import { looperState } from "../atom";
import { useRecoilState } from "recoil";
import { Helmet } from "react-helmet-async";
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
  const [looperInstances, setLooperInstances] = useRecoilState(looperState);
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

    const instanceWidth = width / innerRef?.current?.children.length;

    if (widthDeficit) {
      if (instanceWidth) {
        setLooperInstances(
          looperInstances + Math.ceil(widthDeficit / instanceWidth) + 1
        );
      }
    }
    resetAnimation();
  }, [looperInstances]);

  useEffect(() => setupInstances(), [setupInstances]);
  // 이 코드가 새로고침에 영향을 주는 구나. 나이스!
  // 근데 이 코드가 없으면 Infinite이 되지 않음.
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
          <Helmet>
            <title>Home</title>
          </Helmet>
          <InfiniteLooper speed={71} direction="right">
            {nowMovie?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={100} direction="right">
            {topMovie?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={50} direction="right">
            {topMovie2?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={90} direction="right">
            {topMovie3?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>
          <InfiniteLooper speed={80} direction="right">
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
