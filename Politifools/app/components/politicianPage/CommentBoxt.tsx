import { ActionIcon, Group, Textarea } from "@mantine/core";
import { Send } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { supabase } from "~/clientDB";
import { AppContext } from "~/context/PoliticianPageContext";
import { type PoliticianPageData, z_new_comment } from "~/types";

async function PostComment(
  c: {
    text: string;
    fk_politician_id: number;
    fk_user_id: string;
  },
  setPoliticianDetails: React.Dispatch<
    React.SetStateAction<PoliticianPageData | null>
  >,
  setComment: React.Dispatch<React.SetStateAction<string>>
) {
  const validComment = z_new_comment.safeParse(c);
  if (!validComment.success) {
    alert("Bad comment");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(validComment.data)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    const u = await supabase.auth.getSession();

    setPoliticianDetails((prev) => {
      if (prev === null) return prev;

      return {
        ...prev,
        all_comments: [
          ...(prev.all_comments ?? []),
          {
            ...data[0],
            raw_user_meta_data: u.data.session!.user.user_metadata,
          },
        ],
      };
    });
    setComment("");
  } catch (error) {
    console.log(error);
    alert("Error while leaving comment");
  }
}

export default function CommentBox() {
  const { politicianDetails, setPoliticianDetails, userDetails } =
    useContext(AppContext);

  const [comment, setComment] = useState("");
  const [hasUserCommented, setHasUserCommented] = useState<boolean>();

  return (
    <>
      <span>Comments ({politicianDetails?.all_comments?.length ?? "0"})</span>
      {userDetails !== null && politicianDetails && (
        <Group>
          <Textarea
            disabled={hasUserCommented}
            placeholder="Add your comment..."
            style={{ flex: 1 }}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <ActionIcon
            disabled={hasUserCommented}
            variant="filled"
            color="blue.6"
            size="lg"
            radius="md"
            onClick={async () => {
              if (!hasUserCommented) {
                await PostComment(
                  {
                    text: comment,
                    fk_politician_id: politicianDetails.id,
                    fk_user_id: userDetails.id,
                  },
                  setPoliticianDetails,
                  setComment
                );
              }
            }}
          >
            <Send size={18} />
          </ActionIcon>
        </Group>
      )}
      {userDetails === null && (
        <span>Create an account to leave comments.</span>
      )}
    </>
  );
}
