use super::{command::CommandType, header::Header, packet::Packet, FromStream, ParserResult};
// use flate2::read::GzDecoder;
use protobuf::CodedInputStream;
use std::io::Read;

pub struct Demo<'a> {
    header: Header,
    stream: CodedInputStream<'a>,
    done: bool,
}

impl<'a> Demo<'_> {
    pub fn new(r: &'a mut dyn Read) -> ParserResult<Demo<'a>> {
        /* TODO: gzip compressed demos
        let mut magic_code = [0; 2];
        r.read_exact(&mut magic_code)?;

        if (magic_code[0] == 0x1f) && (magic_code[1] == 0x8b) {
            info!("Decompressing gzip demo");
            r = GzDecoder::new(r);
        }
        */

        let mut stream = protobuf::CodedInputStream::new(r);

        // Adds handy helper functions to protobuf stream.

        // We were able to read the header so we can consider this a valid demo.
        let header = Header::from_stream(&mut stream)?;
        Ok(Demo {
            header,
            stream,
            done: false,
        })
    }

    // It is very likely that the game already started.
    pub fn from_live_stream(_r: &'a mut dyn Read) {
        /* Not sure how this will work yet */
        todo!()
    }
}

impl<'a> Iterator for Demo<'_> {
    type Item = ParserResult<Packet>;

    fn next(&mut self) -> std::option::Option<<Self as Iterator>::Item> {
        let packet = Packet::from_stream(&mut self.stream);
        if self.done {
            return None;
        }

        if matches!(
            packet,
            Ok(Packet {
                command_type: CommandType::Stop,
                ..
            })
        ) {
            self.done = true;
        }
        Some(packet)
    }
}

#[cfg(test)]
mod tests {
    use super::{CommandType, Demo};
    use crate::parser::test_util;

    #[test]
    fn iterates_to_end() {
        let mut demo_file = test_util::get_file("demo_1.dem");
        let demo = Demo::new(&mut demo_file).unwrap();
        let packets: Vec<_> = demo.map(Result::unwrap).collect();

        assert_eq!(packets.len(), 1651);

        assert!(matches!(
            packets.first().unwrap().command_type,
            CommandType::Signon()
        ));
        assert!(matches!(
            packets.last().unwrap().command_type,
            CommandType::Stop
        ));
    }
}
