package storm.kafka;

import java.util.Arrays;
import java.util.List;

import org.apache.storm.spout.SchemeAsMultiScheme;

public class KeyValueSchemeAsMultiScheme extends SchemeAsMultiScheme {

	public KeyValueSchemeAsMultiScheme(KeyValueScheme scheme) {
		super(scheme);
	}

	public Iterable<List<Object>> deserializeKeyAndValue(final byte[] key, final byte[] value) {
		List<Object> o = ((KeyValueScheme) scheme).deserializeKeyAndValue(key, value);
		if (o == null)
			return null;
		else
			return Arrays.asList(o);
	}

}