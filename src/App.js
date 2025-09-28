
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";


import './App.scss';
import Footer from './Footer/Footer';
import Hero from './Hero/Hero';
import HomePage from './HomePage/HomePage';
import Menu from './Menu/Menu';
import AboutPage from './AboutPage/AboutPage';
import LoginPage from './LoginPage/LoginPage';

function App() {


  const router = createBrowserRouter([
      {
          path: '/',
          element: <HomePage/>
      },
      {
          path: '/about',
          element: <AboutPage/>
      },
      {
          path: '/login',
          element: <LoginPage/>
      }
  ]);

  return (
      <Router>
          <Menu/>
          <Hero/>
          <div className="mainContainer">
              <Routes>
                  <Route path='/about' element={ <AboutPage/> } />
                  <Route path='/login' element= { <LoginPage/> }/>
                  <Route path='/' element= { <HomePage/> } />
              </Routes>
              {/* <RouterProvider router={ router }/> */}

          </div>
          <Footer/>
      </Router>
  );
}

export default App;
