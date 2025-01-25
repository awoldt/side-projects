import { Avatar, Badge, Card, Flex, Title, Text } from "@mantine/core";
import { Building2, MapPin } from "lucide-react";
import LikeDislikeBtns from "./LikeDislikeBtns";
import { useContext } from "react";
import { AppContext } from "~/context/PoliticianPageContext";

export default function ProfileHeader() {
  const { politicianDetails } = useContext(AppContext);

  return (
    <>
      {politicianDetails !== null && (
        <Card withBorder shadow="sm" radius="md" p="lg">
          <Flex
            gap="lg"
            direction={{ base: "column", sm: "row" }} // Responsive direction
            align={{ base: "center", sm: "flex-start" }}
          >
            {/* Avatar */}
            <Avatar
              src={`/imgs/${politicianDetails.url_path}.jpg`}
              size={120}
              radius="md"
            />

            {/* Main Content */}
            <Flex direction="column" style={{ flex: 1 }}>
              <Flex gap="xs" align="center" wrap="wrap">
                <Title order={2}>{politicianDetails.name}</Title>
                {politicianDetails.party_name !== null && (
                  <Badge
                    color={
                      politicianDetails.party_name === "Republican"
                        ? "red.6"
                        : "blue.6"
                    }
                    variant="light"
                  >
                    {politicianDetails.party_name}
                  </Badge>
                )}
              </Flex>

              <Flex gap="lg" mt="xs" wrap="wrap" align="center">
                <Flex gap="xs" align="center">
                  <Building2 size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    <a
                      style={{ textDecoration: "none", color: "inherit" }}
                      href={`/${politicianDetails.gov_level_url_path}/${politicianDetails.gov_position_url_path}`}
                    >
                      {politicianDetails.position_title}
                    </a>
                  </Text>
                </Flex>

                {politicianDetails.state_name !== null && (
                  <Flex gap="xs" align="center">
                    <MapPin size={16} color="gray" />
                    <Text size="sm" c="dimmed">
                      {politicianDetails.state_name}
                    </Text>
                  </Flex>
                )}
              </Flex>

              {politicianDetails.description !== null && (
                <Text mt="lg" size="sm">
                  {politicianDetails.description}
                </Text>
              )}
            </Flex>
          </Flex>

          <LikeDislikeBtns />
        </Card>
      )}
    </>
  );
}
