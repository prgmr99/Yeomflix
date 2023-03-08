import { useRecoilValue } from "recoil";
import { keywordState } from "./atom";

export const API_KEY = "28480f953401db60e553e41284f5f407";
export const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_name?: string;
  vote_average: number;
}
interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_name: string;
  overview: string;
  title?: string;
  vote_average?: number;
}
interface IVideoMovie {
  key: string;
}
export interface IGetMoviesResult {
  dates: {
    minimum: string;
    maximum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetTopMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvOnAir {
  page: number;
  results: ITv[];
  totatl_pages: number;
  total_results: number;
}
export interface IGetVideo {
  id: number;
  results: IVideoMovie[];
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&page=1&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&page=1&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopMovies2() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&page=2&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopMovies3() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&page=3&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getLastestMovies() {
  return fetch(
    `${BASE_PATH}/movie/lastest?api_key=${API_KEY}&page=1&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&page=2&include_adult=false&language=ko-KR&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies2() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&page=3&include_adult=false&language=ko-KR&region=kr`
  ).then((response) => response.json());
}

export function getUpcomingMovies() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&page=2&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvOnAir() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&page=1&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopTvs() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&page=1&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getPopTvs() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&page=5&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getAirTodayTvs() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&page=2&include_adult=false&language=ko-KR`
  ).then((response) => response.json());
}

export function getSearchData(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&language=ko-KR&include_adult=false`
  ).then((response) => response.json());
}

export function getVideoMovie(movieId?: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getVideoTv(tvId?: number) {
  return fetch(
    `${BASE_PATH}/movie/${tvId}/videos?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
