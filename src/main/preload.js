const { contextBridge, ipcRenderer, shell } = require('electron');
const Store = require('electron-store');
const KafkaWrapper = require('./kafkawrapper');

const store = new Store({
  projectName: 'konduit',
});

const kafkawrapper = new KafkaWrapper(store.get('connections', {}));

contextBridge.exposeInMainWorld('api', {
  newConnection(connection) {
    const currentConnections = store.get('connections', {});

    store.set('connections', {
      ...currentConnections,
      ...connection,
    });

    kafkawrapper.addConnection(connection);
  },
  getConnections() {
    return store.get('connections', {});
  },
  produceToTopic(connectionName, topicName, message) {
    return kafkawrapper.produceToTopic(connectionName, topicName, message);
  },
  listTopics(connectionName) {
    return kafkawrapper.fetchTopics(connectionName);
  },
  listBrokers(connectionName) {
    return kafkawrapper.fetchBrokers(connectionName);
  },
  listConsumers(connectionName) {
    return kafkawrapper.fetchConsumers(connectionName);
  },
  createTopic(connectionName, topicName) {
    return kafkawrapper.createTopic(connectionName, topicName);
  },
  deleteTopic(connectionName, topicName) {
    return kafkawrapper.deleteTopic(connectionName, topicName);
  },
  fetchTopicMetadata(connectionName, topicName) {
    return kafkawrapper.fetchTopicMetadata(connectionName, topicName);
  },
  fetchTopicConfiguration(connectionName, topicName) {
    return kafkawrapper.fetchTopicConfiguration(connectionName, topicName);
  },
  fetchConsumersForTopic(connectionName, topicName) {
    return kafkawrapper.fetchConsumersForTopic(connectionName, topicName);
  },
  fetchBrokerConfiguration(connectionName, broker) {
    return kafkawrapper.fetchBrokerConfiguration(connectionName, broker);
  },
  async consumeFromTopic(connectionName, topicName) {
    ipcRenderer.send('consume-records', connectionName, topicName);
  },
  consumeFromTopicReply(connectionName, eachMessage) {
    console.log('in consumeFromTopicReply');
    ipcRenderer.on('consume-records-reply', connectionName, eachMessage);
  },
  async pauseConsumeFromTopic(connectoinName, topic) {
    pauseConsumeFromTopic(connectoinName, topic);
  },
  async fetchClusterTotals(connectionName) {
    return kafkawrapper.fetchClusterTotals(connectionName);
  },
  async deleteConsumer(connectionName, consumerName) {
    return kafkawrapper.deleteConsumer(connectionName, consumerName);
  },
  async fetchConsumerMembers(connectionName, groupId) {
    return kafkawrapper.fetchConsumerMembers(connectionName, groupId);
  },
  async fetchConsumerTopics(connectionName, consumerName) {
    return kafkawrapper.fetchConsumerTopics(connectionName, consumerName);
  },
  navigateTo(url) {
    shell.openExternal(url);
  },
});
