import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { keywordState } from "../atom";
import { getSearchData, IGetMoviesResult } from "../api";
import { makeImgPath } from "../utils";
import { Helmet } from "react-helmet-async";
import Slider from "../Components/Slider";
import SearchBanner from "../Components/SearchBanner";

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
const SliderNow = styled.div`
  position: relative;
  top: -100px;
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

function Search() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const query = useRecoilValue(keywordState);
  const bigMovieMatch = useMatch(`/search/query=${query}/:movieId`);
  //const location = useLocation();
  //const keyword = new URLSearchParams(location.search).get("query");
  const { data: searchData, isLoading: searchLoading } =
    useQuery<IGetMoviesResult>(["keywords", "query"], () =>
      getSearchData(query)
    );
  //console.log(query);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    searchData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const onOverlayClicked = () => {
    navigate(`/search/query=${query}`);
  };
  return (
    <Wrapper>
      <Helmet>
        <title>Search</title>
      </Helmet>
      {searchLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchBanner
            data={searchData}
            category="search"
            keyword={query as string}
          />
          <SliderNow>
            <SliderInfo>Related Movies</SliderInfo>
            <Slider data={searchData as IGetMoviesResult} />
          </SliderNow>
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

export default Search;
