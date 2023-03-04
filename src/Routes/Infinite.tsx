import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImgPath } from "../utils";
import "./Infinite.css";

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
  width: 120px;
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

function Infinite() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data);
  return (
    <div className="app">
      <p className="description">
        Just throw some content into the component and set the speed and
        direction.
      </p>
      {isLoading ? null : (
        <div>
          <InfiniteLooper speed={10} direction="right">
            {data?.results.map((movie) => (
              <Box bgPhoto={makeImgPath(movie.backdrop_path, "w500")}></Box>
            ))}
          </InfiniteLooper>

          <InfiniteLooper direction="right" speed={0.4}>
            <div className="contentBlock contentBlock--two">
              <span>faster 🚀</span>
            </div>
          </InfiniteLooper>
        </div>
      )}
    </div>
  );
}
export default Infinite;
