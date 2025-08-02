// import React from 'react'; // Not strictly needed for functional components unless using hooks or JSX directly in a non-component file
import { Link } from 'react-router-dom'; // Import Link for navigation
import './AboutPage.css'; // Import a CSS file for styling

function AboutPage() {
  return (

      <div className="about-content"> {/* Wrap content in another div */}
        <h1 >About Us</h1>
        <p>We are a company that does awesome things!</p>
        <Link to="/">Go back to Home</Link>
      </div>
  );
}

export default AboutPage;