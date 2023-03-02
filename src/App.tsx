import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import { useRecoilValue } from "recoil";
import { keywordState } from "./atom";

function App() {
  const query = useRecoilValue(keywordState);
  console.log(query);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<Home />} />
        <Route path="/tv/shows/:id" element={<Tv />} />
        <Route path={`/search/${query}/:id`} element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
