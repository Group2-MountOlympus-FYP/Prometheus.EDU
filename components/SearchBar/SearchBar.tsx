import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, TextInput } from '@mantine/core';

type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const qParam = params.get('q') ?? ''; // ✅ 单独取出 q 值作为依赖项

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (pathname === '/Search') {
      setQuery(qParam); // ✅ 这次会正确同步
    } else {
      setQuery('');
    }
  }, [pathname, qParam]); // ✅ 注意依赖的是 qParam，而不是 params 本身

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/Search?q=${encodeURIComponent(trimmed)}`);
    onSearch?.(trimmed);
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
            border: '1px solid #777CB9',
          },
        },
      }}
    />
  );
}
