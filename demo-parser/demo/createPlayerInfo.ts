import { DemoFile, Player, Weapon } from 'demofile';

import { getMongoose } from '../models';
import { IPlayerInfo } from '../models/PlayerInfo';
import { WeaponEnum } from './type/WeaponEnum';

function translateDemoWeaponToEnum(weapon: Weapon | null): WeaponEnum | null {
  if (!weapon) {
    return null;
  }


  const errorMessage = `Unknown weapon - ${weapon.className}`;
  switch (weapon.className) {
    case 'weapon_healthshot':
      return WeaponEnum.Healthshot;
    case 'weapon_tagrenade':
      return WeaponEnum.TAGrenade;
    case 'weapon_sg556':
      return WeaponEnum.SG556;
    case 'weapon_hkp2000':
      return WeaponEnum.P2000;
    case 'weapon_taser':
      return WeaponEnum.Taser;
    case 'weapon_smokegrenade':
      return WeaponEnum.SmokeGrenade;
    case 'weapon_flashbang':
      return WeaponEnum.Flashbang;
    case 'weapon_hegrenade':
      return WeaponEnum.HEGrenade;
    case 'weapon_incgrenade':
      return WeaponEnum.IncendiaryGrenade;
    case 'weapon_molotov':
      return WeaponEnum.Molotov;
    case 'weapon_decoy':
      return WeaponEnum.Decoy;
    case 'weapon_c4':
      return WeaponEnum.C4;
    case 'weapon_mac10':
      return WeaponEnum.MAC10;
    case 'weapon_ak47':
      return WeaponEnum.AK47;
    case 'weapon_aug':
      return WeaponEnum.AUG;
    case 'weapon_awp':
      return WeaponEnum.AWP;
    case 'weapon_cz75a':
      return WeaponEnum.CZ75;
    case 'weapon_deagle':
      return WeaponEnum.DesertEagle;
    case 'weapon_elite':
      return WeaponEnum.DualBerettas;
    case 'weapon_famas':
      return WeaponEnum.Famas;
    case 'weapon_fiveseven':
      return WeaponEnum.FiveSeven;
    case 'weapon_g3sg1':
      return WeaponEnum.G3SG1;
    case 'weapon_galilar':
      return WeaponEnum.Galil;
    case 'weapon_glock':
      return WeaponEnum.Glock;
    case 'weapon_knife':
      return WeaponEnum.Knife;
    case 'weapon_knifegg':
      return WeaponEnum.Knife;
    case 'weapon_m249':
      return WeaponEnum.M249;
    case 'weapon_m4a1':
      return WeaponEnum.M4A4;
    case 'weapon_m4a1_silencer':
      return WeaponEnum.M4A1S;
    case 'weapon_mag7':
      return WeaponEnum.Mag7;
    case 'weapon_mp5sd':
      return WeaponEnum.MP5;
    case 'weapon_mp7':
      return WeaponEnum.MP7;
    case 'weapon_mp9':
      return WeaponEnum.MP9;
    case 'weapon_negev':
      return WeaponEnum.Negev;
    case 'weapon_nova':
      return WeaponEnum.Nova;
    case 'weapon_p250':
      return WeaponEnum.P250;
    case 'weapon_p90':
      return WeaponEnum.P90;
    case 'weapon_sawedoff':
      return WeaponEnum.SawedOff;
    case 'weapon_scar20':
      return WeaponEnum.SCAR20;
    case 'weapon_ssg08':
      return WeaponEnum.SSG08;
    case 'weapon_tec9':
      return WeaponEnum.Tec9;
    case 'weapon_ump45':
      return WeaponEnum.UMP45;
    case 'weapon_usp_silencer':
      return WeaponEnum.USP;
    case 'weapon_xm1014':
      return WeaponEnum.XM1014;
    case 'weapon_revolver':
      return WeaponEnum.R8Revolver;
    case 'weapon_bizon':
      return WeaponEnum.PPBizon;
    default:
      if (weapon.className?.includes('weapon_knife')) {
        return WeaponEnum.Knife;
      }

      if (weapon.className?.includes('weapon_bayonet')) {
        return WeaponEnum.Knife;
      }

      console.log(errorMessage);
      return null;
  }
}

export default async function createPlayerInfo(demoFile: DemoFile, player: Player): Promise<IPlayerInfo> {
  const db = await getMongoose();
  const playerInfo = new db.PlayerInfo({
    position: {
      x: player.position.x,
      y: player.position.y,
      z: player.position.z,
    },
    armour: player.armor,
    health: player.health,
    cashSpentInRound: player.cashSpendThisRound,
    equipmentValue: player.currentEquipmentValue,
    freezeTimeEndEquipmentValue: player.freezeTimeEndEquipmentValue,
    hasC4: player.hasC4,
    isScoped: player.isScoped,
    tick: demoFile.currentTick,
    bulletsInMagazine: player.weapon?.clipAmmo,
    weapon: player.weapon?.className,
  });

  await playerInfo.save();
  return playerInfo as IPlayerInfo;
}
