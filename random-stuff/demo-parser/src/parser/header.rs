use crate::parser::{error::ParserError, FromStream, ParserResult};
use protobuf::CodedInputStream;
use std::fmt;
use std::time::Duration;

const DEMO_MAGIC_CODE: &[u8; 8] = b"HL2DEMO\0";
const OS_PATH_LENGTH: usize = 260;

#[derive(Debug, PartialEq)]
pub struct Header {
    magic_code: [u8; 8],     // Filestamp, must have value: 'HL2DEMO'
    protocol: u32,           // Should be 4
    network_protocol: u32,   // Unknown
    server_name: String,     // Server's config value 'hostname'
    client_name: String,     // Should be 'GOTV Demo'
    map_name: String,        // E.g. de_mirage, de_cache
    game_directory: String,  // Must have value: 'csgo'
    playback_time: Duration, // Demo duration is seconds.
    playback_ticks: u32,     // Game duration in ticks.
    playback_frames: u32,    // Amount of frames, ticks in demo.
    signon_length: u32,      // Amount of bytes of Signon.
}

impl FromStream for Header {
    fn from_stream(stream: &mut CodedInputStream) -> ParserResult<Header> {
        let mut magic_code = [0; 8];
        stream.read(&mut magic_code)?;

        if magic_code != *DEMO_MAGIC_CODE {
            return Err(ParserError::InvalidMagicCode);
        }

        let protocol = stream.read_raw_little_endian32()?;
        if protocol != 4 {
            return Err(ParserError::InvalidFileType);
        }

        Ok(Header {
            magic_code,
            protocol,
            network_protocol: stream.read_raw_little_endian32()?,
            server_name: Self::read_string(stream)?,
            client_name: Self::read_string(stream)?,
            map_name: Self::read_string(stream)?,
            game_directory: Self::read_string(stream)?,
            playback_time: Duration::from_secs_f32(stream.read_float()?),
            playback_frames: stream.read_raw_little_endian32()?,
            playback_ticks: stream.read_raw_little_endian32()?,
            signon_length: stream.read_raw_little_endian32()?,
        })
    }
}

impl Header {
    fn read_string(stream: &mut CodedInputStream) -> ParserResult<String> {
        let mut v = Vec::with_capacity(OS_PATH_LENGTH);
        unsafe {
            v.set_len(OS_PATH_LENGTH);
        }
        stream.read(v.as_mut_slice())?;
        let s = String::from_utf8_lossy(&v)
            .trim_matches(char::from(0))
            .to_string();
        Ok(s)
    }
}

impl fmt::Display for Header {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "----HEADER START ----");
        writeln!(f, "Magic code: {}", unsafe {
            String::from_utf8_unchecked(self.magic_code.to_vec())
        });
        writeln!(f, "protocol: {}", self.protocol);
        writeln!(f, "network protocol: {}", self.network_protocol);
        writeln!(f, "Server name: {}", self.server_name);
        writeln!(f, "Client name: {}", self.client_name);
        writeln!(f, "Map name: {}", self.map_name);
        writeln!(f, "Game directory: {}", self.game_directory);
        writeln!(f, "Playback time: {:?}", self.playback_time);
        writeln!(f, "Playback ticks: {}", self.playback_ticks);
        writeln!(f, "Playback frames: {}", self.playback_frames);
        writeln!(f, "----HEADER END----")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parser::{demo::Demo, test_util};
    use protobuf;

    #[test]
    fn has_valid_header() {
        let expected_header = Header {
            magic_code: *DEMO_MAGIC_CODE,
            protocol: 4,
            network_protocol: 13801,
            client_name: String::from("GOTV Demo"),
            server_name: String::from("FACEIT.com register to play here"),
            map_name: String::from("de_mirage"),
            game_directory: String::from("csgo"),
            playback_time: Duration::from_secs_f64(2615.625121792),
            playback_ticks: 334800,
            playback_frames: 167003,
            signon_length: 465826,
        };

        let mut file = test_util::get_file("demo_1.dem");
        let mut stream = protobuf::CodedInputStream::new(&mut file);

        let header =
            Header::from_stream(&mut stream).expect("Correct header, should be parseable.");
        assert_eq!(header, expected_header);
        println!("{}", header);
    }
}
