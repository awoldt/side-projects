import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  ActionIcon,
  Modal,
  Switch,
  Button,
  Divider,
  Select,
} from "@mantine/core";
import {
  MessageCircle,
  Settings,
  ThumbsDown,
  ThumbsUp,
  Worm,
} from "lucide-react";

import type { User } from "@supabase/supabase-js";
import { supabase } from "~/clientDB";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

interface UserActivity {
  type: "like" | "dislike" | "comment";
  politician_name: string;
  politician_position: string;
  politician_level: string;
  politician_url_path: string;
  timestamp: string;
  comment_text?: string; // for comments
}

export async function loader({ request }: { request: Request }) {
  const supabaseServer = createServerClient(
    "https://elsxssomogmdzputaijs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3hzc29tb2dtZHpwdXRhaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NjgwNzAsImV4cCI6MjA0NjQ0NDA3MH0.Br2TzV9lOuyqvr68BK9r5dPYUCNI0uAjyTj9Pl7tdLM",
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
  const user = await supabaseServer.auth.getUser();

  let userActivity: UserActivity[] = [];

  if (user.data.user !== null) {
    const comments = await supabaseServer
      .from("comments")
      .select(
        "*, politicians(name, url_path, fk_government_positions_id, fk_government_levels_id, government_levels(url_path), government_positions(url_path))"
      )
      .eq("fk_user_id", user.data.user.id);

    const likes = await supabaseServer
      .from("likes")
      .select(
        "*, politicians(name, url_path, fk_government_positions_id, fk_government_levels_id, government_levels(url_path), government_positions(url_path))"
      )
      .eq("fk_user_id", user.data.user.id);

    if (comments.error === null) {
      for (let i = 0; i < comments.data.length; i++) {
        userActivity.push({
          type: "comment",
          politician_name: comments.data[i].politicians.name,
          politician_position:
            comments.data[i].politicians.government_positions.url_path,
          politician_level:
            comments.data[i].politicians.government_levels.url_path,
          politician_url_path: comments.data[i].politicians.url_path,
          timestamp: comments.data[i].created_at,
          comment_text: comments.data[i].text,
        });
      }
    }

    if (likes.error === null) {
      for (let i = 0; i < likes.data.length; i++) {
        userActivity.push({
          type: likes.data[i].is_like ? "like" : "dislike",
          politician_name: likes.data[i].politicians.name,
          politician_position:
            likes.data[i].politicians.government_positions.url_path,
          politician_level:
            likes.data[i].politicians.government_levels.url_path,
          politician_url_path: likes.data[i].politicians.url_path,
          timestamp: likes.data[i].created_at,
        });
      }
    }
  }

  return { user: user.data.user, userActivity };
}

const HandleDeleteAccount = async (user: User) => {
  if (user) {
    const req = await fetch("/api/delete_account", {
      method: "post",
      body: JSON.stringify({ userID: user.id }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!req.ok) {
      alert("There was an error while deleting account");
      return;
    }

    // sign out
    await supabase.auth.signOut();

    window.location.assign("/");
  }
};

export default function UserProfile({
  loaderData,
}: {
  loaderData: {
    user: User | null;
    userActivity: UserActivity[];
  };
}) {
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [isPrivateProfile, setIsPrivateProfile] = useState(
    loaderData.user?.user_metadata.private_profile
  );

  const [politicalParty, setPoliticalParty] = useState<string | null>(
    String(loaderData.user?.user_metadata.fk_party_affiliation ?? null)
  );

  useEffect(() => {
    if (loaderData.user === null) {
      window.location.assign("/signin");
    }
  }, []);

  return (
    <>
      {loaderData.user !== null && (
        <>
          {/* User Info Section */}
          <Paper shadow="xs" p="md" mb="xl">
            <Group justify="space-between">
              <Group>
                <Avatar size="xl" radius="xl" src={null} alt="User avatar" />
                <div>
                  <Title order={2}>
                    {loaderData.user.user_metadata.first_name +
                      " " +
                      loaderData.user.user_metadata.last_name}
                  </Title>
                  <Text c="dimmed">
                    Member since{" "}
                    {new Date(loaderData.user.created_at).toDateString()}
                  </Text>
                  {/* Sign Out Button */}
                  <Button
                    mt="xs"
                    variant="outline"
                    color="red"
                    size="sm"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.assign("/signin");
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </Group>
              <ActionIcon
                variant="subtle"
                onClick={() => setSettingsOpened(true)}
              >
                <Settings size={20} />
              </ActionIcon>
            </Group>
          </Paper>

          {/* Activity Tabs */}
          <Tabs defaultValue="all">
            <Tabs.List>
              <Tabs.Tab value="all">All Activity</Tabs.Tab>
              <Tabs.Tab value="likes">Likes</Tabs.Tab>
              <Tabs.Tab value="comments">Comments</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="all" pt="xl">
              <Stack>
                {loaderData.userActivity.map((activity, index) => (
                  <Card
                    key={index}
                    shadow="md"
                    radius="md"
                    padding="lg"
                    withBorder
                  >
                    <Group mb="xs">
                      {/* Politician Name */}
                      <Text
                        fw={700}
                        size="md"
                        component="a"
                        href={`/${activity.politician_level}/${activity.politician_position}/${activity.politician_url_path}`}
                        style={{ textDecoration: "none", color: "#0077cc" }}
                      >
                        {activity.politician_name}
                      </Text>
                      {/* Formatted Timestamp */}
                      <Text size="sm" c="dimmed">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Text>
                    </Group>

                    {/* Activity Type */}
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

                    {/* Comment Text */}
                    {activity.comment_text && (
                      <Text size="sm" mt="sm" c="gray">
                        {activity.comment_text}
                      </Text>
                    )}
                  </Card>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="likes" pt="xl">
              <Stack>
                {loaderData.userActivity
                  .filter(
                    (activity: UserActivity) =>
                      activity.type === "like" || activity.type === "dislike"
                  )
                  .map((activity, index) => (
                    <Card
                      key={index}
                      shadow="md"
                      radius="md"
                      padding="lg"
                      withBorder
                    >
                      <Group>
                        {/* Politician Name */}
                        <Text
                          fw={700}
                          size="md"
                          component="a"
                          href={`/${activity.politician_level}/${activity.politician_position}/${activity.politician_url_path}`}
                          style={{
                            textDecoration: "none",
                            color: "#0077cc",
                          }}
                        >
                          {activity.politician_name}
                        </Text>
                        {/* Badge for Like/Dislike */}
                        <Badge
                          color={activity.type === "like" ? "green" : "red"}
                          leftSection={
                            activity.type === "like" ? (
                              <ThumbsUp size={16} />
                            ) : (
                              <ThumbsDown size={16} />
                            )
                          }
                          variant="light"
                        >
                          {activity.type === "like" ? "Liked" : "Disliked"}
                        </Badge>
                      </Group>
                      {/* Timestamp */}
                      <Text size="sm" c="dimmed" mt="xs">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Text>
                    </Card>
                  ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="comments" pt="xl">
              <Stack>
                {loaderData.userActivity
                  .filter(
                    (activity: UserActivity) => activity.type === "comment"
                  )
                  .map((activity, index) => (
                    <Card
                      key={index}
                      shadow="md"
                      radius="md"
                      padding="lg"
                      withBorder
                    >
                      <Group mb="xs">
                        {/* Politician Name */}
                        <Text
                          fw={700}
                          size="md"
                          component="a"
                          href={`/${activity.politician_level}/${activity.politician_position}/${activity.politician_url_path}`}
                          style={{
                            textDecoration: "none",
                            color: "#0077cc",
                          }}
                        >
                          {activity.politician_name}
                        </Text>
                        {/* Timestamp */}
                        <Text size="sm" c="dimmed">
                          {new Date(activity.timestamp).toLocaleString()}
                        </Text>
                      </Group>
                      {/* Comment Text */}
                      <Text size="sm" mt="sm" c="gray">
                        {activity.comment_text}
                      </Text>
                    </Card>
                  ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>

          {/* Settings Modal */}
          <Modal
            opened={settingsOpened}
            onClose={() => setSettingsOpened(false)}
            title="Settings"
          >
            <Stack>
              {/* Private Profile Switch */}
              <Switch
                label="Private Profile"
                description="Make your profile visible only to you"
                checked={isPrivateProfile}
                onChange={(event) => {
                  supabase.auth.updateUser({
                    data: { private_profile: event.target.checked },
                  });
                  setIsPrivateProfile(event.target.checked);
                }}
                value={loaderData.user.user_metadata.private_profile}
              />

              {/* Political Party Dropdown */}
              {politicalParty !== null && (
                <Select
                  value={politicalParty} // Convert the value to a string
                  onChange={async (value) => {
                    if (value !== null) {
                      // Update the user's political affiliation in Supabase only if needed
                      if (String(politicalParty) !== value) {
                        await supabase.auth.updateUser({
                          data: { fk_party_affiliation: Number(value) }, // Convert back to a number for backend
                        });
                      }

                      // Update the local state to match the selected value
                      setPoliticalParty(value);
                    }
                  }}
                  label="Political Party"
                  placeholder="Select your political party"
                  data={[
                    { value: "0", label: "Prefer not to say" },
                    { value: "2", label: "Democrat" },
                    { value: "1", label: "Republican" },
                    { value: "3", label: "Independent/Other" },
                  ]}
                />
              )}
            </Stack>

            {/* Divider */}
            <Divider my={10} />

            {/* Delete Account Button */}
            <Button
              color="red"
              onClick={() => {
                setSettingsOpened(false);
                setDeleteModalOpened(true);
              }}
            >
              Delete Account
            </Button>
          </Modal>

          {/* Delete Account Confirmation Modal */}
          <Modal
            opened={deleteModalOpened}
            onClose={() => {
              setDeleteStep(0);
              setDeleteModalOpened(false);
            }}
            title={
              deleteStep === 0
                ? "Are you sure you want to delete your account?"
                : deleteStep === 1
                ? "Final Confirmation"
                : "Account Deleted"
            }
          >
            <Stack>
              {deleteStep === 0 && (
                <>
                  <Text>
                    Deleting your account will remove all your data from our
                    servers. This action is irreversible.
                  </Text>
                  <Group>
                    <Button
                      variant="default"
                      onClick={() => {
                        setDeleteStep(0);
                        setDeleteModalOpened(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button color="red" onClick={() => setDeleteStep(1)}>
                      Continue
                    </Button>
                  </Group>
                </>
              )}

              {deleteStep === 1 && (
                <>
                  <Text>
                    This is your last chance to cancel. Are you absolutely sure
                    you want to delete your account?
                  </Text>
                  <Group>
                    <Button
                      variant="default"
                      onClick={() => {
                        setDeleteStep(0);
                        setDeleteModalOpened(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="red"
                      onClick={async () => {
                        if (loaderData.user !== null) {
                          await HandleDeleteAccount(loaderData.user);
                        }
                      }}
                    >
                      Delete My Account
                    </Button>
                  </Group>
                </>
              )}

              {deleteStep === 2 && (
                <>
                  <Text>Your account has been successfully deleted.</Text>
                  <Group>
                    <Button
                      onClick={() => {
                        setDeleteStep(0);
                        setDeleteModalOpened(false);
                      }}
                    >
                      Close
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Modal>
        </>
      )}
    </>
  );
}
