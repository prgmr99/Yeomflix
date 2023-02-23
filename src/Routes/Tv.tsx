import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "react-query";
import {
  getMovies,
  IGetMoviesResult,
  getTopMovies,
  IGetTopMoviesResult,
} from "../api";
import { makeImgPath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  height: 200vh;
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  padding-right: 900px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h1`
  font-size: 58px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 20px;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const SliderTop = styled.div`
  position: relative;
  top: 100px;
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
  background-image: url(${(props) => props.bgPhoto});
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
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    font-size: 15px;
    text-align: center;
  }
`;
const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 200vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const MovieDetail = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.veryDark};
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const MovieDetailImg = styled.div`
  width: 100%;
  height: 320px;
  background-size: cover;
  background-position: center center;
`;
const MovieDetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  position: relative;
  top: -50px;
  padding: 10px;
`;
const MovieDetailOverview = styled.p`
  padding: 20px 20px;
  position: relative;
  top: -20px;
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
const Btn = styled.div`
  display: flex;
  flex-direction: row;
`;
const PlayBtn = styled(motion.button)`
  margin-right: 10px;
  position: relative;
  display: inline-block;
  width: 100px;
  height: 40px;
  top: 10px;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
const MoreInfoBtn = styled(motion.button)`
  position: relative;
  display: inline-block;
  width: 150px;
  height: 40px;
  top: 10px;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
const SliderInfo = styled.span`
  font-size: 25px;
  margin-left: 10px;
  margin-bottom: 5px;
  font-weight: 500;
`;
const LikeBtn = styled(motion.button)`
  position: relative;
  top: -30px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.white.darker};
  border: 2px solid grey;
  cursor: pointer;
`;
const BtnArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

function Tv() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data: nowMovie, isLoading: nowLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: topMovie, isLoading: topLoading } =
    useQuery<IGetTopMoviesResult>(["topmovies", "top"], getTopMovies);
  const [index, setIndex] = useState(0);
  const [indexTop, setIndexTop] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [leavingTop, setLeavingTop] = useState(false);
  const { scrollY } = useScroll();
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalTopMovies, setTotalTopMovies] = useState(0);
  const maxIndex = Math.floor((totalMovies as any) / offset) - 1;
  const clickedMovie =
    (bigMovieMatch?.params.movieId &&
      nowMovie?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      )) ||
    topMovie?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );

  /**
   * This helps slide to right by increasing index
   * Probably I need to make this function, maxIndex, and totalState a new component
   * @returns change states
   */
  const increaseIndexNow = () => {
    if (nowMovie) {
      if (leaving) return;
      toggleLeaving();
      setTotalMovies(nowMovie?.results.length - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexTop = () => {
    if (topMovie) {
      if (leavingTop) return;
      toggleLeavingTop();
      setTotalTopMovies(topMovie?.results.length - 1);
      setIndexTop((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const toggleLeavingTop = () => setLeavingTop((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      {nowLoading && topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImgPath(nowMovie?.results[0].backdrop_path || "")}
          >
            <Title>{nowMovie?.results[0].title}</Title>
            <Overview>{nowMovie?.results[0].overview}</Overview>
            <Btn>
              <PlayBtn>▶️ Play</PlayBtn>
              <MoreInfoBtn
                layoutId={nowMovie?.results[0].id + ""}
                onClick={() => onBoxClicked(nowMovie?.results[0].id || 0)}
              >
                ⓘ More Info
              </MoreInfoBtn>
            </Btn>
          </Banner>
          <Slider>
            <SliderInfo>Now playing</SliderInfo>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
                key={index}
              >
                {nowMovie?.results
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
          </Slider>
          <SliderTop>
            <SliderInfo>Top Rated</SliderInfo>
            <AnimatePresence initial={false} onExitComplete={toggleLeavingTop}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
                key={indexTop}
              >
                {topMovie?.results
                  .slice(1)
                  .slice(offset * indexTop, offset * indexTop + offset)
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
              onClick={increaseIndexTop}
              whileHover={{
                scale: 1.2,
                opacity: 1,
                transition: { type: "tween", duration: 0.5 },
              }}
            >
              ▶️
            </RightBtn>
          </SliderTop>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <MovieDetail
                  style={{ top: scrollY.get() + 80 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <MovieDetailImg
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <MovieDetailTitle>{clickedMovie.title}</MovieDetailTitle>
                      <BtnArea>
                        <LikeBtn>❤️</LikeBtn>
                        <LikeBtn>저장</LikeBtn>
                        <LikeBtn>리뷰</LikeBtn>
                        <LikeBtn>평점</LikeBtn>
                      </BtnArea>
                      <MovieDetailOverview>
                        {clickedMovie.overview}
                      </MovieDetailOverview>
                    </>
                  )}
                </MovieDetail>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
