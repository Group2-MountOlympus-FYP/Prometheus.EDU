'use client';

import {useCallback, useEffect, useState} from 'react';
import {LeadGrid} from '@/components/LeadGrid/LeadGrid';
import {Item} from '@/types/interfaces';

async function fetchItems(tag: string, page: number, limit: number): Promise<Item[]> {
    const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({tag, page, limit}),
    });
    return response.json();
}

export default function LeadGridPage({tag}: { tag: string }) {
    const [items, setItems] = useState<Item[]>([]); // Initialize items state
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(2); // Start from page 2 after the initial fetch
    const [end, setEnd] = useState(false);
    const loadQuantity = 3
    // Load initial items on mount
    useEffect(() => {
        const loadInitialItems = async () => {
            const initialItems = await fetchItems(tag, 1, loadQuantity); // Fetch first page of items
            setItems(initialItems);
        };
        loadInitialItems();
    }, []);

    // Function to fetch additional items
    const fetchMoreItems = useCallback(async () => {
        setLoadingMore(true);
        const newItems = await fetchItems(tag, page, loadQuantity);
        if (newItems.length < loadQuantity) {
            setEnd(true)
        }
        setItems((prevItems) => [...prevItems, ...newItems]);
        setPage((prevPage) => prevPage + 1);
        setLoadingMore(false);
    }, [page]);

    return (
        <LeadGrid
            end={end}
            items={items} // Use `items` instead of `initialItems`
            loadingMore={loadingMore}
            fetchMoreItems={fetchMoreItems}
        />
    );
}
