import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="bars-loader">
        <span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .bar {
    position: relative;
    display: inline-block;
    margin: 0 8px;
    width: 10px; /* Increased width */
    height: 50px; /* Increased height */
    border-radius: 0px;
    background: #fff; /* Changed color to white */
    box-shadow: 0 4px 10px rgba(47, 47, 47, 0.3); /* Added box-shadow */
    animation: swing infinite 5s cubic-bezier(0.955, -0.01, 1, 1);
    transform-origin: 100% 100%;
  }

  .bar::before {
    content: "";
    position: absolute;
    z-index: -1;
    bottom: 0;
    display: block;
    width: 10px; /* Updated to match increased width */
    height: 10px;
    background: transparent;
    box-shadow: 0 4px rgba(29, 29, 29, 0.3); /* Updated shadow */
    animation: extend infinite 5s cubic-bezier(0.955, -0.01, 1, 1);
    opacity: 0;
    transform-origin: 0% 0%;
  }

  .bar:nth-child(2),
  .bar:nth-child(2)::before {
    animation-delay: 0.3s;
  }

  .bar:nth-child(3),
  .bar:nth-child(3)::before {
    animation-delay: 0.6s;
  }

  .bar:nth-child(4),
  .bar:nth-child(4)::before {
    animation-delay: 0.9s;
  }

  .bar:nth-child(5),
  .bar:nth-child(5)::before {
    animation-delay: 1.2s;
  }

  .bar:last-of-type {
    animation-name: swing-last;
  }

  .bar:last-of-type::before {
    animation-name: extend-last;
  }

  @keyframes swing {
    10% {
      transform: rotate(70deg);
    }
    60% {
      transform: rotate(70deg);
    }
    70% {
      transform: rotate(0deg);
    }
  }

  @keyframes swing-last {
    10% {
      transform: rotate(90deg);
    }
    60% {
      transform: rotate(90deg);
    }
    70% {
      transform: rotate(0deg);
    }
  }

  @keyframes extend {
    10% {
      transform: rotate(-70deg);
      width: 20px;
      opacity: 1;
      left: 0px;
      bottom: -1px;
    }
    60% {
      transform: rotate(-70deg);
      width: 20px;
      opacity: 1;
    }
    70% {
      width: 10px;
      transform: rotate(0deg);
      opacity: 0;
    }
  }

  @keyframes extend-last {
    10% {
      transform: rotate(-90deg);
      width: 20px;
      height: 2px;
      opacity: 0.5;
      left: 3px;
      bottom: -1px;
    }
    60% {
      transform: rotate(-90deg);
      width: 20px;
      height: 2px;
      opacity: 0.5;
    }
    70% {
      transform: rotate(0deg);
      width: 10px;
      height: 10px;
      opacity: 0;
    }
  }

  .bars-loader {
    position: relative;
    display: block;
    margin: auto;
    padding: 0;
    width: 150px; /* Adjusted loader width */
    height: 50px; /* Adjusted loader height */
    text-align: center;
  }`;

export default Loader;
