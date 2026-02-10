import React, { useState, useRef, useEffect } from 'react';
import { Icon, Searchbar } from 'react-native-paper';
import type { Props as SearchbarProps } from 'react-native-paper/src/components/Searchbar';

const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

interface RemoveThoseKeys {
  value: unknown
}
type AllCustomSearchProps = SearchbarProps & {
  handleSearch: (term: string) => void;
  setLoading?: (value: Boolean) => void;
}
type CustomSearchProps = Omit<AllCustomSearchProps, keyof RemoveThoseKeys>


const CustomSearch = ({ handleSearch, setLoading=undefined, ...rest }: CustomSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);
  // Stored the debounced function in debouncedSearchRef using useRef (otherwise, it will get recreated on each rerender, and the timer gets recreated)
  // but it still needs to be initialized in a useEffect below

  useEffect(() => {
    debouncedSearchRef.current = debounce(handleSearch, 1000);
  }, [handleSearch]);

  const handleTextChange = (text) => {
    setSearchTerm(text);
    setLoading && setLoading(true);
    debouncedSearchRef.current?.(text);
  };

  return (
    <Searchbar
      placeholder="Search..."
      onChangeText={handleTextChange}
      autoCapitalize='none'
      value={searchTerm}
      clearIcon={props => <Icon {...props} source='delete' />}
      {...rest}
    />
  );
};

export default CustomSearch;
