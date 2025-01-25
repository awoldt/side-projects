import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Group,
  Title,
  Tabs,
  Stack,
} from "@mantine/core";
import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { GetBrowsePageData } from "~/serverUtilts";
import type { Politician } from "~/types";

const governmentLevels = ["Federal", "State", "County", "City"];
const parties = ["Democrat", "Republican", "Independent"];

export async function loader() {
  return await GetBrowsePageData();
}

interface PoliticanData extends Politician {
  party_name: string | null;
  government_level_name: string;
  position_name: string;
  government_level_path: string;
  government_position_path: string;
}


export function meta() {
  return [
    { title: "Browse Politicians" },
    {
      property: "og:title",
      content: "Browse Politicians",
    },
    {
      name: "description",
      content:
        "Browse our database of politicians, ranging from county to federal employees.",
    },
  ];
}



export default function BrowsePage({
  loaderData,
}: {
  loaderData: PoliticanData[] | null;
}) {
  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        Browse Politicians
      </Title>

      {loaderData === null && (
        <span>There was an error while getting page data :(</span>
      )}
      {loaderData !== null && (
        <Tabs defaultValue="government">
          <Tabs.List grow mb="md">
            <Tabs.Tab value="government">Government Levels</Tabs.Tab>
            <Tabs.Tab value="party">Political Parties</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="government">
            <Stack>
              {governmentLevels.map((level) => (
                <Card
                  key={level}
                  shadow="md"
                  radius="md"
                  withBorder
                  p="lg"
                  mb="md"
                >
                  <Title order={3} mb="md">
                    {level}
                  </Title>
                  <Grid>
                    {loaderData
                      .filter((p) => p.government_level_name === level)
                      .map((politician, index) => (
                        <Grid.Col
                          key={index}
                          span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                        >
                          <PoliticianCard politician={politician} />
                        </Grid.Col>
                      ))}
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="party">
            <Stack>
              {parties.map((party) => (
                <Card
                  key={party}
                  shadow="md"
                  radius="md"
                  withBorder
                  p="lg"
                  mb="md"
                >
                  <Title order={3} mb="md">
                    {party}
                  </Title>
                  <Grid>
                    {loaderData
                      .filter((p) => p.party_name === party)
                      .map((politician, index) => (
                        <Grid.Col
                          key={index}
                          span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                        >
                          <PoliticianCard politician={politician} />
                        </Grid.Col>
                      ))}
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  );
}

function PoliticianCard({ politician }: { politician: PoliticanData }) {
  return (
    <Card shadow="md" radius="md" withBorder>
      <a
        style={{ color: "inherit", textDecoration: "none" }}
        href={`/${politician.government_level_path}/${politician.government_position_path}/${politician.url_path}`}
      >
        <Card.Section>
          <Image
            src={`/imgs/${politician.url_path}.jpg`}
            alt={politician.name}
            height={160}
          />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{politician.name}</Text>
          {politician.party_name !== null && (
            <Badge
              color={
                politician.party_name === "Democrat"
                  ? "blue"
                  : politician.party_name === "Republican"
                  ? "red"
                  : "gray"
              }
            >
              {politician.party_name}
            </Badge>
          )}
        </Group>
        <Text size="sm" c="dimmed">
          {politician.position_name}
        </Text>
      </a>
    </Card>
  );
}
