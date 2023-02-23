import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeImgPath } from "../utils";
import { IGetTopMoviesResult } from "../api";

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

function Slider({ data }: { data: IGetTopMoviesResult }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const maxIndex = Math.floor((totalMovies as any) / offset) - 1;
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const increaseIndexNow = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setTotalMovies(data?.results.length - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <Slider0>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
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
                onClick={() => onBoxClicked(movie.id)}
                bgPhoto={makeImgPath(movie.backdrop_path, "w400")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <RightBtn
        onClick={increaseIndexNow}
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
