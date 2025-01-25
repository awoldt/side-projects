import {
  Container,
  Paper,
  Stack,
  Group,
  Text,
  Avatar,
  Title,
} from "@mantine/core";
import type { GovernmentPositionPageData } from "~/types";

export default function GovPositionPage({
  pageData,
}: {
  pageData: GovernmentPositionPageData;
}) {
  return (
    <>
      {/* Page Title */}
      <Title order={1} mb="lg">
        {pageData.title}
      </Title>

      {/* List of Politicians */}
      <Stack>
        {pageData.politicians.map((politician) => (
          <Paper withBorder shadow="md" p="lg" radius="md" key={politician.id}>
            <a
              href={`/${pageData.gov_level_path}/${pageData.url_path}/${politician.url_path}`}
            >
              {" "}
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
                </div>
              </Group>
            </a>
          </Paper>
        ))}
      </Stack>
    </>
  );
}
