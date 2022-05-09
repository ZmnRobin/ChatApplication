import React from 'react';

import icon from '../../Icon/chat-icon.png';
import './InfoBar.css';

export default function InfoBar({room}) {
  return (
    <div className="infoBar">
        <div className="leftInnerContainer">
            {/* <img className="onlineIcon" src={icon} alt="online icon" /> */}
        <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
        {/* <a href="/"><img src={icon} alt="close icon" /></a> */}
        </div>
    </div>
  )
}
