import {
  Avatar,
  Container,
  Group,
  Paper,
  Title,
  Text,
  Badge,
  Card,
  Stack,
} from "@mantine/core";

import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { GetPublicProfilePageData } from "~/serverUtilts";
import type { PublicProfilePageData } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { public_url } = params;
  const pageData = await GetPublicProfilePageData(public_url);
  if (pageData === "user_doesnt_exist") {
    throw new Response(null, {
      status: 404,
      statusText: "User doesnt exist",
    });
  }
  if (pageData === null) {
    throw new Response(null, {
      status: 500,
      statusText: "Error while getting data",
    });
  }
  if (pageData.user_comments !== null) {
    pageData.user_comments = pageData.user_comments.map((x) => {
      return { ...x, type: "comment" };
    });
  }
  if (pageData.user_likes !== null) {
    pageData.user_likes = pageData.user_likes.map((x) => {
      if (x.is_like === true) {
        return { ...x, type: "like" };
      }
      return { ...x, type: "dislike" };
    });
  }
  return pageData;
}

export function meta({ data }: { data: PublicProfilePageData }) {
  return [
    {
      title:
        data.raw_user_meta_data.first_name + " Profile | Politifools",
    },
  ];
}

export default function PublicProfilePage({
  loaderData,
}: {
  loaderData: PublicProfilePageData;
}) {
    console.log(loaderData);
    
  const userActivities = [
    ...(loaderData.user_comments ?? []),
    ...(loaderData.user_likes ?? []),
  ].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return (
    <Container size="lg" py="xl">
      <Paper shadow="xs" p="md" mb="xl">
        <Group justify="space-between">
          <Group>
            <Avatar size="xl" radius="xl" src={null} alt="User avatar" />
            <div>
              <Title order={2}>
                {loaderData.raw_user_meta_data.first_name}{" "}
                {loaderData.raw_user_meta_data.last_name}
              </Title>
              <Text c="dimmed">
                Member since {new Date(loaderData.created_at).toDateString()}
              </Text>
            </div>
          </Group>
          {loaderData.raw_user_meta_data.fk_party_affiliation !== 0 &&
            loaderData.raw_user_meta_data.fk_party_affiliation !== 3 && (
              <div style={{ marginLeft: "auto", textAlign: "center" }}>
                <img
                  src={
                    loaderData.raw_user_meta_data.fk_party_affiliation === 1
                      ? `/imgs/icons/republican_logo.svg`
                      : `/imgs/icons/democrat_logo.svg`
                  }
                  alt={
                    loaderData.raw_user_meta_data.fk_party_affiliation === 1
                      ? "Republican party elephant logo"
                      : "Democrat party donkey logo"
                  }
                  style={{
                    width: "75px", // Adjust width as needed
                    height: "auto", // Maintain aspect ratio
                    display: "block", // Center image
                    margin: "0 auto", // Center horizontally
                    borderRadius: "10px", // Slight rounding for a smoother look
                  }}
                />
              </div>
            )}
        </Group>
      </Paper>
      {/* Single List of Activities */}
      <Stack>
        {userActivities.length === 0 && (
          <span>This user has not left any comments or likes yet</span>
        )}
        {userActivities.map((activity, index) => (
          <Card key={index} shadow="md" radius="md" padding="lg" withBorder>
            <Group mb="xs">
              <Text
                fw={700}
                size="md"
                component="a"
                href={`/${activity.politician.level.url_path}/${activity.politician.position.url_path}/${activity.politician.url_path}`}
                style={{ textDecoration: "none", color: "#0077cc" }}
              >
                {activity.politician.name}
              </Text>
              {/* <Text size="sm" c="dimmed">
                  {new Date(activity.timestamp).toLocaleString()}
                </Text> */}
            </Group>
            <Group>
              {activity.type === "like" && (
                <Badge
                  color="green"
                  leftSection={<ThumbsUp size={16} />}
                  variant="light"
                >
                  Liked
                </Badge>
              )}
              {activity.type === "dislike" && (
                <Badge
                  color="red"
                  leftSection={<ThumbsDown size={16} />}
                  variant="light"
                >
                  Disliked
                </Badge>
              )}
              {activity.type === "comment" && (
                <Badge
                  color="blue"
                  leftSection={<MessageCircle size={16} />}
                  variant="light"
                >
                  Commented
                </Badge>
              )}
            </Group>
            {activity.type === "comment" && (
              <Text size="sm" mt="sm" c="gray">
                {/* @ts-ignore */}
                {activity.text}
              </Text>
            )}
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
