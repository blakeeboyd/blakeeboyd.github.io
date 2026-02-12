import type { GraphState } from './graph-store';

export const selectNodeById = (id: string) => (state: GraphState) =>
  state.nodes.find(n => n.id === id);

export const selectEdgesForNode = (id: string) => (state: GraphState) =>
  state.edges.filter(e => e.source === id || e.target === id);
