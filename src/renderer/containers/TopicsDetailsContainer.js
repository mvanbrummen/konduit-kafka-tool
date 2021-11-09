import React, { useEffect, useState } from 'react';
import AppBarDrawer from '../components/AppBarDrawer';
import { useLocation, useParams } from 'react-router';
import TopicDetails from '../components/topics/TopicDetails';
import ConsumeModal from 'renderer/components/topics/ConsumeModal';
import ProduceModal from 'renderer/components/topics/ProduceModal';

export default function TopicsDetailsContainer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const { topicName } = useParams();
  const { search } = useLocation();

  const tab = parseInt(new URLSearchParams(search).get('tab'));

  const [consumeModalOpen, setConsumeModalOpen] = useState(false);
  const handleConsumeModalClose = () => setConsumeModalOpen(false);
  const handleConsumeModalOpen = () => setConsumeModalOpen(true);

  const [produceModalOpen, setProduceModalOpen] = useState(false);
  const handleProduceModalClose = () => setProduceModalOpen(false);
  const handleProduceModalOpen = () => setProduceModalOpen(true);

  const [topicMetadata, setTopicMetadata] = useState({
    topics: [],
  });

  const [topicConsumers, setTopicConsumers] = useState([]);

  useEffect(() => {
    const f = async () => {
      const consumers = await window.api.fetchConsumersForTopic(
        currentConnection,
        topicName
      );
      setTopicConsumers(consumers);
    };

    f().catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    window.api
      .fetchTopicMetadata(currentConnection, topicName)
      .then((metadata) => {
        setTopicMetadata(metadata);
      });
  }, []);

  const [configProperties, setConfigProperties] = useState([]);

  useEffect(() => {
    window.api
      .fetchTopicConfiguration(currentConnection, topicName)
      .then((c) => {
        setConfigProperties(c.resources[0].configEntries);
      });
  }, []);

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      handleFeedbackClick={handleFeedbackClick}
      selectedItem="topics"
      currentConnection={currentConnection}
      setCurrentConnection={setCurrentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      children={
        <TopicDetails
          topicName={topicName}
          configProperties={configProperties}
          topicConsumers={topicConsumers}
          topicMetadata={topicMetadata}
          activeTab={tab}
          handleConsumeModalOpen={handleConsumeModalOpen}
          handleProduceModalOpen={handleProduceModalOpen}
          readonlyMode={readonlyMode}
          currentConnection={currentConnection}
          produceModal={
            <ProduceModal
              currentConnection={currentConnection}
              topicName={topicName}
              open={produceModalOpen}
              onClose={handleProduceModalClose}
            />
          }
          consumeModal={
            <ConsumeModal
              onClose={handleConsumeModalClose}
              open={consumeModalOpen}
              topicName={topicName}
            />
          }
        />
      }
    ></AppBarDrawer>
  );
}
