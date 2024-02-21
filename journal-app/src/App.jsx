import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Journal/Home";
import Journal from "./Journal/Journal";
import JournalEntry from "./Journal/JournalEntry";
import Nav from "./Journal/Nav";

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalEntry />} />
      </Routes>
    </div>
  );
}

export default App;
