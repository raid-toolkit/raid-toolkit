import * as React from 'react';
import { Intent, Spinner, Tree, ITreeNode, Classes } from '@blueprintjs/core';
import { excludeUndefined } from '@raid-toolkit/utils';
import { GameDataNode } from '@raid-toolkit/types';
import { ServiceHost } from '../../ServiceHost';

function isGameObject(node: GameDataNode): node is { [key: string]: GameDataNode; $id: number; $type: string } {
  return !!(node && (node as any).$id !== undefined);
}

function isStubObject(node: GameDataNode): node is { $stub: [address: number, type: string] } {
  return !!(node && (node as any).$stub !== undefined);
}

function nodeFromGameData(key: string, node: GameDataNode): ITreeNode | undefined {
  let treeNode: ITreeNode;
  if (!node) {
    return undefined;
  }
  if (isGameObject(node)) {
    const childNodes = excludeUndefined(
      Object.entries(node)
        .filter(([k]) => k !== '$id' && k !== '$type')
        .map(([k, value]) => nodeFromGameData(k, value))
    );
    treeNode = {
      id: node.$id ?? key,
      label: key,
      secondaryLabel: node.$type.substr(0, 75),
      hasCaret: !!childNodes.length,
      icon: 'folder-close',
      isExpanded: false,
      childNodes,
    };
  } else if (isStubObject(node)) {
    treeNode = {
      id: (node.$stub[0] as number) ?? key,
      label: key,
      secondaryLabel: node.$stub[1],
      hasCaret: true,
      icon: 'folder-close',
      isExpanded: false,
      // @ts-ignore intentionally breaking contract here...
      $stub: node.$stub,
    };
  } else if (node instanceof Array) {
    const childNodes = excludeUndefined(node.map((entry, index) => nodeFromGameData(`[${index}]`, entry)));
    treeNode = {
      id: key,
      label: key,
      icon: 'array',
      hasCaret: !!childNodes.length,
      secondaryLabel: `Array[${childNodes.length}]`,
      childNodes,
    };
  } else if (typeof node === 'object') {
    const childNodes = excludeUndefined(
      Object.entries(node)
        .filter(([k]) => k !== '$id' && k !== '$type')
        .map(([k, value]) => nodeFromGameData(k, value as GameDataNode))
    );
    treeNode = {
      id: key,
      label: key,
      secondaryLabel: `Map[${childNodes.length}]`,
      hasCaret: !!childNodes.length,
      icon: 'cube',
      isExpanded: false,
      childNodes,
    };
  } else {
    if (typeof node === 'string') {
      if (node.startsWith('{') || node.startsWith('[')) {
        try {
          // eslint-disable-next-line no-param-reassign
          node = JSON.parse(node);
          // re-enter with object/array instead
          return nodeFromGameData(key, node);
        } catch {
          // do nothing..
        }
      }
    }
    treeNode = {
      id: key,
      label: key,
      // eslint-disable-next-line no-nested-ternary
      icon: typeof node === 'string' ? 'citation' : typeof node === 'boolean' ? 'switch' : 'numerical',
      secondaryLabel: node.toString(),
      hasCaret: false,
    };
  }
  return treeNode;
}

export const DataExplorer: React.FC = () => {
  const [treeData, setTreeData] = React.useState<ITreeNode>({
    id: 0,
    hasCaret: true,
    icon: 'database',
    label: 'RAID',
  });

  React.useEffect(() => {
    (async function init() {
      const gameData: GameDataNode = await ServiceHost.appModel.getObject();
      setTreeData(nodeFromGameData('GameAssembly.dll', gameData)!);
    })();
  }, []);

  const handleNodeClick = React.useCallback(
    (nodeData: ITreeNode, _nodePath: number[], _e: React.MouseEvent<HTMLElement>) => {
      const originallySelected = nodeData.isSelected;
      // if (!e.shiftKey) {
      //   this.forEachNode(this.state.nodes, (n) => (n.isSelected = false));
      // }
      // eslint-disable-next-line no-param-reassign
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;
      setTreeData({ ...treeData });
    },
    [treeData, setTreeData]
  );

  const handleNodeCollapse = React.useCallback(
    (nodeData: ITreeNode) => {
      // eslint-disable-next-line no-param-reassign
      nodeData.isExpanded = false;
      setTreeData({ ...treeData });
    },
    [treeData, setTreeData]
  );

  const handleNodeExpand = React.useCallback(
    async (nodeData: ITreeNode) => {
      const $stub: [number, string] = (nodeData as any).$stub;
      // eslint-disable-next-line no-param-reassign
      nodeData.isExpanded = true;
      if ($stub) {
        // eslint-disable-next-line no-param-reassign
        nodeData.childNodes = [
          {
            id: `${nodeData.id}_loading`,
            label: ' Loading...',
            icon: <Spinner size={16} />,
          },
        ];
        setTreeData({ ...treeData });

        const gameData: GameDataNode = await ServiceHost.appModel.getObject($stub[0]);
        // eslint-disable-next-line no-param-reassign
        delete nodeData.childNodes;
        Object.assign(nodeData, nodeFromGameData(nodeData.label as string, gameData));
        // eslint-disable-next-line no-param-reassign
        nodeData.isExpanded = true;
        // eslint-disable-next-line no-param-reassign
        delete (nodeData as any).$stub;
      }
      setTreeData({ ...treeData });
    },
    [treeData, setTreeData]
  );

  const table = React.useMemo(() => {
    if (!treeData.childNodes) {
      return <Spinner size={100} intent={Intent.PRIMARY} />;
    }

    return (
      <Tree
        contents={[treeData]}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
        className={Classes.ELEVATION_0}
      />
    );
  }, [treeData, treeData.childNodes]);

  return (
    <div>
      <h3 className="bp3-heading">Game Data Explorer</h3>
      {table}
    </div>
  );
};
