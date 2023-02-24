import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "react-query";
import { IGetTvOnAir, getTvOnAir, getTopTvs } from "../api";
import { makeImgPath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";

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
const SliderNow = styled.div`
  position: relative;
  top: -100px;
`;
const SliderTop = styled.div`
  position: relative;
  top: 100px;
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

function Home() {
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/shows/:tvId");
  const { data: airTv, isLoading: airLoading } = useQuery<IGetTvOnAir>(
    ["airTvs", "airPlaying"],
    getTvOnAir
  );
  const { data: topTv, isLoading: topLoading } = useQuery<IGetTvOnAir>(
    ["topTvs", "topLoading"],
    getTopTvs
  );

  const { scrollY } = useScroll();
  const clickedMovie =
    (bigTvMatch?.params.tvId &&
      airTv?.results.find((tv) => tv.id + "" === bigTvMatch.params.tvId)) ||
    topTv?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/shows/${tvId}`);
  };
  const onOverlayClicked = () => {
    navigate("/tv");
  };

  return (
    <Wrapper>
      {airLoading && topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImgPath(airTv?.results[0].backdrop_path || "")}>
            <Title>{airTv?.results[0].original_name}</Title>
            <Overview>{airTv?.results[0].overview}</Overview>
            <Btn>
              <PlayBtn>▶️ Play</PlayBtn>
              <MoreInfoBtn
                layoutId={airTv?.results[0].id + ""}
                onClick={() => onBoxClicked(airTv?.results[0].id || 0)}
              >
                ⓘ More Info
              </MoreInfoBtn>
            </Btn>
          </Banner>
          <SliderNow>
            <SliderInfo>Now playing</SliderInfo>
            <Slider data={airTv as IGetTvOnAir} />
          </SliderNow>
          <SliderTop>
            <SliderInfo>Top Rated</SliderInfo>
            <Slider data={topTv as IGetTvOnAir} />
          </SliderTop>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <MovieDetail
                  style={{ top: scrollY.get() + 80 }}
                  layoutId={bigTvMatch.params.tvId}
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
                      <MovieDetailTitle>
                        {clickedMovie.original_name}
                      </MovieDetailTitle>
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

export default Home;
