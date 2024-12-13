import { BrowserRouter as Router, Routes,Route,Navigate } from "react-router-dom";
import React from "react";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Home from "./Pages/Home/Home";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Root/>} />
        <Route path="/dashboard" exact element={<Home/>} />
        <Route path="/login" exact element={<Login/>} />
        <Route path="/signup" exact element={<Signup/>} />
      </Routes>
    </Router>
  )
}
// define the root comp to handle initial rendering
const Root=()=>{
  // check if token exists
  const isAuth=!!localStorage.getItem('token');
  // redirect to dashboard if authenticate else login
  return isAuth?(
    <Navigate to="/dashboard"/>)
    :
    (<Navigate to="/login"/>);
}

export default App