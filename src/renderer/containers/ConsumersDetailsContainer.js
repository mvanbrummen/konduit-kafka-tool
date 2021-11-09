import React, { useEffect, useState } from 'react';
import AppBarDrawer from '../components/AppBarDrawer';
import { useLocation, useParams } from 'react-router';
import ConsumerDetails from '../components/consumers/ConsumerDetails';

export default function ConsumersDetailsContainer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const { consumerName } = useParams();
  const { search } = useLocation();

  const [members, setMembers] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const f = async () => {
      const m = await window.api.fetchConsumerTopics(
        currentConnection,
        consumerName
      );
      setTopics(m);
    };

    f().catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const f = async () => {
      const m = await window.api.fetchConsumerMembers(
        currentConnection,
        consumerName
      );

      setMembers(m);
    };

    f().catch((e) => console.log(e));
  }, []);

  const tab = parseInt(new URLSearchParams(search).get('tab'));

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      handleFeedbackClick={handleFeedbackClick}
      selectedItem="consumers"
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      children={
        <ConsumerDetails
          currentConnection={currentConnection}
          members={members}
          topics={topics}
          consumerName={consumerName}
          activeTab={tab}
        />
      }
    ></AppBarDrawer>
  );
}
