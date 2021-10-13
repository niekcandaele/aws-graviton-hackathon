use super::{
    command::{CommandType, ConsoleCommand, DataTables, StringTables, UserCommand},
    error::ParserError,
    frame::Frame,
    FromStream, ParserResult,
};

// A packet is a general name for the different kinds of frames.
// It contains a command_type that specifies how we need to process the frame.
#[derive(Debug)]
pub struct Packet {
    pub command_type: CommandType,
    pub tick_count: u32,
    pub player_slot: u8,
}

impl FromStream for Packet {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> ParserResult<Self> {
        // More information about the command types can be found @ the CommandType enum itself.
        let command_type = match stream.read_raw_byte()? {
            1 => CommandType::Signon(Frame::from_stream(stream)?),
            2 => CommandType::Packet(Frame::from_stream(stream)?),
            3 => CommandType::Synctick,
            4 => CommandType::ConsoleCommand(ConsoleCommand::from_stream(stream)?),
            5 => CommandType::UserCommand(UserCommand::from_stream(stream)?),
            6 => CommandType::DataTables(DataTables::from_stream(stream)?),
            7 => CommandType::Stop,
            8 => return Err(ParserError::UnhandledCustomData),
            9 => CommandType::StringTables(StringTables::from_stream(stream)?),
            _ => return Err(ParserError::UnknownDemoCommand), // TODO: pass unknown value to error.
        };

        Ok(Packet {
            command_type,
            tick_count: stream.read_uint32()?,
            player_slot: stream.read_raw_byte()?,
        })
    }
}

#[cfg(test)]
mod tests {

    #[test]
    fn is_valid_stop_packet() {
        todo!();
    }
    #[test]
    fn is_valid_signon_packet() {
        todo!();
    }
}
