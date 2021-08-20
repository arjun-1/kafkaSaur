/** @format */

import { Encoder } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/encoder.js';
import { MessageProtocol } from 'file:///C:/Users/wesge/Desktop/Coding/kafkaEx/protocol/message/index.js';
//const { Types } = require('../message/compression');

/**
 * MessageSet => [Offset MessageSize Message]
 *  Offset => int64
 *  MessageSize => int32
 *  Message => Bytes
 */

/**
 * [
 *   { key: "<value>", value: "<value>" },
 *   { key: "<value>", value: "<value>" },
 * ]
 */
export default ({ messageVersion = 0, compression, entries }) => {
  //const isCompressed = compression !== Types.None;
  const Message = MessageProtocol({ version: messageVersion });
  //const Message = ({ version: 0})
  const encoder = new Encoder();

  // Messages in a message set are __not__ encoded as an array.
  // They are written in sequence.
  // https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-Messagesets

  entries.forEach((entry, i) => {
    const message = Message(entry);

    // This is the offset used in kafka as the log sequence number.
    // When the producer is sending non compressed messages, it can set the offsets to anything
    // When the producer is sending compressed messages, to avoid server side recompression, each compressed message
    // should have offset starting from 0 and increasing by one for each inner message in the compressed message
    //encoder.writeInt64(isCompressed ? i : -1);
    encoder.writeInt32(message.size());

    encoder.writeEncoder(message);
  });

  return encoder;
};

// export default MessageSet;
