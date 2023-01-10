import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import './Background.css';

import ID from '../Image/ID.png';
import PW from '../Image/PW.png';

// 배경화면을 꽉 채워주기 위한 divx태그입니다
const Background = styled.div`
  width: 100vw;
  height: 100vh;
`;

// 회원가입 Text를 감싸줍니다
const TextWrap = styled.div`
  text-align: center; /*"회원가입"을 가운데 정렬시켜줍니다*/
  @media screen and (max-width: 63rem) {
    display: none; /*화면이 작아지면 "회원가입 글씨를 사라지게 합니다"*/
  }
`;

// "회원가입"div 태그입니다
const RegText = styled.div`
  display: flex;
  font-size: 2.5rem;
  font-weight: 800;
  display: inline-block;
  margin-bottom: 3rem;
`;

// 스케치북 안에 있는 모든 요소들을 감싸줍니다
const KeysWrap = styled.div`
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  @media screen and (max-width: 63rem) {
    top: 55%;
  }
`;

// 아이디, 패스워드, 이메일, 닉네임을 "props"로 바꿔가면서 재사용할 수 있음
const KeyWrap = styled.div`
  width: 45rem;
  height: 3.1rem;
  border-radius: ${props => props.border};
  background: #fff;
  border-width: 0.063rem;
  border-color: #000;
  box-shadow: 0rem 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25);
  display: flex;
  margin-bottom: 1rem;
  /*화면이 작아지면 크기를 작게하고 겉에 radius속성을 없애줍니다*/
  @media screen and (max-width: 63rem) {
    width: 37.5rem;
    height: 3.125rem;
    border-radius: 0;
  }
`;

// Icon 태그입니다
const IconImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  text-align: center;
  display: flex;
  margin: auto 1rem auto 1rem;
`;

// 회원가입 버튼
const SignupBtn = styled.button`
  width: 16.25rem;
  height: 2.813rem;
  border-radius: 0.813rem;
  background: #3a3a3a;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  display: block;
  margin: 3rem auto 1.2rem;
`;

// 로그인 버튼
const LoginBtn = styled.button`
  width: 4.438rem;
  height: 1.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: 2rem;
  display: block;
  margin: 0rem auto 0rem;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('이메일 형식을 지켜주세요')
    .required('비어있습니다!'),
  password: Yup.string().required('비어있습니다!'),
});

function Register() {
  const navigate = useNavigate();
  const submit = async values => {
    const { email, password } = values;
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8080/api/v1/users/login',
        {
          email,
          password,
        },
      );
      toast.success(<h3>로그인 성공😎</h3>, {
        position: 'top-center',
        autoClose: 2000,
      });
      console.log(data);
      localStorage.clear();
      localStorage.setItem('id', data.user_id);
      setTimeout(() => {
        navigate('/welcome');
      }, 1000);
    } catch (e) {
      // 서버에서 받은 에러 메시지 출력
      toast.error(`${e.response.data.message} 😭`, {
        position: 'top-center',
      });
    }
  };
  return (
    <div className="login">
      <Background>
        <KeysWrap>
          <TextWrap>
            <RegText>로그인</RegText>
          </TextWrap>
          <Formik
            initialValues={{
              email: '',
              password: '',
              passwordcheck: '',
              nickname: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={submit}
          >
            {({ touched, errors, values, handleSubmit, handleChange }) => (
              <div>
                <ToastContainer />
                <Form onSubmit={handleSubmit}>
                  <KeyWrap border="0.938rem 0.938rem 0 0">
                    <IconImg src={ID} alt="" />
                    <Field
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      type="email"
                      placeholder="이메일"
                    />
                  </KeyWrap>
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="invalid-feedback"
                  />
                  <KeyWrap border="0 0 0.938rem 0.938rem">
                    <IconImg src={PW} alt="" />
                    <Field
                      type="password"
                      name="password"
                      placeholder="비밀번호"
                      value={values.password}
                      onChange={handleChange}
                      className={`form-control ${
                        touched.password && errors.password ? 'is-invalid' : ''
                      }`}
                    />
                  </KeyWrap>
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="invalid-feedback"
                  />

                  <ErrorMessage component="div" name="nickname" />
                  <SignupBtn type="submit">로그인</SignupBtn>
                </Form>
                <LoginBtn onClick={() => navigate('/register')}>
                  회원가입
                </LoginBtn>
              </div>
            )}
          </Formik>
        </KeysWrap>
      </Background>
    </div>
  );
}

export default Register;
