import { Container, Paper, Stack } from "@mantine/core";
import CommentBox from "~/components/politicianPage/CommentBoxt";
import CommentsSection from "~/components/politicianPage/CommentsSection";
import ProfileHeader from "~/components/politicianPage/ProfileHeader";

export default function PoliticianPage() {
  return (
    <>
      <ProfileHeader />

      <Paper withBorder shadow="sm" radius="md" p="lg" mt="xl">
        <Stack gap="md">
          <CommentBox />

          <CommentsSection />
        </Stack>
      </Paper>
    </>
  );
}
