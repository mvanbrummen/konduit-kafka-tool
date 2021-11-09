import React, { useEffect, useState } from 'react';
import AppBarDrawer from '../components/AppBarDrawer';
import { useLocation, useParams } from 'react-router';
import TopicDetails from '../components/topics/TopicDetails';
import BrokersDetails from 'renderer/components/brokers/BrokersDetails';

export default function BrokersDetailsContainer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const { brokerId } = useParams();
  const { search } = useLocation();

  const tab = parseInt(new URLSearchParams(search).get('tab'));

  const [configProperties, setConfigProperties] = useState([]);

  useEffect(() => {
    const f = async () => {
      const brokerConfig = await window.api.fetchBrokerConfiguration(
        currentConnection,
        brokerId
      );

      setConfigProperties(brokerConfig.resources[0].configEntries);
    };

    f().catch((e) => console.log(e));
  }, []);

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      selectedItem="brokers"
      handleFeedbackClick={handleFeedbackClick}
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      children={
        <BrokersDetails
          brokerId={brokerId}
          currentConnection={currentConnection}
          configProperties={configProperties}
          activeTab={tab || 0}
        />
      }
    ></AppBarDrawer>
  );
}
