import styled, { keyframes } from 'styled-components';

const dance = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4);
    transform-origin: center 100%;
  }
  20% {
    transform: scaleY(1);
  }
`;

export const Loading = styled.div`
  height: 10px;
  width: 100%;
  margin: auto;
  text-align: center;
  font-size: 10px;

  > div {
    display: inline-block;
    background-color: ${(props) => props.theme.secondary};
    height: 100%;
    width: 1px;
    margin-right: 2px;
    animation: ${dance} 1s infinite;
  }

  > div:nth-child(2) {
    animation-delay: -0.4s;
  }

  > div:nth-child(3) {
    animation-delay: -0.6s;
  }

  > div:nth-child(4) {
    animation-delay: -0.5s;
  }

  > div:nth-child(5) {
    animation-delay: -0.2s;
  }

  > span {
    display: inline-block;
    margin-left: 5px;
    color: ${(props) => props.theme.secondary};
  }
`;
