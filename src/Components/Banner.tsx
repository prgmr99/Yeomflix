import styled from "styled-components";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { makeImgPath } from "../utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getVideoMovie, IGetVideo } from "../api";
import Youtube from "react-youtube";

interface IBanner {
  data: any;
  category: string;
}

const Loader = styled.div`
  height: 20vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
const BannerWrap = styled.div<{ bgPhoto: string }>`
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
const Btn = styled.div`
  display: flex;
  flex-direction: row;
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

function Banner({ data, category }: IBanner) {
  const navigate = useNavigate();
  const [randomIndex, setRandomIndex] = useState(0);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  useEffect(() => {
    const min = 0;
    const max = 20;
    setRandomIndex(Math.floor(min + Math.random() * (max - min)));
  }, []);
  const { data: movieVideo, isLoading: videoLoading } = useQuery<IGetVideo>(
    ["movieVideo", `video_${data?.results[randomIndex].id}`],
    () => getVideoMovie(data?.results[randomIndex].id)
  );

  return (
    <BannerWrap
      bgPhoto={makeImgPath(data?.results[randomIndex].backdrop_path || "")}
    >
      <Title>{data?.results[randomIndex].title}</Title>
      <Overview>{data?.results[randomIndex].overview}</Overview>
      <Btn>
        <PlayBtn>▶️ Play</PlayBtn>
        <MoreInfoBtn
          layoutId={data?.results[randomIndex].id + ""}
          onClick={() => onBoxClicked(data?.results[randomIndex].id || 0)}
        >
          ⓘ More Info
        </MoreInfoBtn>
      </Btn>
      {category === "movie" && videoLoading ? (
        <Loader>Loading...</Loader>
      ) : movieVideo?.results.length === 0 ? null : (
        <Youtube
          style={{ position: "absolute", left: "50vw", top: "35vh" }}
          videoId={movieVideo?.results[movieVideo?.results.length - 1].key}
          key={movieVideo?.results[movieVideo?.results.length - 1].key}
          opts={{
            height: "350vh",
            width: "600vw",
            playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
          }}
        />
      )}
    </BannerWrap>
  );
}

export default Banner;
