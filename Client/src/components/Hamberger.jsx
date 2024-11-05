import React from 'react';
import styled from 'styled-components';

const Switch = ({ isOpen, toggleMenu }) => {
  return (
    <StyledWrapper>
      <div className="h-10 w-10 ml-2 rounded-full border-2 border-slate-800 flex justify-center items-center backdrop-filter backdrop-blur-3xl">
        <input
          type="checkbox"
          id="checkbox"
          checked={isOpen} // Use isOpen to control checkbox state
          onChange={toggleMenu} // Trigger toggleMenu function on change
        />
        <label htmlFor="checkbox" className="toggle">
          <div className="bars" id="bar1" />
          <div className="bars" id="bar2" />
          <div className="bars" id="bar3" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition-duration: 0.5s;
  }

  .bars {
    width: 100%;
    height: 2px;
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
  }

  #bar2 {
    transition-duration: 0.8s;
  }

  #bar1,
  #bar3 {
    width: 70%;
  }

  #checkbox:checked + .toggle .bars {
    position: absolute;
    transition-duration: 0.5s;
  }

  #checkbox:checked + .toggle #bar2 {
    transform: scaleX(0);
    transition-duration: 0.5s;
  }

  #checkbox:checked + .toggle #bar1 {
    width: 100%;
    transform: rotate(45deg);
    transition-duration: 0.5s;
  }

  #checkbox:checked + .toggle #bar3 {
    width: 100%;
    transform: rotate(-45deg);
    transition-duration: 0.5s;
  }

  #checkbox:checked + .toggle {
    transition-duration: 0.5s;
    transform: rotate(180deg);
  }
`;

export default Switch;