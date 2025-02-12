import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
