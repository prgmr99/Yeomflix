import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { keywordState } from "./atom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Infinite from "./Routes/Infinite";

function App() {
  const query = useRecoilValue(keywordState);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/shows/:id" element={<Tv />} />
        <Route path={`/search/query=${query}`} element={<Search />} />
        <Route path={`/search/query=${query}/:id`} element={<Search />} />
        <Route path="/infinite" element={<Infinite />} />
      </Routes>
    </Router>
  );
}

export default App;
