
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faHistory, faFileAlt,faCamera } from '@fortawesome/free-solid-svg-icons';





const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const jwtToken = localStorage.getItem('accessToken');
  console.log(jwtToken)
  const userEmail = localStorage.getItem('userEmail');
  const profilePictureKey = `profilePicture_${userEmail}`;  // Use userEmail as a key
  const profilePicture = localStorage.getItem(profilePictureKey);
  const [previewUrl, setPreviewUrl] = useState(profilePicture || null);
  const [isHovered, setHovered] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        localStorage.setItem(profilePictureKey, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  

 

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  // Synchronize state on location change
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar">
         
        <div className="user-profile-top">
     
        
        <label htmlFor="profile-picture-input"  className={`camera-icon ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)} >
          <div className="profile-picture-container">
            <img
              src={previewUrl || "/media/default_profile_picture.jpg"}
              alt="Profile"
              className={`profile-picture ${isHovered ? 'blurred' : ''}`}
            />
            
          </div>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <FontAwesomeIcon className='fido'  icon={faCamera} />
        
        </label>
        
      </div>
      <div className="user-info">
        <p>{userEmail}</p>
      </div>
      <nav className='sidebar-nav'>
        <ul>
        <li >
            <Link
              to="/homepage"
              className={`sidebar-link ${activeLink === '/homepage' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/homepage')}
              
            >
              <FontAwesomeIcon className='fonts' icon={faHome} /> Home
            </Link>
          </li>
          <li >
            <Link
              to="/dashboard"
              className={`sidebar-link ${activeLink === '/dashboard' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/dashboard')}
            >
              <FontAwesomeIcon className='fonts' icon={faChartBar} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/historytransaction"
              className={`sidebar-link ${activeLink === '/historytransaction' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/histroyttansaction')}
            >
                   <FontAwesomeIcon className='fonts' icon={faHistory} />History 
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className={`sidebar-link ${activeLink === '/reports' ? 'active-link' : ''}`}
              onClick={() => handleLinkClick('/reports')}
            >
               <FontAwesomeIcon className='fonts' icon={faFileAlt} /> Reports
            </Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
      <button className="btn btn-danger" style={{marginTop:'10px',marginRight:'20px'}} onClick={handleLogout}>
        Logout
      </button>
      <div className="sidebar-bottom">
        <p>Expense Forge</p>
      </div>
    </div>
  );
};

export default Sidebar;

