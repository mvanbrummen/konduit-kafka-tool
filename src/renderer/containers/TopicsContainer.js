import React, { useEffect, useState } from 'react';
import Topics from '../components/topics/Topics';
import AppBarDrawer from '../components/AppBarDrawer';

export default function TopicsList({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  handleFeedbackClick,
  currentConnection,
  setCurrentConnection,
  readonlyMode,
  setReadonlyMode,
}) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [totalTopics, setTotalTopics] = useState(0);

  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [deleteTopicOpen, setDeleteTopicOpen] = useState(false);

  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const rowsPerPage = 20;

  const [isShowInternal, setIsShowInternal] = useState(false);

  const [deleteTopicName, setDeleteTopicName] = useState('');

  const handleDeleteTopicClose = () => {
    setDeleteTopicOpen(false);
  };

  const handleDeleteTopic = () => {
    window.api.deleteTopic(currentConnection, deleteTopicName); // TODO handle error

    handleDeleteTopicClose();

    // set to first page otherwise could delete and be on an empty page
    setPage(0);
    setTotalTopics(totalTopics - 1);
  };

  const handleOpenSnack = (message) => {
    setSnackMessage(message);
    setShowSnack(true);
  };
  const handleCloseSnack = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnack(false);
  };

  const handleAddTopicOpen = () => {
    setAddTopicOpen(true);
  };
  const handleAddTopicClose = () => {
    setAddTopicOpen(false);
  };

  const handleAddTopicCreate = (topicName) => {
    window.api.createTopic(currentConnection, topicName).then((isSuccess) => {
      if (isSuccess) {
        setTotalTopics(totalTopics + 1);
      } else {
        handleOpenSnack(`Failed to create topic: ${topicName}`);
      }
    });

    setAddTopicOpen(false);
  };

  const handleShowInternalChange = (e) => {
    setIsShowInternal(e.target.checked);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    console.log('use effect');
    window.api.listTopics(currentConnection).then((t) => {
      setTopics(t);
      setTotalTopics(t.length);
      setIsLoading(false);
    });
  }, [totalTopics, refresh]);

  const searchTopics = (searchValue) => {
    if (searchValue.length > 0) {
      setPage(0);
    }
    setSearchFilter(searchValue);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <AppBarDrawer
      open={open}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
      selectedItem="topics"
      handleFeedbackClick={handleFeedbackClick}
      currentConnection={currentConnection}
      readonlyMode={readonlyMode}
      setReadonlyMode={setReadonlyMode}
      setCurrentConnection={setCurrentConnection}
      children={
        <Topics
          searchFilter={searchFilter}
          topics={topics}
          // isShowInternal={isShowInternal}
          isShowInternal={true}
          page={page}
          rowsPerPage={rowsPerPage}
          isLoading={isLoading}
          showSnack={showSnack}
          snackMessage={snackMessage}
          handleCloseSnack={handleCloseSnack}
          handleRefresh={handleRefresh}
          handleShowInternalChange={handleShowInternalChange}
          handleAddTopicOpen={handleAddTopicOpen}
          addTopicOpen={addTopicOpen}
          handleAddTopicClose={handleAddTopicClose}
          handleAddTopicCreate={handleAddTopicCreate}
          deleteTopicName={deleteTopicName}
          deleteTopicOpen={deleteTopicOpen}
          handleDeleteTopicClose={handleDeleteTopicClose}
          handleDeleteTopic={handleDeleteTopic}
          handleChangePage={handleChangePage}
          searchTopics={searchTopics}
          setDeleteTopicName={setDeleteTopicName}
          setDeleteTopicOpen={setDeleteTopicOpen}
          currentConnection={currentConnection}
          readonlyMode={readonlyMode}
        />
      }
    ></AppBarDrawer>
  );
}
