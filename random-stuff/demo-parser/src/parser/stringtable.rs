pub struct PlayerInfo {
    version: i64,
    xuid: u64,
    name: String,
    user_id: i32,
    guid: String,
    friends_id: i32,
    friends_name: String,
    // CRC stuff
    custom_files_0: i32,
    custom_files_1: i32,
    custom_files_2: i32,
    custom_files_3: i32,
    // Amount of downloaded files from the server.
    files_downloaded: u8,

    // Bot
    is_fake_player: bool,
    // HLTV Proxy
    is_hltv: bool,
}

pub struct StringTable {}
