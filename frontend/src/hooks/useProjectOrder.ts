import { useState, useEffect } from 'react';
import { Project } from '../types';

const STORAGE_KEY = 'tangled-project-order';

export interface ProjectOrderMap {
  inProgress: number[];
  knitting: number[];
  crochet: number[];
  embroidery: number[];
}

export function useProjectOrder() {
  const [orderMap, setOrderMap] = useState<ProjectOrderMap>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load project order from localStorage', error);
    }
    return {
      inProgress: [],
      knitting: [],
      crochet: [],
      embroidery: [],
    };
  });

  // Save to localStorage whenever orderMap changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderMap));
    } catch (error) {
      console.error('Failed to save project order to localStorage', error);
    }
  }, [orderMap]);

  const sortProjects = (projects: Project[], section: keyof ProjectOrderMap): Project[] => {
    const order = orderMap[section];
    if (!order || order.length === 0) {
      return projects;
    }

    // Create a map for quick lookup
    const orderMap_lookup = new Map(order.map((id, index) => [id, index]));

    // Sort based on stored order, putting unordered items at the end
    return [...projects].sort((a, b) => {
      const aIndex = orderMap_lookup.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = orderMap_lookup.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  };

  const updateOrder = (projectIds: number[], section: keyof ProjectOrderMap) => {
    setOrderMap((prev) => ({
      ...prev,
      [section]: projectIds,
    }));
  };

  return {
    sortProjects,
    updateOrder,
  };
}
