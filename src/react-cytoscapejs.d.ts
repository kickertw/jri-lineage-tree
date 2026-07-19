declare module 'react-cytoscapejs' {
  import type { ComponentType } from 'react';
  import type {
    ElementDefinition,
    Stylesheet,
    LayoutOptions,
    Core,
  } from 'cytoscape';

  interface CytoscapeComponentProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    elements?: ElementDefinition[];
    layout?: LayoutOptions | { name: string; [key: string]: unknown };
    stylesheet?: Stylesheet[] | Stylesheet;
    styleSheet?: Stylesheet[] | Stylesheet;
    cy?: (cy: Core) => void;
    userZoomingEnabled?: boolean;
    userPanningEnabled?: boolean;
    boxSelectionEnabled?: boolean;
    autoungrabify?: boolean;
    autolock?: boolean;
    minZoom?: number;
    maxZoom?: number;
    zoom?: number;
    pixelRatio?: number;
    wheelSensitivity?: number;
    selectionType?: 'single' | 'additive';
    [key: string]: unknown;
  }

  const CytoscapeComponent: ComponentType<CytoscapeComponentProps>;
  export default CytoscapeComponent;
}
