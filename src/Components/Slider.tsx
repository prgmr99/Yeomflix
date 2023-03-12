import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { makeImgPath } from "../utils";
import { IGetMoviesResult, IGetTopMoviesResult, IGetTvOnAir } from "../api";
import { useRecoilValue } from "recoil";
import { keywordState } from "../atom";

const Slider0 = styled.div`
  position: relative;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 180px;
  background-image: url(${(data) => data.bgPhoto});
  background-size: cover;
  background-position: center center;
  font-size: 30px;
  border-radius: 7px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(data) => data.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    font-size: 15px;
    text-align: center;
  }
`;
const RightBtn = styled(motion.button)`
  position: absolute;
  left: 96vw;
  top: 10vh;
  background-color: rgba(200, 200, 200, 0.5);
  border-radius: 50px;
  font-size: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
`;
const LeftBtn = styled(motion.button)`
  position: absolute;
  left: 0.5vw;
  top: 10vh;
  background-color: rgba(200, 200, 200, 0.5);
  border-radius: 50px;
  font-size: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  z-index: 1;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};
const offset = 6;

function Slider({
  data,
}:
  | { data: IGetTopMoviesResult }
  | { data: IGetTvOnAir }
  | { data: IGetMoviesResult }) {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useRecoilValue(keywordState);
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const maxIndex = Math.floor((totalMovies as any) / offset) - 1;
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const toggleLeavingL = () => setLeaving((prev) => !prev);
  const rowVariants = {
    hidden: (back: boolean) => ({
      x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
    }),
    visible: {
      x: 0,
    },
    exit: (back: boolean) => ({
      x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
  };
  const whichBoxClicked = (movieId: number) => {
    if (location?.pathname === "/movie") {
      onBoxClicked(movieId);
    }
    if (location?.pathname === "/tv") {
      onTvBoxClicked(movieId);
    }
    if (location?.pathname === `/search/query=${query}`) {
      onSearchBoxClicked(movieId);
    }
  };
  const onBoxClicked = (movieId: number) => {
    console.log("home success!");
    navigate(`/movies/${movieId}`);
  };
  const onTvBoxClicked = (tvId: number) => {
    console.log("tv success!");
    navigate(`/tv/shows/${tvId}`);
  };
  const onSearchBoxClicked = (movieId: number) => {
    console.log("search success!");
    navigate(`/search/query=${query}/${movieId}`);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      setTotalMovies(data?.results.length - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(true);
      toggleLeavingL();
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  return (
    <Slider0>
      {index === 0 ? null : (
        <LeftBtn
          onClick={decreaseIndex}
          whileHover={{
            scale: 1.2,
            opacity: 1,
            transition: { type: "tween", duration: 0.5 },
          }}
        >
          ◀︎
        </LeftBtn>
      )}
      <AnimatePresence
        custom={back}
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <Row
          custom={back}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 2 }}
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                onClick={() => {
                  whichBoxClicked(movie.id);
                }}
                bgPhoto={
                  movie.backdrop_path
                    ? makeImgPath(movie.backdrop_path, "w400")
                    : "https://i.ibb.co/VCKVxQG/no-image.jpg"
                }
              >
                <Info variants={infoVariants}>
                  <h4>
                    {(movie.title as string) || (movie.original_name as string)}
                  </h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      {index === maxIndex ? null : (
        <RightBtn
          onClick={increaseIndex}
          whileHover={{
            scale: 1.2,
            opacity: 1,
            transition: { type: "tween", duration: 0.5 },
          }}
        >
          ▶️
        </RightBtn>
      )}
    </Slider0>
  );
}

export default Slider;
