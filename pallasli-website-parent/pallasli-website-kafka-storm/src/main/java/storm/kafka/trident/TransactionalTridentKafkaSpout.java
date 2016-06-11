package storm.kafka.trident;

import java.util.Map;
import java.util.UUID;

import org.apache.storm.task.TopologyContext;
import org.apache.storm.trident.spout.IPartitionedTridentSpout;
import org.apache.storm.tuple.Fields;

import storm.kafka.Partition;

public class TransactionalTridentKafkaSpout
		implements IPartitionedTridentSpout<GlobalPartitionInformation, Partition, Map> {

	TridentKafkaConfig _config;
	String _topologyInstanceId = UUID.randomUUID().toString();

	public TransactionalTridentKafkaSpout(TridentKafkaConfig config) {
		_config = config;
	}

	@Override
	public IPartitionedTridentSpout.Coordinator getCoordinator(Map conf, TopologyContext context) {
		return new storm.kafka.trident.Coordinator(conf, _config);
	}

	@Override
	public IPartitionedTridentSpout.Emitter getEmitter(Map conf, TopologyContext context) {
		return new TridentKafkaEmitter(conf, context, _config, _topologyInstanceId).asTransactionalEmitter();
	}

	@Override
	public Fields getOutputFields() {
		return _config.scheme.getOutputFields();
	}

	@Override
	public Map<String, Object> getComponentConfiguration() {
		return null;
	}
}