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
}
interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_name: string;
  overview: string;
  title?: string;
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

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getLastestMovies() {
  return fetch(`${BASE_PATH}/movie/lastest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvOnAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopTvs() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetSearchData(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
