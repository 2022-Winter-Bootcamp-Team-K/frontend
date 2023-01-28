/* eslint-disable react/style-prop-object */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Modal from './Login';
// import HandMotion from './handMotion';
import './welcome.css';
import './button.css';

import OnLog from './Onlog';
import Outlog from './Outlog';

import background from '../Image/welcome1.png';
import logo from '../Image/newlogo.png';
import back from '../Image/welcome3.png';

const SketchbookImg = styled.div`
  height: 70rem;
  background-size: 50rem 39rem;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${logo});
  display: flex;
  /* margin-top: 20rem; */
  background-position-y: 4rem;
`;
const BackImg = styled.div`
  height: 70rem;
  background-color: lightpink;
  background-size: 90rem 55rem;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${back});
  display: flex;
  /* margin-top: 20rem; */
  background-position-y: 12rem;
`;

const AllWrap = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  z-index: -1;
  background-color: #fcedb0;
  position: fixed;
  background-image: url(${background});
`;

const StartWrap = styled.div`
  display: flex;
  margin: auto auto 22rem auto;
`;
// const PencilImg = styled.img`
//   width: 3.6rem;
//   height: 3rem;
//   margin-top: 0.5rem;
//   // 스캐치북 위에 올리기
// `;

const StartBtn = styled.button`
  width: 30rem;
  height: 3.5rem;
  border-radius: 1rem;
  font-size: 2.5rem;
  font-weight: 800;

  font-family: 'Cafe24Ssurround';
  text-shadow: 2px 2px 1.5px gray;
`;
const $topBtn = document.querySelector('.moveTopBtn');

$topBtn.onclick = () => {
  window.scrollTo({ top: 1500, behavior: 'smooth' });
};

function Welcome() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const [logState, setLogState] = useState();
  useEffect(() => {
    setLogState(localStorage.getItem('id'));
  }, [logState]);

  const onClick = () => {
    localStorage.clear();
    setLogState(null);
  };

  const onClick2 = () => {
    if (localStorage.getItem('id') === null) {
      openModal();
      return;
    }
    navigate('../makeRolling');
  };

  return (
    <div className="welcome">
      <AllWrap />
      {logState === null ? (
        <OnLog setLogState={setLogState} />
      ) : (
        <Outlog onClick={onClick} />
      )}

      <SketchbookImg src={logo}>
        <StartWrap>
          {/* <HandMotion /> */}
          <StartBtn onClick={onClick2}>
            <button type="button" className="learn-more">
              시작하기
            </button>
          </StartBtn>
          <button type="button" className="moveTopBtn">
            {' '}
          </button>
        </StartWrap>
      </SketchbookImg>
      <BackImg src={back}> </BackImg>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} setLogState={setLogState} />
    </div>
  );
}

export default Welcome;
