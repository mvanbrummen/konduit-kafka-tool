const { Kafka, ConfigResourceTypes } = require('kafkajs');
const {
  AssignerProtocol: { MemberAssignment, MemberMetadata },
} = require('kafkajs');
const regeneratorRuntime = require('regenerator-runtime');

module.exports = class KafkaWrapper {
  constructor(connections) {
    this._kafkas = {};
    this._admins = {};
    this._consumers = {};
    this._producers = {};

    this._connections = connections;
  }

  _addConn(name, connection) {
    const kafka = new Kafka({
      brokers: connection.brokers.split(','),
    });

    const admin = kafka.admin();

    const consumer = kafka.consumer({ groupId: 'konduit-client' });

    const producer = kafka.producer();

    this._kafkas[name] = kafka;
    this._admins[name] = admin;
    this._consumers[name] = consumer;
    this._producers[name] = producer;
  }

  addConnection(connection) {
    this._connections = {
      ...this._connections,
      ...connection,
    };
    Object.keys(connection).map((conn) => {
      this._addConn(conn, connection[conn]);
    });
  }

  async consumeFromTopic(connectionName, topicName, eachMessage) {
    const consumer = this._consumers[connectionName];
    consumer.connect();

    await consumer.subscribe({ topic: topicName });
    await consumer.connect();

    await consumer.run({
      eachMessage: eachMessage,
    });
  }

  // TODO doesnt work??
  async pauseConsumeFromTopic(connectionName, topic) {
    const consumer = this._consumers[connectionName];
    consumer.connect();
    try {
      console.log('Pausing consume from ' + topic);
      consumer.pause([{ topic: topic }]);
    } catch (err) {
      console.log(err);
    }
  }

  _getProducer(connectionName) {
    if (!(connectionName in this._producers)) {
      this._addConn(connectionName, this._connections[connectionName]);
    }
    return this._producers[connectionName];
  }

  async produceToTopic(connectionName, topicName, message) {
    const producer = this._getProducer(connectionName);

    await producer.connect();

    return producer.send({
      topic: topicName,
      messages: [message],
    });
  }

  _getAdmin(connectionName) {
    if (!(connectionName in this._admins)) {
      this._addConn(connectionName, this._connections[connectionName]);
    }
    return this._admins[connectionName];
  }

  async fetchTopics(connectionName) {
    const admin = this._getAdmin(connectionName);

    const topicMeta = await admin.fetchTopicMetadata();

    return topicMeta.topics.sort((a, b) => a.name.localeCompare(b.name));
  }

  async fetchTopicMetadata(connectionName, topicName) {
    const admin = this._getAdmin(connectionName);
    return admin.fetchTopicMetadata({ topics: [topicName] });
  }

  async fetchClusterTotals(connectionName) {
    const admin = this._getAdmin(connectionName);
    const topics = await admin.listTopics();
    const consumers = await admin.listGroups();
    const cluster = await admin.describeCluster();

    return {
      total_topics: topics.length,
      total_consumers: consumers.groups.length,
      total_brokers: cluster.brokers.length,
    };
  }

  async fetchBrokerConfiguration(connectionName, broker) {
    const admin = this._getAdmin(connectionName);
    return admin.describeConfigs({
      includeSynonyms: false,
      resources: [
        {
          type: ConfigResourceTypes.BROKER,
          name: broker,
        },
      ],
    });
  }

  async fetchTopicConfiguration(connectionName, topicName) {
    const admin = this._getAdmin(connectionName);
    return admin.describeConfigs({
      includeSynonyms: false,
      resources: [
        {
          type: ConfigResourceTypes.TOPIC,
          name: topicName,
        },
      ],
    });
  }

  async createTopic(connectionName, topicName) {
    const admin = this._getAdmin(connectionName);
    return admin.createTopics({
      topics: [
        {
          topic: topicName,
        },
      ],
    });
  }

  async fetchConsumersForTopic(connectionName, topicName) {
    const groups = await this.fetchConsumers(connectionName);

    const f = (it) => {
      const topics = it.members.flatMap((m) => {
        const memberMetadataBuffer = m.memberMetadata;

        const metadata = MemberMetadata.decode(memberMetadataBuffer);

        return metadata.topics;
      });

      return {
        groupId: it.groupId,
        topics: topics,
      };
    };
    const consumerTopics = (await groups)
      .filter((it) => it.members.length > 0)
      .map(f)
      .filter((it) => {
        return it.topics.includes(topicName);
      });

    return consumerTopics;
  }

  async fetchBrokers(connectionName) {
    const admin = this._getAdmin(connectionName);
    return admin.describeCluster();
  }

  async fetchConsumerMembers(connectionName, consumerName) {
    const admin = this._getAdmin(connectionName);
    const groupDescription = await admin.describeGroups([consumerName]);

    const members = groupDescription.groups.flatMap((g) => {
      return g.members.map((m) => ({
        clientId: m.clientId,
        memberId: m.memberId,
        clientHost: m.clientHost,
        memberAssignments: MemberAssignment.decode(m.memberAssignment),
      }));
    });

    return members;
  }

  async fetchConsumerTopics(connectionName, consumerName) {
    const admin = this._getAdmin(connectionName);
    const groupDescription = await admin.describeGroups([consumerName]);

    const topics = groupDescription.groups.flatMap((g) => {
      return g.members.flatMap((m) => {
        const assignments = MemberAssignment.decode(
          m.memberAssignment
        ).assignment;

        console.log(assignments);

        const topics = Object.keys(assignments);

        return topics.flatMap((t) => {
          const partitions = assignments[t];

          return partitions.map((p) => {
            return {
              topic: t,
              partition: p,
              clientHost: m.clientHost,
            };
          });
        });
      });
    });

    return topics;
  }

  async fetchConsumers(connectionName) {
    const admin = this._getAdmin(connectionName);
    const groups = await admin.listGroups();

    const groupIds = groups.groups.map((g) => g.groupId);

    return (await admin.describeGroups(groupIds)).groups.sort((a, b) =>
      a.groupId.localeCompare(b.groupId)
    );
  }

  async deleteTopic(connectionName, topicName) {
    const admin = this._getAdmin(connectionName);
    return admin.deleteTopics({
      topics: [topicName],
    });
  }

  async deleteConsumer(connectionName, consumerName) {
    const admin = this._getAdmin(connectionName);
    return admin.deleteGroups([consumerName]);
  }
};
