use crate::csgoprot::{cstrike15_usermessages, netmessages};
use crate::parser::{ParserResult, error::ParserError};

#[derive(Debug)]
pub struct Message {}
impl FromStream for Message {
    fn from_stream(stream: &mut protobuf::CodedInputStream) -> super::ParserResult<Self> {
        let msg_type = stream.read_raw_varint32()? as i32;


        // handle net messages we want to parse


        netmessages::SVC_Messages::svc




        // check if it is sv message


        // check if it is a netmessage

        if let Some(msg_type) = netmessages::NET_Messages::from(msg_type) {
            Ok(stream.read_message<netmessages::NET_Messages>());
        }


        Err(ParserError::UnknownMessage(msg_type);
    }
}

#[derive(Debug)]
pub enum SvcMessage {
    ServerInfo(netmessages::CSVCMsg_ServerInfo),
    SendTable(netmessages::CSVCMsg_SendTable),
    ClassInfo(netmessages::CSVCMsg_ClassInfo),
    SetPause(netmessages::CSVCMsg_SetPause),
    CreateStringTable(netmessages::CSVCMsg_CreateStringTable),
    UpdateStringTable(netmessages::CSVCMsg_UpdateStringTable),
    VoiceInit(netmessages::CSVCMsg_VoiceInit),
    VoiceData(netmessages::CSVCMsg_VoiceData),
    Print(netmessages::CSVCMsg_Print),
    Sounds(netmessages::CSVCMsg_Sounds),
    SetView(netmessages::CSVCMsg_SetView),
    FixAngle(netmessages::CSVCMsg_FixAngle),
    CrosshairAngle(netmessages::CSVCMsg_CrosshairAngle),
    BspDecal(netmessages::CSVCMsg_BSPDecal),
    SplitScreen(netmessages::CSVCMsg_SplitScreen),
    EntityMessage(netmessages::CSVCMsg_EntityMsg),
    GameEvent(netmessages::CSVCMsg_GameEvent),
    PacketEntities(netmessages::CSVCMsg_PacketEntities),
    TempEntities(netmessages::CSVCMsg_TempEntities),
    Prefetch(netmessages::CSVCMsg_Prefetch),
    Menu(netmessages::CSVCMsg_Menu),
    GameEventList(netmessages::CSVCMsg_GameEventList),
    GetCvarValue(netmessages::CSVCMsg_GetCvarValue),
    PaintmapData(netmessages::CSVCMsg_PaintmapData),
    CmdKeyValues(netmessages::CSVCMsg_CmdKeyValues),
    EncryptedData(netmessages::CSVCMsg_EncryptedData),
    HltvReplay(netmessages::CSVCMsg_HltvReplay),
    BroadcastCommand(netmessages::CSVCMsg_Broadcast_Command),
}

pub enum NetMessage {
    Nop(netmessages::CNETMsg_NOP),
    Disconnect(netmessages::CNETMsg_Disconnect),
    File(netmessages::CNETMsg_File),
    SplitScreenUser(netmessages::CNETMsg_SplitScreenUser),
    Tick(netmessages::CNETMsg_Tick),
    StringCmd(netmessages::CNETMsg_StringCmd),
    SetConVar(netmessages::CNETMsg_SetConVar),
    SignonState(netmessages::CNETMsg_SignonState),
    PlayerAvatarData(netmessages::CNETMsg_PlayerAvatarData),
}

#[derive(Debug, Clone, PartialEq)]
pub enum UserMessage {
    VGuiMenu(cstrike15_usermessages::CCSUsrMsg_VGUIMenu),
    Geiger(cstrike15_usermessages::CCSUsrMsg_Geiger),
    Train(cstrike15_usermessages::CCSUsrMsg_Train),
    HudText(cstrike15_usermessages::CCSUsrMsg_HudText),
    SayText(cstrike15_usermessages::CCSUsrMsg_SayText),
    SayText2(cstrike15_usermessages::CCSUsrMsg_SayText2),
    TextMsg(cstrike15_usermessages::CCSUsrMsg_TextMsg),
    HudMsg(cstrike15_usermessages::CCSUsrMsg_HudMsg),
    ResetHud(cstrike15_usermessages::CCSUsrMsg_ResetHud),
    GameTitle(cstrike15_usermessages::CCSUsrMsg_GameTitle),
    Shake(cstrike15_usermessages::CCSUsrMsg_Shake),
    Fade(cstrike15_usermessages::CCSUsrMsg_Fade),
    Rumble(cstrike15_usermessages::CCSUsrMsg_Rumble),
    CloseCaption(cstrike15_usermessages::CCSUsrMsg_CloseCaption),
    CloseCaptionDirect(cstrike15_usermessages::CCSUsrMsg_CloseCaptionDirect),
    SendAudio(cstrike15_usermessages::CCSUsrMsg_SendAudio),
    RawAudio(cstrike15_usermessages::CCSUsrMsg_RawAudio),
    VoiceMask(cstrike15_usermessages::CCSUsrMsg_VoiceMask),
    RequestState(cstrike15_usermessages::CCSUsrMsg_RequestState),
    Damage(cstrike15_usermessages::CCSUsrMsg_Damage),
    RadioText(cstrike15_usermessages::CCSUsrMsg_RadioText),
    HintText(cstrike15_usermessages::CCSUsrMsg_HintText),
    KeyHintText(cstrike15_usermessages::CCSUsrMsg_KeyHintText),
    ProcessSpottedEntityUpdate(cstrike15_usermessages::CCSUsrMsg_ProcessSpottedEntityUpdate),
    ReloadEffect(cstrike15_usermessages::CCSUsrMsg_ReloadEffect),
    AdjustMoney(cstrike15_usermessages::CCSUsrMsg_AdjustMoney),
    StopSpectatorMode(cstrike15_usermessages::CCSUsrMsg_StopSpectatorMode),
    KillCam(cstrike15_usermessages::CCSUsrMsg_KillCam),
    DesiredTimescale(cstrike15_usermessages::CCSUsrMsg_DesiredTimescale),
    CurrentTimescale(cstrike15_usermessages::CCSUsrMsg_CurrentTimescale),
    AchievementEvent(cstrike15_usermessages::CCSUsrMsg_AchievementEvent),
    MatchEndConditions(cstrike15_usermessages::CCSUsrMsg_MatchEndConditions),
    DisconnectToLobby(cstrike15_usermessages::CCSUsrMsg_DisconnectToLobby),
    PlayerStatsUpdate(cstrike15_usermessages::CCSUsrMsg_PlayerStatsUpdate),
    DisplayInventory(cstrike15_usermessages::CCSUsrMsg_DisplayInventory),
    WarmupHasEnded(cstrike15_usermessages::CCSUsrMsg_WarmupHasEnded),
    ClientInfo(cstrike15_usermessages::CCSUsrMsg_ClientInfo),
    XRankGet(cstrike15_usermessages::CCSUsrMsg_XRankGet),
    XRankUpd(cstrike15_usermessages::CCSUsrMsg_XRankUpd),
    CallVoteFailed(cstrike15_usermessages::CCSUsrMsg_CallVoteFailed),
    VoteStart(cstrike15_usermessages::CCSUsrMsg_VoteStart),
    VotePass(cstrike15_usermessages::CCSUsrMsg_VotePass),
    VoteFailed(cstrike15_usermessages::CCSUsrMsg_VoteFailed),
    VoteSetup(cstrike15_usermessages::CCSUsrMsg_VoteSetup),
    ServerRankRevealAll(cstrike15_usermessages::CCSUsrMsg_ServerRankRevealAll),
    SendLastKillerDamageToClient(cstrike15_usermessages::CCSUsrMsg_SendLastKillerDamageToClient),
    ServerRankUpdate(cstrike15_usermessages::CCSUsrMsg_ServerRankUpdate),
    ItemPickup(cstrike15_usermessages::CCSUsrMsg_ItemPickup),
    ShowMenu(cstrike15_usermessages::CCSUsrMsg_ShowMenu),
    BarTime(cstrike15_usermessages::CCSUsrMsg_BarTime),
    AmmoDenied(cstrike15_usermessages::CCSUsrMsg_AmmoDenied),
    MarkAchievement(cstrike15_usermessages::CCSUsrMsg_MarkAchievement),
    MatchStatsUpdate(cstrike15_usermessages::CCSUsrMsg_MatchStatsUpdate),
    ItemDrop(cstrike15_usermessages::CCSUsrMsg_ItemDrop),
    GlowPropTurnOff(cstrike15_usermessages::CCSUsrMsg_GlowPropTurnOff),
    SendPlayerItemDrops(cstrike15_usermessages::CCSUsrMsg_SendPlayerItemDrops),
    RoundBackupFilenames(cstrike15_usermessages::CCSUsrMsg_RoundBackupFilenames),
    SendPlayerItemFound(cstrike15_usermessages::CCSUsrMsg_SendPlayerItemFound),
    ReportHit(cstrike15_usermessages::CCSUsrMsg_ReportHit),
    XpUpdate(cstrike15_usermessages::CCSUsrMsg_XpUpdate),
    QuestProgress(cstrike15_usermessages::CCSUsrMsg_QuestProgress),
    ScoreLeaderboardData(cstrike15_usermessages::CCSUsrMsg_ScoreLeaderboardData),
    UpdateTeamMoney,
    Unknown(UnknownMessage),
}

pub struct UnknownMessage {
    pub msg_type: i32,
    pub msg_data: Vec<u8>,
}
