declare module 'three-orbitcontrols' {
  import * as THREE from 'three';

  export class OrbitControls {
      constructor(object: THREE.Camera, domElement?: HTMLElement);

      object: THREE.Camera;
      domElement: HTMLElement | HTMLDocument;
      enabled: boolean;
      target: THREE.Vector3;
      minDistance: number;
      maxDistance: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableKeys: boolean;
      keys: {
          LEFT: number;
          UP: number;
          RIGHT: number;
          BOTTOM: number;
      };
      mouseButtons: {
          LEFT: THREE.MOUSE;
          MIDDLE: THREE.MOUSE;
          RIGHT: THREE.MOUSE;
      };

      dispose(): void;
      update(): void;
      saveState(): void;
      reset(): void;
  }
}