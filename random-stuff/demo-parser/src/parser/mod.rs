pub mod command;
pub mod datatable;
pub mod demo;
pub mod error;
pub mod frame;
pub mod header;
pub mod message;
pub mod packet;
pub mod stringtable;

use protobuf::CodedInputStream;
use std::{io, mem};

pub type ParserResult<T> = Result<T, crate::parser::error::ParserError>;

pub trait FromStream: Sized {
    fn from_stream(stream: &mut CodedInputStream) -> ParserResult<Self>;
}

pub(crate) trait ReadExt {
    fn read_u8(&mut self) -> ParserResult<u8>;
    fn read_u16(&mut self) -> ParserResult<u16>;
    fn read_u32(&mut self) -> ParserResult<u32>;
    fn read_f32(&mut self) -> ParserResult<f32>;
    fn read_sized(&mut self) -> ParserResult<Vec<u8>>;
    fn read_cstring(&mut self) -> ParserResult<String>;
}

impl<R: io::Read> ReadExt for R {
    #[inline]
    fn read_u8(&mut self) -> ParserResult<u8> {
        let mut buf = [0];
        self.read_exact(&mut buf)?;
        Ok(buf[0])
    }

    #[inline]
    fn read_u16(&mut self) -> ParserResult<u16> {
        let mut buf = [0; 2];
        self.read_exact(&mut buf)?;
        let n: u16 = unsafe { mem::transmute(buf) };
        Ok(n.to_le())
    }

    #[inline]
    fn read_u32(&mut self) -> ParserResult<u32> {
        let mut buf = [0; 4];
        self.read_exact(&mut buf)?;
        let n: u32 = unsafe { mem::transmute(buf) };
        Ok(n.to_le())
    }

    #[inline]
    fn read_f32(&mut self) -> ParserResult<f32> {
        unsafe { Ok(mem::transmute(self.read_u32()?)) }
    }

    fn read_sized(&mut self) -> ParserResult<Vec<u8>> {
        let size = self.read_u32()? as usize;
        let mut buf = Vec::with_capacity(size);
        unsafe {
            buf.set_len(size);
        }
        self.read_exact(&mut buf)?;
        Ok(buf)
    }

    fn read_cstring(&mut self) -> ParserResult<String> {
        let mut v = vec![];
        loop {
            let c = self.read_u8()?;
            if c != 0 {
                v.push(c)
            } else {
                break;
            }
        }
        Ok(String::from_utf8(v)?)
    }
}

#[cfg(test)]
pub mod test_util {

    use std::{fs::File, path::Path};

    pub fn get_file(fname: &str) -> File {
        let path = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("mocks")
            .join(fname);
        File::open(path).unwrap()
    }
}
