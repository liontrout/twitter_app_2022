import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navigation({userObj}) {
  return (
    <nav>
      <ul style={{display: "flex", justifyContent: "center", marginTop: 50}}>
        <li>
          <Link to={'/'} style={{marginRight: 10}}>
            <FontAwesomeIcon icon="fa-brands fa-twitter" color={"#04aaff"} size="2x" />
          </Link>
        </li>
        <li>
          <Link to={'/profile'} style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 10, fontSize: 12}}>
            {userObj.photoURL && (
              <img src={userObj.photoURL} alt='' width='30' height='30' style={{borderRadius: 10}} />
            )}
            <span style={{marginTop: 10}}>
              {userObj.displayName ? `${userObj.displayName}의 Profile` : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;