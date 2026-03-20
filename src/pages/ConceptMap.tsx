import { useState, useEffect, useCallback } from "react";
import { useStore } from "../store";
import { generateConceptMap } from "../services/ai";
import { motion } from "framer-motion";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Info } from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function ConceptMap() {
  const { sessions, activeSessionId, updateActiveSession } = useStore();
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const notes = activeSession?.notes;
  const conceptMap = activeSession?.conceptMap;
  const setConceptMap = (map: any) => updateActiveSession({ conceptMap: map });

  const [isLoading, setIsLoading] = useState(!conceptMap);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (notes && !conceptMap) {
      loadMap();
    } else if (conceptMap) {
      buildGraph(conceptMap);
    }
  }, [notes, conceptMap]);

  const loadMap = async () => {
    setIsLoading(true);
    try {
      const mapData = await generateConceptMap(notes, activeSession?.learningPreferences);
      setConceptMap(mapData);
      buildGraph(mapData);
    } catch (error) {
      console.error("Failed to generate map:", error);
      alert("Failed to generate concept map. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const buildGraph = (data: any) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Main Topic
    newNodes.push({
      id: "main",
      type: "default",
      position: { x: 400, y: 300 },
      data: {
        label: data.mainTopic.name,
        explanation: data.mainTopic.explanation,
      },
      style: {
        background: "#18181b",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "16px",
        fontWeight: "bold",
        fontSize: "18px",
        boxShadow: "0 10px 25px -5px rgba(24, 24, 27, 0.4)",
        width: 200,
      },
    });

    const radius = 300;
    const subTopicsCount = data.subTopics.length;

    data.subTopics.forEach((sub: any, i: number) => {
      const angle = (i / subTopicsCount) * 2 * Math.PI;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);
      const subId = `sub-${i}`;

      newNodes.push({
        id: subId,
        position: { x, y },
        data: { label: sub.name, explanation: sub.explanation },
        style: {
          background: "#52525b",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px",
          fontWeight: "600",
          boxShadow: "0 4px 6px -1px rgba(13, 148, 136, 0.2)",
          width: 150,
        },
      });

      newEdges.push({
        id: `edge-main-${subId}`,
        source: "main",
        target: subId,
        animated: true,
        style: { stroke: "#71717a", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#71717a" },
      });

      const detailRadius = 150;
      const detailsCount = sub.details.length;

      sub.details.forEach((detail: any, j: number) => {
        // Spread details around the subtopic
        const detailAngle = angle + (j - (detailsCount - 1) / 2) * 0.5;
        const dx = x + detailRadius * Math.cos(detailAngle);
        const dy = y + detailRadius * Math.sin(detailAngle);
        const detailId = `detail-${i}-${j}`;

        newNodes.push({
          id: detailId,
          position: { x: dx, y: dy },
          data: { label: detail.name, explanation: detail.explanation },
          style: {
            background: "#F4F4F5",
            color: "#18181B",
            border: "1px solid #E4E4E7",
            borderRadius: "6px",
            padding: "8px",
            fontSize: "12px",
            width: 120,
          },
        });

        newEdges.push({
          id: `edge-${subId}-${detailId}`,
          source: subId,
          target: detailId,
          style: { stroke: "#a1a1aa", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#a1a1aa" },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
  };

  if (!notes) {
    return <EmptyState />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/20 blur-[100px] rounded-full pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8 relative z-10"
        >
          <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10">
          Mapping concepts...
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg relative z-10">
          Building visual connections from your notes
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] bg-zinc-50/50 dark:bg-zinc-950/50 rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls className="bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-800/50 fill-zinc-600 dark:fill-zinc-400 backdrop-blur-md rounded-xl overflow-hidden shadow-lg" />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background === "#18181b") return "#18181b";
            if (n.style?.background === "#52525b") return "#52525b";
            return "#E4E4E7";
          }}
          nodeColor={(n) => {
            if (n.style?.background === "#18181b") return "#18181b";
            if (n.style?.background === "#52525b") return "#52525b";
            return "#F4F4F5";
          }}
          className="bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md rounded-xl shadow-lg"
        />
        <Background color="#ccc" gap={16} />
      </ReactFlow>

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-6 left-6 max-w-sm glass-card p-6 rounded-3xl z-10"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 rounded-2xl shadow-inner">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white leading-tight mt-1">
              {selectedNode.data.label as string}
            </h3>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed mb-6">
            {selectedNode.data.explanation as string}
          </p>
          <button
            onClick={() => setSelectedNode(null)}
            className="w-full py-3 bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-display font-bold transition-colors backdrop-blur-sm"
          >
            Close Details
          </button>
        </motion.div>
      )}
    </div>
  );
}
