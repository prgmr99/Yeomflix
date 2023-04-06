import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImgPath } from "../utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IGetVideo, getVideoTv } from "../api";
import Youtube from "react-youtube";

interface ITvBanner {
  data: any;
  category: string;
}

const Loader = styled.div`
  height: 20vh;
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

function TvBanner({ data, category }: ITvBanner) {
  const navigate = useNavigate();
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/shows/${tvId}`);
  };
  const { data: tvVideo, isLoading: videoLoading } = useQuery<IGetVideo>(
    ["tvVideo", `video_${data?.results[0].id}`],
    () => getVideoTv(data?.results[0].id)
  );
  console.log(tvVideo);
  return (
    <BannerWrap bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}>
      <Title>{data?.results[0].name}</Title>
      <Overview>{data?.results[0].overview}</Overview>
      <Btn>
        <PlayBtn>▶️ Play</PlayBtn>
        <MoreInfoBtn
          layoutId={data?.results[0].id + ""}
          onClick={() => onBoxClicked(data?.results[0].id || 0)}
        >
          ⓘ More Info
        </MoreInfoBtn>
      </Btn>
      {category === "tv" && videoLoading ? (
        <Loader>Loading...</Loader>
      ) : tvVideo?.results.length === 0 ? null : null}
    </BannerWrap>
  );
}

export default TvBanner;
