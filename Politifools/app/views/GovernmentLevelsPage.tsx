import {
  Container,
  Paper,
  Stack,
  Group,
  Text,
  Avatar,
  Title,
} from "@mantine/core";
import type { GovernmentLevelPageData } from "~/types";

export default function GovernmentLevelsPage({
  pageData,
}: {
  pageData: GovernmentLevelPageData;
}) {
  return (
    <>
      {/* Page Title */}
      <Title order={1} mb="lg">
        {pageData.gov_level_name}
      </Title>

      {/* Description */}
      <Text size="md" color="dimmed" mb="xl">
        Browse all politicians serving at the {pageData.gov_level_name} level.
      </Text>

      {/* List of Politicians */}
      <Stack>
        {pageData.politicians.map((politician) => (
          <Paper withBorder shadow="md" p="lg" radius="md" key={politician.id}>
            <a
              href={`/${pageData.gov_level_path}/${politician.position.url_path}/${politician.url_path}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Group>
                {/* Politician Avatar */}
                <Avatar
                  size="xl"
                  radius="xl"
                  src={`/imgs/${politician.url_path}.jpg`}
                  alt={politician.name}
                />

                {/* Politician Information */}
                <div style={{ flex: 1 }}>
                  <Text fw={700} size="lg">
                    {politician.name}
                  </Text>

                  {politician.description && (
                    <Text size="sm" mt="xs" color="dimmed">
                      {politician.description}
                    </Text>
                  )}
                </div>
              </Group>
            </a>
          </Paper>
        ))}
      </Stack>
    </>
  );
}
