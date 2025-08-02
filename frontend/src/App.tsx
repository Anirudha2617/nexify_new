// App.tsx
import { BrowserRouter as Router, Route, Routes , Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Login from './pages/loginpage';
import LandingPage from './pages/LandingPage';
import './pages/css/base.css';
// import './pages/css/NavBarBubble.css'; // New: Import the bubble styling
// import NotFoundPage from './pages/NotFoundPage'; // Optional: for 404 errors

function App() {
  return (
    <Router>

      <div className='page-container'>
      <nav className="bubble-nav"> {/* Added class here */}
        <Link to="/home" className="bubble-link">Home</Link>
        <Link to="/about" className="bubble-link">About</Link>
        <Link to="/login" className="bubble-link">Login</Link>
        <Link to="/" className="bubble-link">Landing Page</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        {/* Make sure NotFoundPage is defined or imported if you want to use it */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
    </Router>
  );
}

// Optional: src/pages/NotFoundPage.js
function NotFoundPage() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
}


export default App;