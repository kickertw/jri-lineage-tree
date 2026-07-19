import type { ElementDefinition } from "cytoscape";
import lineageData from "./lineage-data.json";

export interface PersonNode {
  id: string;
  name: string;
  rank: string;
  type: string;
  notes: string;
}

export interface LineageData {
  nodes: PersonNode[];
  edges: { source: string; target: string }[];
}

const STORAGE_KEY = "lineage-data";

export function loadLineageData(): LineageData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return lineageData as LineageData;
    }
  }
  return lineageData as LineageData;
}

export function saveLineageData(data: LineageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function buildElements(data: LineageData): ElementDefinition[] {
  const nodes: ElementDefinition[] = data.nodes.map((node) => ({
    data: {
      id: node.id,
      label: `${node.name}\n${node.rank.split(" ")[0]} ${node.rank.split(" ")[1]}`,
      type: node.type,
      rank: node.rank,
      notes: node.notes,
    },
  }));

  const edges: ElementDefinition[] = data.edges.map((edge) => ({
    data: { source: edge.source, target: edge.target },
  }));

  return [...nodes, ...edges];
}

export function updatePersonInData(
  data: LineageData,
  nodeId: string,
  name: string,
  rank: string,
  type: string,
  notes: string,
  instructorIds: string[]
): LineageData {
  const updatedNodes = data.nodes.map((node) =>
    node.id === nodeId ? { ...node, name, rank, type, notes } : node
  );
  const edgesWithoutPerson = data.edges.filter((edge) => edge.target !== nodeId);
  const updatedEdges = [
    ...edgesWithoutPerson,
    ...instructorIds.map((instructorId) => ({ source: instructorId, target: nodeId })),
  ];
  return { ...data, nodes: updatedNodes, edges: updatedEdges };
}

function generateId(name: string, existingIds: string[]): string {
  const parts = name.split(" ");
  const baseId = (parts[0][0] + (parts[parts.length - 1] || "")).toLowerCase().replace(/[^a-z]/g, "");
  let id = baseId;
  let counter = 1;
  while (existingIds.includes(id)) {
    id = baseId + counter;
    counter++;
  }
  return id;
}

export function addPersonToData(
  data: LineageData,
  name: string,
  rank: string,
  type: string,
  notes: string,
  instructorIds: string[]
): LineageData {
  const id = generateId(name, data.nodes.map((n) => n.id));

  const newNode: PersonNode = { id, name, rank, type, notes };
  const newEdges = instructorIds.map((instructorId) => ({
    source: instructorId,
    target: id,
  }));

  return {
    nodes: [...data.nodes, newNode],
    edges: [...data.edges, ...newEdges],
  };
}
