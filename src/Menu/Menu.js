import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <nav role="navigation" aria-label="Main menu" itemScope itemType="https://schema.org/SiteNavigationElement">
      <ul>
        <li><Link to="/">HomePage</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
