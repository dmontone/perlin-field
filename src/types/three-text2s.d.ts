declare module 'three-text2d' {
  import * as THREE from 'three';

  export interface Text2DParameters {
      text: string;
      font?: string;
      size?: number;
      color?: string | THREE.Color;
      align?: string;
      position?: THREE.Vector2;
      rotation?: number;
      opacity?: number;
      scale?: number;
      depth?: number;
      bevelThickness?: number;
      bevelSize?: number;
      bevelEnabled?: boolean;
      curveSegments?: number;
      steps?: number;
      fontName?: string;
      style?: string;
  }

  export class Text2D extends THREE.Mesh {
      constructor(text: string, options?: Text2DParameters);

      refresh(): void;
  }
}
