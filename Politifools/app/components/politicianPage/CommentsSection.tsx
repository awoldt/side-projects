import { useContext, useState } from "react";
import {
  Paper,
  Group,
  Stack,
  Text,
  Menu,
  ActionIcon,
  Modal,
  Button,
  TextInput,
} from "@mantine/core";
import type { Comment, PoliticianPageData } from "~/types";
import { Edit, Trash } from "lucide-react";
import { AppContext } from "~/context/PoliticianPageContext";
import { supabase } from "~/clientDB";

export default function CommentsSection() {
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState("");

  const { politicianDetails, setPoliticianDetails, userDetails } =
    useContext(AppContext);

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setEditText(comment.text);
    setOpenedEdit(true);
  };

  const handleDelete = (comment: Comment) => {
    setSelectedComment(comment);
    setOpenedDelete(true);
  };

  async function DeleteComment(
    commentID: number,
    userID: string,
    setPoliticianDetails: React.Dispatch<
      React.SetStateAction<PoliticianPageData | null>
    >
  ) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentID)
      .eq("fk_user_id", userID);

    if (error) {
      alert("There was an error while deleting your comment");
    }

    setPoliticianDetails((prev) => {
      if (prev === null) return null;

      const c = [...prev.all_comments!];

      const cToRemove = c.findIndex((x) => x.id === commentID);
      if (cToRemove !== -1) {
        c.splice(cToRemove, 1);
      }

      return {
        ...prev,
        all_comments: c,
      };
    });
  }

  async function UpdateComment(
    commentID: number,
    text: string,
    setPoliticianDetails: React.Dispatch<
      React.SetStateAction<PoliticianPageData | null>
    >
  ) {
    const { error } = await supabase
      .from("comments")
      .update({ text: text, updated_at: new Date() })
      .eq("id", commentID);

    if (error) {
      alert("There was an error while editing your comment");
    }

    setPoliticianDetails((prev) => {
      if (prev === null) return null;

      const c = [...prev.all_comments!];

      const cToUpdate = c.findIndex((x) => x.id === commentID);
      if (cToUpdate !== -1) {
        c[cToUpdate].text = text;
      }

      return {
        ...prev,
        all_comments: c,
      };
    });
  }

  return (
    <div>
      {!politicianDetails && (
        <span>There was an error while loading comments</span>
      )}

      {politicianDetails && (
        <>
          {politicianDetails.all_comments === null && (
            <span>There are no comments yet</span>
          )}
          {politicianDetails.all_comments &&
            politicianDetails.all_comments.map((x, i) => (
              <Paper p="md" mb={10} withBorder radius="md" key={i}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs">
                    <Group gap="xs" align="flex-start">
                      {/* Name */}
                      <Text size="sm" fw={700}>
                        {!x.raw_user_meta_data.private_profile && (
                          <a
                            href={`/user/${x.raw_user_meta_data.public_profile_url}`}
                          >
                            {x.raw_user_meta_data.first_name}{" "}
                            {x.raw_user_meta_data.last_name[0]}
                          </a>
                        )}
                        {x.raw_user_meta_data.private_profile && (
                          <>
                            {x.raw_user_meta_data.first_name}{" "}
                            {x.raw_user_meta_data.last_name[0]}
                          </>
                        )}
                      </Text>

                      {/* Party Image */}
                      {x.raw_user_meta_data.fk_party_affiliation !== 0 &&
                        x.raw_user_meta_data.fk_party_affiliation !== 3 && (
                          <img
                            src={
                              x.raw_user_meta_data.fk_party_affiliation === 1
                                ? `/imgs/icons/republican_logo.svg`
                                : `/imgs/icons/democrat_logo.svg`
                            }
                            alt={
                              x.raw_user_meta_data.fk_party_affiliation === 1
                                ? "Republican party elephant logo"
                                : "Democrat party donkey logo"
                            }
                            style={{
                              width: "20px",
                              height: "auto",
                              display: "block",
                            }}
                          />
                        )}

                      {/* Date */}
                      <Text size="sm" c="dimmed">
                        {new Date(x.created_at).toDateString()}
                      </Text>
                    </Group>

                    {/* Comment Text */}
                    <Text>{x.text}</Text>
                  </Stack>
                  {userDetails !== null && x.fk_user_id === userDetails.id && (
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <Edit size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<Edit size={14} />}
                          onClick={() => handleEdit(x)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<Trash size={14} />}
                          color="red"
                          onClick={() => handleDelete(x)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Group>
              </Paper>
            ))}
        </>
      )}

      {/* Edit Modal */}
      <Modal
        opened={openedEdit}
        onClose={() => setOpenedEdit(false)}
        title="Edit Comment"
      >
        <TextInput
          label="Comment"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
        <Group mt="md" justify="flex-end">
          <Button onClick={() => setOpenedEdit(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (selectedComment !== null) {
                await UpdateComment(
                  selectedComment.id,
                  editText,
                  setPoliticianDetails
                );
                setSelectedComment(null);
                setEditText("");
                setOpenedEdit(false);
              }
            }}
          >
            Save
          </Button>
        </Group>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={openedDelete}
        onClose={() => setOpenedDelete(false)}
        title="Confirm Deletion"
      >
        <Text>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </Text>
        <Group mt="md" justify="flex-end">
          <Button onClick={() => setOpenedDelete(false)} variant="outline">
            Cancel
          </Button>
          <Button
            color="red"
            onClick={async () => {
              if (selectedComment && userDetails) {
                await DeleteComment(
                  selectedComment.id,
                  userDetails.id,
                  setPoliticianDetails
                );
                setSelectedComment(null);
                setOpenedDelete(false);
              }
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
