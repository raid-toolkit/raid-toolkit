export interface GameNodeObject {
  [key: string]: GameDataNode;
  $id: number;
  $type: string;
}

export interface GameNodeStub {
  $stub: [id: number, type: string];
}

export type GameDataNode = string | number | boolean | ReadonlyArray<GameDataNode> | GameNodeObject | GameNodeStub;

export function isGameNodeObject(node: GameDataNode): node is GameNodeObject {
  return (node as GameNodeObject).$type !== undefined;
}

export function isGameNodeStub(node: GameDataNode): node is GameNodeStub {
  return (node as GameNodeStub).$stub !== undefined;
}
