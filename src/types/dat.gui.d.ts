declare module 'dat.gui' {
  export class GUI {
      constructor(parameters?: GUIParams);
      addFolder(name: string): GUI | any;
      add<T>(object: object, property: string, ...args: any[]): GUI | any;
      addColor(object: object, property: string): GUI;
      addMonitor(object: object, property: string, ...args: any[]): GUI;
      getRoot(): object;
      destroy(): void;
  }

  interface GUIParams {
      autoPlace?: boolean;
      closed?: boolean;
      closeOnTop?: boolean;
      load?: object;
      name?: string;
      preset?: string;
      resizable?: boolean;
      width?: number;
  }
}
