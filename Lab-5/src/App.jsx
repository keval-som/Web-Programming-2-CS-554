import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import HistoryComponent from "./components/HistoryComponent";
import Home from "./components/Home";
import Company from "./components/Company";
import ListData from "./components/ListData";
import Launches from "./components/Launches";
import Payloads from "./components/Payloads";
import Core from "./components/Cores";
import Rockets from "./components/Rockets";
import Ships from "./components/Ships";
import LaunchPads from "./components/Launchpads";
import PageNotFound from "./components/PageNotFound";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/" aria-label="Home" className="logo-link">
              <img
                src="https://www.logo.wine/a/logo/SpaceX/SpaceX-White-Dark-Background-Logo.wine.svg"
                className="App-logo"
                alt="SpaceX Logo"
              />
            </Link>
            <h2 className="App-title">Welcome to SpaceX Explorer</h2>
          </header>
          <main className="App-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<HistoryComponent />} />
              <Route path="/company" element={<Company />} />
              <Route
                path="/launches/page/:page"
                element={<ListData type="launches" />}
              />
              <Route path="/launches/:id" element={<Launches />} />
              <Route
                path="/payloads/page/:page"
                element={<ListData type="payloads" />}
              />
              <Route path="/payloads/:id" element={<Payloads />} />
              <Route
                path="cores/page/:page"
                element={<ListData type="cores" />}
              />
              <Route path="cores/:id" element={<Core />} />
              <Route
                path="rockets/page/:page"
                element={<ListData type="rockets" />}
              />
              <Route path="rockets/:id" element={<Rockets />} />
              <Route
                path="ships/page/:page"
                element={<ListData type="ships" />}
              />
              <Route path="ships/:id" element={<Ships />} />
              <Route
                path="launchpads/page/:page"
                element={<ListData type="launchpads" />}
              />
              <Route path="launchpads/:id" element={<LaunchPads />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
