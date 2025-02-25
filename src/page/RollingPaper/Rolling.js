/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';
import { FcExpand, FcCancel } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Loading from '../../component/Loading';

import image1 from '../../assets/image/image1.png';
import image2 from '../../assets/image/image2.png';
import image3 from '../../assets/image/image3.png';
import image4 from '../../assets/image/image4.png';
import image5 from '../../assets/image/image5.png';
import PhotoModal from '../PhotoModal';
import Memo from './RollingMemo';
import Sticky from './RollingSticky';
import Photo from './RollingPhoto';
import NewMemo from './newMemo';
import NewSticky from './NewSticky';
import NewPhoto from './NewPhoto';

import pencilicon from '../../assets/image/pencilicon.png';
import galleryicon from '../../assets/image/galleryicon.png';
import memoicon from '../../assets/image/memoicon.svg';
import usericon from '../../assets/image/usericon.png';
import StickerModal from '../StickerModal';
import 'react-toastify/dist/ReactToastify.css';

import userback from '../../assets/image/userbackimg.png';

import '../../style/snow.css';

import KakaoShare from '../../component/KakaoShare';

const backBaseUrl = process.env.REACT_APP_BACKEND_URL;

const SketchBookImg = styled.div`
  background-repeat: no-repeat;
  width: 95rem;
  background-image: url(${props => props.bgimage});
  margin: 0 auto;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* background-position: center; */
`;

const AllWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  width: 100%;
  z-index: 50;
`;
const MyPageBtn = styled.button`
  margin: 2% 7% 0 auto;
  z-index: 50;
  height: 4rem;
  display: block;
  width: 12rem;
  font-size: 40px;
  font-weight: 700;
  font-family: 'Cafe24Ssurround';
  color: white;
  text-shadow: 2px 2px 1.5px gray;
  -webkit-text-stroke-width: 1.2px;
  -webkit-text-stroke-color: black;
`;
const Text = styled.div`
  margin: 0 auto;
  height: 3rem;
  margin-top: -1rem;
  color: whitesmoke;
  text-align: center;
  font-size: 50px;
  font-weight: 700;
  font-family: 'Cafe24Ssurround';
  z-index: 999;
  text-shadow: 2px 2px 1.7px gray;
  -webkit-text-stroke-width: 1.2px;
  -webkit-text-stroke-color: black;
`;

const UserWrap = styled.div`
  margin: 1rem 5rem auto auto;
  /* height: 10rem; */
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${userback});
  background-size: 17rem;
  background-repeat: no-repeat;
  width: 9rem;
  height: 5rem;
  z-index: 10000;
  /* background-color: red; */
  background-position: center;
  /* z-index: 100; */
`;
const UserIcon = styled.img`
  width: 1.8rem;
  height: 1.8rem;
`;
const UserNum = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 4rem;
  margin-left: 1rem;
  text-align: center;
  color: #ffffff;
`;

const MemoWrap = styled.div`
  height: 50rem;
  width: 80rem;
  margin: 0 auto;
`;

const IconBtn = styled.button`
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  z-index: 10000;
`;

const KakaoIconWrap = styled.div`
  background: #292c33;
  border-radius: 100px;
  padding: 0.2rem;
  margin-top: 1rem;
  /* width: 12rem; */
  text-align: center;
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Container = styled.div`
  //메모가 움직이는 영역입니다.
  height: 61rem;
  width: 90rem; // 배경과 같은 너비
  position: absolute;
`;

const SaveBtn = styled.button`
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  z-index: 50;
`;

const CancelBtn = styled.button`
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  z-index: 50;
`;

const KakaoBtnWrap = styled.div`
  position: fixed;

  /* width: 12rem; */
  text-align: center;
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1000;
  right: 3%;
  bottom: 5%;
  transform: translate(0%, 0%);
`;

const IconWrap = styled.div`
  background: #292c33;
  position: fixed;
  border-radius: 100px;
  padding: 0.2rem;
  margin-top: 1rem;
  /* width: 12rem; */
  text-align: center;
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  right: 3%;
  bottom: 5%;
  transform: translate(0%, 0%);
