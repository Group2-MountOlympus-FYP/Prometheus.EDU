import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, TextInput, useMantineTheme } from '@mantine/core';
import { useState } from "react";

type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && query.trim() !== '') {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <TextInput
      radius="xl"
      size="md"
      value={query}
      onChange={(event) => setQuery(event.currentTarget.value)}
      onKeyDown={handleKeyPress}
      placeholder="Search courses..."
      rightSectionWidth={42}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={'#3C4077'}
          variant="filled"
          onClick={handleSearch}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      styles={{
        input: {
          borderColor: '#777CB9',
          '&:focus': {
            border: 'ipx solid #777CB9',
          },
        },
      }}
    />
  );
}
