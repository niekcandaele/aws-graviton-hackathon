use protobuf::ProtobufError;
use std::io::Error as IoError;
use std::str::Utf8Error;

#[derive(Debug)]
pub enum ParserError {
    InvalidMagicCode,
    InvalidFileType,
    Protobuf(ProtobufError),
    Utf8(Utf8Error),
    FileNotFound(IoError),
    UnknownDemoCommand,
    UnhandledCustomData,
    UnknownMessage(i32),
}

impl From<ProtobufError> for ParserError {
    fn from(err: ProtobufError) -> Self {
        ParserError::Protobuf(err)
    }
}

impl From<Utf8Error> for ParserError {
    fn from(err: Utf8Error) -> Self {
        ParserError::Utf8(err)
    }
}

impl From<IoError> for ParserError {
    fn from(err: IoError) -> Self {
        ParserError::FileNotFound(err)
    }
}
