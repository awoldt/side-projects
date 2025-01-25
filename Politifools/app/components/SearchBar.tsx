/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInput, Box, Paper, Text } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "~/clientDB";

const Debounce = (fn: any, ms = 250) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);

  // Memoized debounce function
  const debouncedSearch = useMemo(() => {
    return Debounce(async (q: string) => {
      const { data, error } = await supabase
        .from("politicians")
        .select(
          "name, url_path, government_levels(url_path, name), government_positions(url_path, title), states(name)"
        )
        .ilike("name", `%${q}%`)
        .order("name", { ascending: true });

      if (error) {
        alert("Error while searching");
        return;
      }

      setResults(data);
    });
  }, []); // Dependency array is empty to ensure the same debounce function instance is reused

  useEffect(() => {
    if (query !== "") debouncedSearch(query);
    if (query === "") setResults(null);
  }, [query, debouncedSearch]);

  return (
    <>
      <TextInput
        placeholder="Search Politician"
        style={{ maxWidth: "600px", margin: "auto" }}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Hardcoded dropdown for search results */}
      {results && results.length > 0 && (
        <Paper
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            marginTop: "0.5rem",
            padding: "0.5rem",
          }}
          shadow="sm"
        >
          {results.map((result, index) => (
            <Box
              key={index}
              style={{ padding: "0.5rem", cursor: "pointer" }}
              onClick={() => {
                window.location.href = `/${result.government_levels.url_path}/${result.government_positions.url_path}/${result.url_path}`;
              }}
            >
              <Text fw={500}>{result.name}</Text>
              <Text size="xs" c="dimmed">
                {result.government_positions.title}
              </Text>
            </Box>
          ))}
        </Paper>
      )}
    </>
  );
}
