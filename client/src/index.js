import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css';
import App from './App';
import Home from './routes/home'
import Login from './routes/login'
import Registration from './routes/registration'
import About from './routes/about';
import Account from './routes/account'
import reportWebVitals from './reportWebVitals';
import store from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='account' element={<Account />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>404 - There is nothing here!</p>
              </main>
            }
          />
        </Route>
        <Route path='/login' element={<Login />}/>
        <Route path='/registration' element={<Registration />}/>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
