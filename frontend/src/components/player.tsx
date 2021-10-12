import { IRichTeam } from '@/lib/getTeams';
import { Tag } from 'antd';
import { Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Player as PlayerType } from 'types/RoundResponse';

interface IPlayerProps {
  player: PlayerType;
  teams: IRichTeam[];
  playerInfo?: any;
}



export default function Player(props: IPlayerProps) {
  const { player, teams, playerInfo } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const name = getName(player);

  const colour = teams.find((team) =>
    team.players.includes(player._id),
  )?.colour;

  const modalText = playerInfo
    ? JSON.stringify(sanitizeMongoObject(playerInfo), null, 2)
    : JSON.stringify(sanitizeMongoObject(player), null, 2);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tag color={colour} onClick={showModal} style={{cursor: 'pointer'}}>
        {name}
      </Tag>
      <Modal
        title="Detailed info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        
        <pre>{modalText}</pre>
      </Modal>
    </>
  );
}

function sanitizeMongoObject(obj: any) {
  obj = removeProperty(obj, '__v');
  obj = removeProperty(obj, '_id');
  obj = removeProperty(obj, 'steamId');
  return obj;
}


function removeProperty(obj: any, propertyToDelete: string) {
  for(const prop in obj) {
    if (prop === propertyToDelete)
      delete obj[prop];
    else if (typeof obj[prop] === 'object')
    removeProperty(obj[prop], propertyToDelete);
  }

  return obj
}

function getName(player: PlayerType) {
  if (player.name) {
    return player.name;
  }
  if (player._id) {
    return player._id.substr(player._id.length - 5);
  }
  return 'Unknown';
}