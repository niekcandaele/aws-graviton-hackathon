use crate::parser::{frame::Frame, FromStream, ParserResult};

// TODO: when enums support it, implement tryfrom trait (See open issue)

/*
 * Every commandType exists out of 152 bytes CommandInfo
 * Followed by 4 bytes SeqNrIn and 4 bytes SeqNrOut.
 *
 * We can consider a Signon and a packet as normal frames
*/

#[derive(Debug)]
pub enum CommandType {
    Signon(Frame), // Initializes the start of a stream of packets. (We can parse this as a normal Packet)
    Packet(Frame), // Normal data package, most common (We can parse this as a normal packet)
    Synctick, // Valve internal synchronization: Ignore (Contains no further data or information)
    ConsoleCommand(ConsoleCommand), // Standard datapacket:
    UserCommand(UserCommand), // Standard datapacket: https://developer.valvesoftware.com/wiki/Usercmd
    DataTables(DataTables),   // Standard datapacket:
    Stop,       // Signal that the demo is over, and there is no more data to be parsed.
    CustomData, // Custom Data: Custom data the server maintainer can send. If we are not aware of this we cannot parse the rest of the demo.
    StringTables(StringTables), // Standard datapacket
}

#[derive(Debug)]
pub struct ConsoleCommand {
    command: String,
}
impl FromStream for ConsoleCommand {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> ParserResult<Self> {
        Ok(Self {})
    }
}

#[derive(Debug)]
pub struct UserCommand {}
impl FromStream for UserCommand {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> ParserResult<Self> {
        Ok(Self {})
    }
}

#[derive(Debug)]
pub struct DataTables {}
impl FromStream for DataTables {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> ParserResult<Self> {
        Ok(Self {})
    }
}

#[derive(Debug)]
pub struct StringTables {}
impl FromStream for StringTables {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> ParserResult<Self> {
        Ok(Self {})
    }
}
