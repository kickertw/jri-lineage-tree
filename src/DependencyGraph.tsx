import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type { Core, ElementDefinition, NodeSingular } from "cytoscape";
import "./DependencyGraph.css";
import { loadLineageData, saveLineageData, buildElements, updatePersonInData, addPersonToData } from "./graphData";
import type { LineageData, PersonNode } from "./graphData";
import baseStylesheet from "./graphStyles";
import PersonFormModal from "./PersonFormModal";

interface EditModalState {
  mode: "edit";
  nodeId: string;
  name: string;
  rank: string;
  type: string;
  notes: string;
  instructorIds: string[];
}

interface AddModalState {
  mode: "add";
}

type ModalState = AddModalState | EditModalState | null;

export default function DependencyGraph() {
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const selectedNodeRef = useRef<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [lineageData, setLineageData] = useState<LineageData>(() => loadLineageData());
  const [elements, setElements] = useState<ElementDefinition[]>(() => buildElements(lineageData));
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const focusOnNode = useCallback((cy: Core, nodeId: string) => {
    const node = cy.getElementById(nodeId);
    if (!node) return;

    const connectedEdges = node.connectedEdges();
    const connectedNodes = connectedEdges.connectedNodes();
    const relatedNodes = connectedNodes.union(node);

    cy.elements().forEach((ele: any) => {
      if (relatedNodes.contains(ele)) {
        ele.removeClass("dimmed");
        if (ele.isEdge()) {
          ele.addClass("highlighted");
        } else if (ele.id() === nodeId) {
          ele.addClass("highlighted");
        } else {
          ele.removeClass("highlighted");
        }
      } else {
        ele.removeClass("highlighted");
        ele.addClass("dimmed");
      }
    });

    cy.animate({
      fit: {
        eles: relatedNodes,
        padding: 80,
      },
      duration: 500,
      easing: "ease-in-out-cubic",
    });
  }, []);

  const resetView = useCallback((cy: Core) => {
    cy.elements().removeClass("dimmed highlighted");
    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: 50,
      },
      duration: 500,
      easing: "ease-in-out-cubic",
    });
  }, []);

  const handleSearchSelect = useCallback((nodeId: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    if (selectedNodeRef.current === nodeId) {
      resetView(cy);
      setSelectedNode(null);
    } else {
      focusOnNode(cy, nodeId);
      setSelectedNode(nodeId);
    }
    setSearchQuery("");
    setShowSearchSuggestions(false);
  }, [focusOnNode, resetView]);

  const searchSuggestions = useMemo<PersonNode[]>(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return lineageData.nodes.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
  }, [searchQuery, lineageData.nodes]);

  const handleCyInit = useCallback(
    (cy: Core) => {
      cyRef.current = cy;

      cy.off("tap", "node");
      cy.off("tap");
      cy.off("dbltap", "node");

      cy.on("tap", "node", (evt) => {
        const node = evt.target as NodeSingular;
        const nodeId = node.id();

        if (selectedNodeRef.current === nodeId) {
          resetView(cy);
          setSelectedNode(null);
          return;
        }

        focusOnNode(cy, nodeId);
        setSelectedNode(nodeId);
      });

      cy.on("dbltap", "node", (evt) => {
        const node = evt.target as NodeSingular;
        const nodeId = node.id();
        const nodeData = elements.find((e) => e.data.id === nodeId);
        if (nodeData) {
          const currentInstructorIds = lineageData.edges
            .filter((edge) => edge.target === nodeId)
            .map((edge) => edge.source);
          setModalState({
            mode: "edit",
            nodeId,
            name: (nodeData.data.label as string).split("\n")[0],
            rank: nodeData.data.rank as string,
            type: nodeData.data.type as string,
            notes: (nodeData.data.notes as string) || "",
            instructorIds: currentInstructorIds,
          });
        }
      });

      cy.on("tap", (evt) => {
        if (evt.target === cy) {
          resetView(cy);
          setSelectedNode(null);
        }
      });
    },
    [focusOnNode, resetView, elements],
  );

  const handleReset = useCallback(() => {
    if (cyRef.current) {
      resetView(cyRef.current);
      setSelectedNode(null);
    }
  }, [resetView]);

  const handleSavePerson = useCallback((data: {
    nodeId?: string;
    name: string;
    rank: string;
    type: string;
    notes: string;
    instructorIds: string[];
  }) => {
    const updatedData = data.nodeId
      ? updatePersonInData(lineageData, data.nodeId, data.name, data.rank, data.type, data.notes, data.instructorIds)
      : addPersonToData(lineageData, data.name, data.rank, data.type, data.notes, data.instructorIds);
    setLineageData(updatedData);
    saveLineageData(updatedData);
    setElements(buildElements(updatedData));
  }, [lineageData]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(lineageData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lineage-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [lineageData]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target?.result as string) as LineageData;
          setLineageData(data);
          saveLineageData(data);
          setElements(buildElements(data));
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const selectedInfo = selectedNode
    ? elements.find((e) => e.data.id === selectedNode)
    : null;
  const selectedName = selectedInfo
    ? (selectedInfo.data.label as string).split("\n")[0]
    : "";
  const selectedRank = selectedInfo ? (selectedInfo.data.rank as string) : "";

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h1>Martial Arts Lineage</h1>
        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
            placeholder="Search people..."
            className="search-input"
          />
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <ul className="search-suggestions">
              {searchSuggestions.map((person) => (
                <li key={person.id} onClick={() => handleSearchSelect(person.id)}>
                  <span className="search-name">{person.name}</span>
                  <span className="search-rank">{person.rank}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="header-actions">
          <button onClick={() => setModalState({ mode: "add" })}>Add Person</button>
          <button onClick={handleExport}>Export</button>
          <button onClick={handleImport}>Import</button>
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot grandmaster"></span>Grandmaster
          </span>
          <span className="legend-item">
            <span className="legend-dot master"></span>Master
          </span>
          <span className="legend-item">
            <span className="legend-dot black"></span>Black Belt
          </span>
        </div>
      </div>
      {selectedNode && (
        <div className="selection-info">
          <span>
            Focused on:{" "}
            <strong>
              {selectedName} — {selectedRank}
            </strong>
          </span>
          <button onClick={handleReset}>Reset View</button>
        </div>
      )}
      <CytoscapeComponent
        className="cytoscape-component"
        elements={elements}
        stylesheet={baseStylesheet}
        layout={{ name: "cose", padding: 50, animate: true } as any}
        cy={handleCyInit}
        userZoomingEnabled={true}
        userPanningEnabled={true}
        boxSelectionEnabled={true}
        autoungrabify={false}
      />
      {modalState && (
        <PersonFormModal
          mode={modalState.mode}
          people={lineageData.nodes}
          nodeId={modalState.mode === "edit" ? modalState.nodeId : undefined}
          initialName={modalState.mode === "edit" ? modalState.name : undefined}
          initialRank={modalState.mode === "edit" ? modalState.rank : undefined}
          initialType={modalState.mode === "edit" ? modalState.type : undefined}
          initialNotes={modalState.mode === "edit" ? modalState.notes : undefined}
          initialInstructorIds={modalState.mode === "edit" ? modalState.instructorIds : undefined}
          onSave={handleSavePerson}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
