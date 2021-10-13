use super::{error::ParserError, FromStream, message::Message};
use crate::csgoprot::netmessages::{CSVCMsg_ClassInfo_class_t, CSVCMsg_SendTable};


/* What are datatables? */

pub struct DataTables {
    tables: Vec<CSVCMsg_SendTable>,
    classes: Vec<CSVCMsg_ClassInfo_class_t>,
}

impl FromStream for DataTables {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> super::ParserResult<Self> {
        stream.read_uint32()?;


        loop {
            let msg = Message

        }

    }
}
