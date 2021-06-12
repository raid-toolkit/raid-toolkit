import * as React from 'react';
import { ResourceContext } from '../ResourceContext';

export type ImgProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
export type ResourceImageProps = Pick<ImgProps, Exclude<keyof ImgProps, 'src'>> & { path: string };

export const ResourceImage: React.FC<ResourceImageProps> = (props) => {
  const { getResourcePath } = React.useContext(ResourceContext);
  return <img {...props} src={getResourcePath(props.path)} />;
};
