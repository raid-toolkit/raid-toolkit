export enum BlackMarketItemType {
  RefillEnergy = 1,
  RefillArenaTokens = 2,
  RefillTagArenaTokens = 3,

  ShardMystery = 1001,
  ShardAncient = 1002,
  ShardSacred = 1003,
  ShardVoid = 1004,

  XpBoost2x_1Day = 3001,
  XpBoost2x_3Day = 3002,
  XpBoost4x_1Day = 3003,
  XpBoost4x_3Day = 3004,

  SkillUpgradeRare = 5001,
  SkillUpgradeEpic = 5002,
  SkillUpgradeLegendary = 5003,

  BrewMagic = 5501,
  BrewForce = 5502,
  BrewSpirit = 5503,
  BrewVoid = 5504,
  BrewRandom = 5505, // never used for "owned" resources, only BM deals

  Chicken2 = 6501,
  Chicken3 = 6502,
  Chicken4 = 6503,
  Chicken5 = 6504,

  // glyphs 70xx
  // glyph randoms 7301 - 1706 (1-6*)

  CharmRank = 8001,
  CharmRarity = 8002,
  CharmTypeRandom = 8050,
  CharmTypeWeapon = 8051,
  CharmTypeHelmet = 8052,
  CharmTypeShield = 8053,
  CharmTypeGloves = 8054,
  CharmTypeChest = 8055,
  CharmTypeBoots = 8056,

  // 81xx - substat charms
  CharmSubstatRandom = 8100,
  CharmSubstatHP = 8101,
  CharmSubstatAttack = 8102,
  CharmSubstatDefense = 8103,
  CharmSubstatSpeed = 8104,
  CharmSubstatCritRate = 8105,
  CharmSubstatCritDamage = 8106,
  CharmSubstatResistance = 8107,
  CharmSubstatAccuracy = 8108,

  ForgeCharmBox = 8301, // BM only

  AutoBattleTicketsX10 = 10000, // BM only
  AutoBattleTicketsX20 = 10001, // BM only
  AutoBattleTicketsX50 = 10002, // BM only
}
