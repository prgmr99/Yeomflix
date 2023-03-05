import styled from "styled-components";
import { useQuery } from "react-query";
import {
  IGetTvOnAir,
  getTvOnAir,
  getTopTvs,
  getPopTvs,
  getAirTodayTvs,
} from "../api";
import { makeImgPath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";
import TvBanner from "../Components/TvBanner";

const Wrapper = styled.div`
  height: 205vh;
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
const SliderNow = styled.div`
  position: relative;
  top: -100px;
`;
const SliderTop = styled.div`
  position: relative;
  top: 100px;
`;
const SliderPop = styled.div`
  position: relative;
  top: 300px;
`;
const SliderToday = styled.div`
  position: relative;
  top: 500px;
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
  const { data: popTv, isLoading: popLoading } = useQuery<IGetTvOnAir>(
    ["popTvs", "popLoading"],
    getPopTvs
  );
  const { data: airTodayTv, isLoading: airTodayLoading } =
    useQuery<IGetTvOnAir>(["todayTvs", "todayLoading"], getAirTodayTvs);
  const { scrollY } = useScroll();
  const clickedMovie =
    (bigTvMatch?.params.tvId &&
      airTv?.results.find((tv) => tv.id + "" === bigTvMatch.params.tvId)) ||
    topTv?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId) ||
    popTv?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId) ||
    airTodayTv?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvId);
  const onOverlayClicked = () => {
    navigate("/tv");
  };
  return (
    <Wrapper>
      {airLoading && topLoading && popLoading && airTodayLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <TvBanner data={airTv} category="tv" />
          <SliderNow>
            <SliderInfo>Now playing</SliderInfo>
            <Slider data={airTv as IGetTvOnAir} />
          </SliderNow>
          <SliderTop>
            <SliderInfo>Top Rated</SliderInfo>
            <Slider data={topTv as IGetTvOnAir} />
          </SliderTop>
          <SliderPop>
            <SliderInfo>Popular</SliderInfo>
            <Slider data={popTv as IGetTvOnAir} />
          </SliderPop>
          <SliderToday>
            <SliderInfo>Popular</SliderInfo>
            <Slider data={airTodayTv as IGetTvOnAir} />
          </SliderToday>
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
