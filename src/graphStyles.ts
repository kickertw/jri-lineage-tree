const baseStylesheet = [
  {
    selector: "node",
    style: {
      "background-color": "#e2e8f0" as any,
      label: "data(label)" as any,
      "text-valign": "bottom" as any,
      "text-halign": "center" as any,
      "text-margin-y": 8 as any,
      "font-size": "11px" as any,
      "text-wrap": "wrap" as any,
      "text-max-width": "100px" as any,
      color: "#0f172a" as any,
      "text-outline-color": "#fff" as any,
      "text-outline-width": "2px" as any,
      width: 70 as any,
      height: 70 as any,
      opacity: 1 as any,
      "transition-property": "opacity, background-color, width, height" as any,
      "transition-duration": "0.3s" as any,
    },
  },
  {
    selector: 'node[type="grandmaster"]',
    style: {
      "background-color": "#d4af37" as any,
      width: 100 as any,
      height: 100 as any,
      "font-weight": "bold" as any,
      "font-size": "13px" as any,
      "border-width": "4px" as any,
      "border-color": "#000000" as any,
      "text-outline-color": "#ffffff" as any,
      "text-max-width": "120px" as any,
    },
  },
  {
    selector: 'node[type="master"]',
    style: {
      "background-color": "#3c70df" as any,
      width: 85 as any,
      height: 85 as any,
      "font-weight": "bold" as any,
      "font-size": "12px" as any,
      "border-width": "3px" as any,
      "border-color": "#d4af37" as any,
      "text-outline-color": "#fff" as any,
      "text-max-width": "110px" as any,
    },
  },
  {
    selector: 'node[type="black"]',
    style: {
      "background-color": "#797979" as any,
      "border-width": "3px" as any,
      "border-color": "#3c70df" as any,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2 as any,
      "line-color": "#94a3b8" as any,
      "target-arrow-color": "#94a3b8" as any,
      "target-arrow-shape": "triangle" as any,
      curve: "bezier" as any,
      opacity: 1 as any,
      "transition-property": "opacity, line-color, width" as any,
      "transition-duration": "0.3s" as any,
    },
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.2 as any,
    },
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.1 as any,
    },
  },
  {
    selector: "node.highlighted",
    style: {
      "border-width": "4px" as any,
      "border-color": "#dc2626" as any,
    },
  },
  {
    selector: "edge.highlighted",
    style: {
      "line-color": "#dc2626" as any,
      "target-arrow-color": "#dc2626" as any,
      width: 3 as any,
    },
  },
];

export default baseStylesheet;
