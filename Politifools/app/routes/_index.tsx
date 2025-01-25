import {
  Group,
  Title,
  Text,
  Container,
  Card,
  Button,
  Stack,
  Grid,
  Box,
} from "@mantine/core";

import { Building, ThumbsUpIcon, Ban } from "lucide-react";

export function meta() {
  return [
    { title: "PolitiFools - Review Your Political Representatives" },
    {
      property: "og:title",
      content: "PolitiFools - Leave a Review on Your Politicians",
    },
    {
      name: "description",
      content:
        "Create an account to share your voice! Leave reviews and ratings for political representatives, helping others stay informed and engaged in the political process.",
    },
  ];
}

export default function Page() {
  return (
    <Container size="lg" py="xl">
      <Stack>
        {/* Hero Section */}
        <Box py="xl" ta="center">
          <Title c="blue.8" order={1} size={40} fw={900}>
            Express Your Opinions Freely About Your Representatives
          </Title>
          <Text c="gray.7" size="xl" mt="md" maw={600} mx="auto">
            From city council to the federal level, make your opinions heard.
            Join thousands of citizens engaging in meaningful political
            discourse.
          </Text>
          <Group justify="center" mt="xl">
            <a href="/browse">
              <Button size="lg" variant="filled" color="blue.6">
                Browse Politicians
              </Button>
            </a>
          </Group>
        </Box>

        {/* Features Section */}
        <Grid gutter="md">
          {[
            {
              icon: Building,
              title: "Multiple Levels of Government",
              description:
                "Rate and review politicians at every level - federal, state, county, and city.",
            },
            {
              icon: ThumbsUpIcon,
              title: "Transparent Ratings",
              description:
                "See what others think about their representatives. All ratings are public and can be discussed openly.",
            },
            {
              icon: Ban,
              title: "No Censorship",
              description:
                "Our platform provides a safespace where you can speak your mind, no matter how crude your opinion is.",
            },
          ].map((feature) => (
            <Grid.Col key={feature.title} span={{ base: 12, md: 4 }}>
              <Card h="100%" bg="blue.2" c="black">
                <feature.icon size={32} />
                <Title size="lg" fw={700} mt="md" order={2}>
                  {feature.title}
                </Title>
                <Text size="sm" mt="sm">
                  {feature.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
