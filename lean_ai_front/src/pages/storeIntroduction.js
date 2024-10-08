import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../components/loading'; // 로딩 컴포넌트 import
import Chatbot from './chatBotMSG'; // 챗봇 컴포넌트 import
import config from '../../config';


const StoreIntroduce = () => {
  const router = useRouter();
  const { id } = router.query; // URL에서 id 파라미터 가져옴
  const [storeData, setStoreData] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.post(`${config.localhosts}/api/storesinfo/`, {
            store_id: id, // store_id를 POST 요청으로 전송
          });
          setStoreData(response.data);
          setAgentId(response.data.agent_id); // agent_id를 설정
        } catch (error) {
          console.error("Error fetching store data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStoreData();
    }
  }, [id]);

  /*
  // agentId가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    if (agentId) {
      console.log("Agent ID:", agentId);
    }
  }, [agentId]);
  */

  if (isLoading) {
    return <Loading />; // 로딩 중일 때 Loading 컴포넌트를 렌더링
  }

  if (!storeData) {
    return <div>Store not found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-blue-300 border p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-4 mb-2 w-10/12 h-3/6">
        <div className="rounded-lg p-8 w-full max-w-md text-center mb-2 relative">
          <img           src={
            storeData.store_image
              ? `${config.localhosts}${storeData.store_image}`
              : '/testBanner.png'  // store_image가 null인 경우 기본 이미지 사용
          } alt="Store" className="mx-auto mb-4  w-72 h-56 object-contain" />
          <p className="font-bold text-2xl">{storeData.store_name}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center mb-4 min-w-72 pt-3 px-2">
          <p className="mb-4 text-xl whitespace-pre-line ">{storeData.store_hours}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center min-w-72 mb-4 pt-3 px-2">
          <p className="mt-2 mb-4 text-xl whitespace-pre-line ">{storeData.menu_prices}</p>
        </div>
        
        {agentId && <Chatbot agentId={agentId} />} {/* agentId를 Chatbot 컴포넌트에 전달 */}
      </div>
    </div>
  );
};

export default StoreIntroduce;
