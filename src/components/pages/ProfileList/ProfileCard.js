import React, { useState } from 'react';
import './profileList.scss';
import ReactCardFlip from 'react-card-flip';
import CardFront from './CardFront';
import CardBack from './CardBack';

function ProfileCard(props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container">
      <ReactCardFlip isFlipped={isFlipped} flipDirection={'vertical'}>
        <CardFront item={props.item} handleClick={handleClick} />
        <CardBack handleClick={handleClick} />
      </ReactCardFlip>
    </div>
  );
}

export default ProfileCard;