`;

//

// const [background, setBackground] = useState();

function Rolling() {
  const [rawLog, setRawLog] = useState();

  const location = useLocation();
  const navigate = useNavigate();
  const [backgroundImg, setBackgroundImg] = useState();
  function bgimage(paperUrl) {
    if (paperUrl === '1') {
      setBackgroundImg(image1);
    } else if (paperUrl === '2') {
      setBackgroundImg(image2);
    } else if (paperUrl === '3') {
      setBackgroundImg(image3);
    } else if (paperUrl === '4') {
      setBackgroundImg(image4);
    } else if (paperUrl === '5') {
      setBackgroundImg(image5);
    }
  }

  const paperId = location.pathname.slice(9); // 이거 url에서 paperId를 가져옴
  // 모달창
  const [coor, setCoor] = useState({}); // x좌표 y좌표 저장하는 상태
  const [isPhotoOpen, setIsPhotoOpen] = useState(false); // 사진 모달창이 열려있는가?
  const [isStickyOpen, setIsStickyOpen] = useState(false); // 스티커 모달창이 열려있는가?
  const [isMemo, setIsMemo] = useState(false); // 메모지 수정중인가?
  const [isSticky, setIsSticky] = useState(false); // 스티커 수정중인가?
  const [isPhoto, setIsPhoto] = useState(false); // 사진 수정중인가?
  const [isActive, setIsActive] = useState(false); // 스티커, 사진, 메모지가 수정중인지 확인
  const [sticky, setSticky] = useState(); // 스티커 ID저장
  const [skickyUrl, setStickyUrl] = useState(); // 스티커 주소 저장
  const [photo, setPhoto] = useState();
  const [deleteAction, setDeleteAction] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [memoData, setMemoData] = useState({});
  const [items, setItems] = useState([]); // 화면에 스티커들 get으로 받아오기 위한 item
  const [length, setLength] = useState(); // 스티커, 메모, 사진의 개수를 더해서 저장해줌

  const dataApi = async () => {
    try {
      const item = await axios.get(`${backBaseUrl}/api/v1/papers/${paperId}/`);
      // ###관리자로 로그인 돼있을 경우 IsAdmin활성화!#######
      if (item.data.user === localStorage.getItem('id')) {
        setIsAdmin(true);
      }
      // /###########################
      setItems(item.data);
      setLength(
        item.data.memo.length +
          item.data.image.length +
          item.data.sticker.length,
      );
    } catch (e) {
      // 서버에서 받은 에러 메시지 출력
    }
  };

  useEffect(() => {
    const polling = setInterval(() => {
      dataApi();
    }, 2000);

    // 페이지에 벗어날 경우 polling X
    return () => {
      clearInterval(polling);
    };
  }, []);

  useEffect(() => {
    // 로컬에 ###메모지#### 내용이 들어있으면
    if (localStorage.getItem('textcase') !== null) {
      setIsMemo(true);
      setIsActive(true);
      const textcaseString = localStorage.getItem('textcase');
      const textcase = JSON.parse(textcaseString);
      setMemoData({
        content: textcase.textcase.content,
        nickname: textcase.textcase.nickname,
        font: textcase.textcase.font,
        password: textcase.textcase.password,
        color: textcase.textcase.color,
        font_color: textcase.textcase.fontColor,
      });
      localStorage.removeItem('textcase');
    }
  }, []);

  useEffect(() => {}, [memoData]);
  const openPhotoModal = useCallback(() => setIsPhotoOpen(true), []); // 사진 모달창 열기
  const closePhotoModal = useCallback(() => setIsPhotoOpen(false), []); // 사진 모달창 닫기
  const openStickyModal = useCallback(() => setIsStickyOpen(true), []); // 스티커 모달창 열기
  const closeStickyModal = useCallback(() => setIsStickyOpen(false), []); // 스티커 모달창 닫기

  // 모달창 열면 메모지로 이동
  const openMemo = useCallback(() => {
    localStorage.removeItem('paperId');
    localStorage.setItem('paperId', paperId);
    navigate('/Memo');
  }, []);

  const HandleMemoDelete = useCallback(id => {
    axios
      .post(`${backBaseUrl}/api/v1/papers/memos/${id}`, {
        password: '1',
      })
      .then(() => {
        setDeleteAction(true);
      });
  }, []);
  const HandleStickyDelete = useCallback(id => {
    axios
      .post(`${backBaseUrl}/api/v1/papers/stickers/${id}`, {
        password: '1',
      })
      .then(() => {
        setDeleteAction(true);
      });
  }, []);

  const HandlePhotoDelete = useCallback(id => {
    axios
      .post(`${backBaseUrl}/api/v1/papers/images/${id}`, {
        password: '1234',
      })
      .then(() => {
        setDeleteAction(true);
      });
  }, []);

  // post로 ###메모지### 최종좌표, 위치, 색, 폰트 등을 백엔드로 보내준다
  const submitMemo = async a => {
    if (a) {
      // 취소 버튼을 눌렀을 경우
      setIsMemo(false); // 메모기능 비활성화
      setIsActive(false); // 수정기능 비활성화
      // setIsCancel(false);
      return;
    }

    try {
      await axios.post(
        `${backBaseUrl}/api/v1/papers/${paperId}/memos`,
        memoData,
      );

      setIsMemo(false); // 메모기능 비활성화
      setIsActive(false); // 수정기능 비활성화
    } catch (e) {
      // 서버에서 받은 에러 메시지 출력
    }
  };

  const submitSticky = async a => {
    try {
      if (a) {
        // 취소 버튼을 눌렀을 경우
        setIsSticky(false); // 스티커기능 비활성화
        setIsActive(false); // 수정기능 비활성화
        return;
      }
      await axios.post(`${backBaseUrl}/api/v1/papers/${paperId}/stickers`, {
        default_sticker_id: sticky,
        password: '1',
        xcoor: coor.x,
        ycoor: coor.y,
        rotate: 30,
      });

      setIsSticky(false); // 스티커 기능 비활성화
      setIsActive(false); // 수정 기능 비활성화
    } catch (e) {
      // 서버에서 받은 에러 메시지 출력
    }
  };

  const submitPhoto = a => {
    if (a) {
      // 취소 버튼을 눌렀을 경우
      setIsPhoto(false); // 사진기능 비활성화
      setIsActive(false); // 수정기능 비활성화
      setPhoto('');
      HandlePhotoDelete(photo.image_id);
      return;
    }
    // if (photo === '') {
    //   setIsPhoto(false); // 사진기능 비활성화
    //   setIsActive(false); // 수정기능 비활성화
    // }

    setLoading(true);

    axios
      .post(`${backBaseUrl}/api/v1/papers/${paperId}/xyphotos`, {
        image_id: photo.image_id,
        password: '1234',
        xcoor: coor.left2,
        ycoor: coor.top2,
        rotate: coor.rotate2,
        width: coor.width2,
        height: coor.height2,
      })
      .then(() => {
        setIsPhoto(false); // 사진 기능 비활성화
        setIsActive(false); // 수정 기능 비활성화
        setPhoto('');
        setLoading(false);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  useEffect(() => {
    const getMemos = async () => {
      try {
        const item = await axios.get(
          `${backBaseUrl}/api/v1/papers/${paperId}/`,
        );
        // ###관리자로 로그인 돼있을 경우 IsAdmin활성화!#######
        if (item.data.user === localStorage.getItem('id')) {
          setIsAdmin(true);
        }
        // /###########################
        setItems(item.data);
        setLength(
          item.data.memo.length +
            item.data.image.length +
            item.data.sticker.length,
        );
        bgimage(item.data.paper_url);
      } catch (e) {
        // 서버에서 받은 에러 메시지 출력
      }
      setDeleteAction(false);
    };
    getMemos();
  }, [isActive, deleteAction]);

  const parentFunction = positon => {
    setCoor(positon);
  };

  // 스티커?메모지?사진? 확인해주고 어떤 것이 새로 생겨서 움직일 것인지 정해주는 함수
  function isItem() {
    return isMemo ? (
      <NewMemo setCoor={setCoor} setMemoData={setMemoData} list={memoData} />
    ) : isSticky ? (
      <NewSticky
        setCoor={setCoor}
        setMemoData={setMemoData}
        skickyUrl={skickyUrl}
      />
    ) : isPhoto ? (
      <NewPhoto
        parentFunction={parentFunction}
        photo={photo}
        rawLog={rawLog}
        setRawLog={setRawLog}
      />
    ) : (
      <div />
    );
  }

  // 스티커?메모지?사진? 확인해주고 저장할때 어떤 post를 보낼지 정해주는 함수
  function isSubmit(a) {
    return isMemo ? (
      submitMemo(a)
    ) : isSticky ? (
      submitSticky(a)
    ) : isPhoto ? (
      submitPhoto(a)
    ) : (
      <div />
    );
  }
  return (
    <SketchBookImg className="snow" bgimage={backgroundImg}>
      <Snowfall />
      {loading ? (
        <Loading />
      ) : (
        <AllWrap>
          <Container>
            {items.memo &&
              items.memo.map(list => {
                return (
                  <Memo
                    isAdmin={isAdmin}
                    list={list}
                    key={list.memo_id}
                    HandleMemoDelete={HandleMemoDelete}
                  />
                );
              })}
            {items.sticker &&
              items.sticker.map(list => {
                return (
                  <Sticky
                    isAdmin={isAdmin}
                    list={list}
                    key={list.sticker_id}
                    HandleStickyDelete={HandleStickyDelete}
                  />
                );
              })}
            {items.image &&
              items.image.map(list => {
                return (
                  <Photo
                    isAdmin={isAdmin}
                    list={list}
                    key={list.image_id}
                    HandlePhotoDelete={HandlePhotoDelete}
                  />
                );
              })}
            {isItem()}
          </Container>
          {isAdmin ? (
            <MyPageBtn onClick={() => navigate('/mypage')}>
              마이페이지
            </MyPageBtn>
          ) : (
            <MyPageBtn onClick={() => navigate('/')}>홈으로</MyPageBtn>
          )}

          <Text>TO. {items.title}</Text>
          <UserWrap bgimage={userback}>
            <UserIcon src={usericon} alt="" />
            <UserNum>{length}</UserNum>
          </UserWrap>
          <MemoWrap />
          {isActive ? (
            <IconWrap height="8rem">
              <SaveBtn
                onClick={() => {
                  isSubmit();
                }}
              >
                <FcExpand size="30" />
              </SaveBtn>
              <CancelBtn
                onClick={() => {
                  isSubmit(true);
                }}
              >
                <FcCancel size="30" />
              </CancelBtn>
            </IconWrap>
          ) : (
            <KakaoBtnWrap>
              <KakaoShare />
              <KakaoIconWrap height="10rem">
                <IconBtn onClick={openMemo}>
                  <img src={pencilicon} alt="" />
                </IconBtn>
                <PhotoModal
                  isOpen={isPhotoOpen}
                  closeModal={closePhotoModal}
                  setIsActive={setIsActive}
                  setIsPhoto={setIsPhoto}
                  setPhoto={setPhoto}
                  setLoading={setLoading}
                />
                <IconBtn
                  type="button"
                  value="Open modal"
                  onClick={openPhotoModal}
                >
                  <img src={galleryicon} alt="" />
                </IconBtn>
                <StickerModal
                  isOpen={isStickyOpen}
                  closeModal={closeStickyModal}
                  setSticky={setSticky}
                  setStickyUrl={setStickyUrl}
                  setIsActive={setIsActive}
                  setIsSticky={setIsSticky}
                />
                <IconBtn
                  type="button"
                  value="Open modal"
                  onClick={openStickyModal}
                >
                  <img src={memoicon} alt="" />
                </IconBtn>
              </KakaoIconWrap>
            </KakaoBtnWrap>
          )}
        </AllWrap>
      )}
    </SketchBookImg>
  );
}

export default Rolling;
