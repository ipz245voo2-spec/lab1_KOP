import { useState, useCallback, useMemo } from 'react';
import { FilterContext } from './filterContextDef';
import { DEFAULT_FILTERS } from '../constants/filters';

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [simulateError, setSimulateError] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateAllFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSimulateError(false);
    setSimulateEmpty(false);
    setIsFallbackMode(false);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters: updateAllFilters,
      updateFilter,
      resetFilters,
      simulateError,
      setSimulateError,
      simulateEmpty,
      setSimulateEmpty,
      isFallbackMode,
      setIsFallbackMode,
    }),
    [
      filters,
      updateAllFilters,
      updateFilter,
      resetFilters,
      simulateError,
      simulateEmpty,
      isFallbackMode,
    ],
  );

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export default FilterProvider;

