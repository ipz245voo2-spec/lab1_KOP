import { useContext } from 'react';
import { FilterContext } from './filterContextDef';

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

