import Header from "./components/Header";
import Cards from "./components/Cards";
import AddBook from "./components/AddBook";
import {Route, Routes} from 'react-router-dom'
import Detail from "./components/Detail";
import { createContext, useEffect, useState } from "react";
import Login from './components/Login'
import Sighup from './components/Signup'

const Appstate=createContext();

function App() {
  const [login, setLogin]= useState(false);
  const [userName, setUserName]= useState("");

  return (
    <Appstate.Provider value={{login,userName, setLogin, setUserName}}>
    <div className="App relative">
      <header className="App-header">
        <Header/>
        <Routes>
          <Route path="/" element={<Cards/>}/>
          <Route path="/addbook" element={<AddBook/>}/>
          <Route path="/detail/:id" element={<Detail/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Sighup/>}/>
        </Routes>
      </header>
    </div>
    </Appstate.Provider>
  );
}

export default App;
export {Appstate}
