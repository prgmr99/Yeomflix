import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { keywordState } from "./atom";
import Movie from "./Routes/Movie";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Home from "./Routes/Home";

function App() {
  const query = useRecoilValue(keywordState);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/movie" element={<Movie />} />
        <Route path="/movies/:id" element={<Movie />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/shows/:id" element={<Tv />} />
        <Route path={`/search/query=${query}`} element={<Search />} />
        <Route path={`/search/query=${query}/:id`} element={<Search />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
