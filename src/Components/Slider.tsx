import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch, useLocation } from "react-router-dom";
import { makeImgPath } from "../utils";
import { IGetTopMoviesResult, IGetTvOnAir } from "../api";
import Flicking from "@egjs/flicking";
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
  border-radius: 5px;
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
const SliderInfo = styled.span`
  font-size: 25px;
  margin-left: 10px;
  margin-bottom: 5px;
  font-weight: 500;
`;
const RightBtn = styled(motion.button)`
  position: absolute;
  left: 96vw;
  top: 14vh;
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
  left: 0vw;
  top: 14vh;
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

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};
const revRowVariants = {
  hidden: {
    x: -window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth,
  },
};
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
}: { data: IGetTopMoviesResult } | { data: IGetTvOnAir }) {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useRecoilValue(keywordState);
  const movieMatch = useMatch("/movies/:movieId");
  const tvMatch = useMatch("/tv/shows/:tvId");
  const searchMatch = useMatch(`/search?query=${query}/:movieId`);
  const [index, setIndex] = useState(0);
  const [which, setWhich] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const maxIndex = Math.floor((totalMovies as any) / offset) - 1;
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const toggleLeavingL = () => setLeaving((prev) => !prev);
  const whichBoxClicked = (movieId: number) => {
    if (location?.pathname === "/") {
      onBoxClicked(movieId);
    }
    if (location?.pathname === "/tv") {
      onTvBoxClicked(movieId);
    }
    if (location?.pathname === "/search") {
      onSearchBoxClicked(movieId);
    }
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onTvBoxClicked = (tvId: number) => {
    navigate(`/tv/shows/${tvId}`);
  };
  const onSearchBoxClicked = (movieId: number) => {
    navigate(`/search?query=${query}/${movieId}`);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setWhich(false);
      toggleLeaving();
      setTotalMovies(data?.results.length - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setWhich(true);
      toggleLeavingL();
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  console.log(tvMatch);
  return (
    <Slider0>
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
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={which ? revRowVariants : rowVariants}
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
                bgPhoto={makeImgPath(movie.backdrop_path, "w400")}
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
    </Slider0>
  );
}

export default Slider;
