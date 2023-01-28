/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const backBaseUrl = process.env.REACT_APP_BACKEND_URL;

const CartoonBtn = styled.button`
  width: 10rem;
  height: 10rem;
  background-color: red;
  //
`;
// function MyComponent({ taskId }) {
//   const [result, setResult] = useState(null);
//   const [count, setCount] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     if (intervalId === null) {
//       const id = setInterval(async () => {
//         const response = await axios.post(
//           'http://127.0.0.1:8080/api/v1/papers/cartoons/results',
//           { taskId },
//         );
//         // eslint-disable-next-line
//         const data = response.data;
//         setResult(data.status);
//         if (data.status !== 'still working' || count >= 10) {
//           clearInterval(intervalId);
//           setIntervalId(null);
//         }
//         setCount(count + 1);
//       }, 2000);
//       setIntervalId(id);
//     }
//   }, [intervalId, count, taskId]);
//   console.log('result', result);
// }
function Cartoonize({
  files,
  closeModal,
  setIsActive,
  setIsPhoto,
  setPhoto,
  setRawLog,
}) {
  const [imageUrl, setImageUrl] = useState(null);

  async function run1() {
    const formData = new FormData();
    formData.append('image', files[0].file);
    const response = await axios.post(`${backBaseUrl}/api/v1/photos`, formData);
    console.log(response.data);
    const response2 = await axios.post(
      `${backBaseUrl}/api/v1/papers/cartoons`,
      response.data,
    );
    // console.log(response2.data);
    return response2.data;
  }
  function run2(run1Result) {
    let counter = 0;
    const interval = setInterval(() => {
      const datas = axios
        .get(
          `${backBaseUrl}/api/v1/papers/cartoons/results/${run1Result.task_id}`,
        )
        .then(response => {
          /* eslint-disable no-plusplus */
          counter++;
          if (counter >= 10 || response.data.url) {
            console.log('response: ', response.data);
            setImageUrl(response.data.url);
            clearInterval(interval);
          }
        })
        .catch(error => {
          console.log(error);
          clearInterval(interval);
        });
      console.log('datas: ', datas);
    }, 2000);
  }

  const run3 = async () => {
    const run1Result = await run1();
    console.log('2번쨰 데이터 값 ', run1Result.task_id);
    const run2Result = await run2(run1Result);

    await setPhoto(imageUrl);

    await console.log('setPhoto', setPhoto);
    await console.log(1111);
    await console.log(2222);
    await console.log(3333);
    await console.log(4444);

    // await closeModal();
    // await setRawLog(imageUrl);
    // await setIsPhoto(true);
    // await setIsActive(true);
  };
  // console.log('@@@@@', imageUrl);

  const onSubmit = () => {};
  return (
    <CartoonBtn type="button" onClick={onSubmit}>
      <ToastContainer />
    </CartoonBtn>
  );
}

export default Cartoonize;
