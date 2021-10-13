use super::FromStream;
use crate::csgoprot;

#[derive(Debug)]
pub struct Frame {
    seq_in: u32,
    seq_out: u32,
    messages: Vec<Message>,
}

impl FromStream for Frame {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> super::ParserResult<Self> {
        // We are not interested in the first 160 bytes. Contains angling of viewmodels.
        stream.skip_raw_bytes(160)?;

        let seq_in = stream.read_raw_little_endian32()?;
        let seq_out = stream.read_raw_little_endian32()?;

        // read messages (first byte is the amount of messages (not sure if this should be le)
        let size: usize = stream.read_raw_little_endian32()?;
        let messages: Vec<Message> = vec![];
        let mut bytes_read = 0;

        while bytes_read < size {
            let start_pos = stream.pos();
            messages.push(Message::from_stream(stream)?);
            bytes_read += stream.pos() - start_pos;
        }

        Ok(Self {
            seq_in,
            seq_out,
            messages,
        })
    }
}
