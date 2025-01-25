import { ActionIcon, Group, Text } from "@mantine/core";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { supabase } from "~/clientDB";
import { AppContext } from "~/context/PoliticianPageContext";
import type { PoliticianPageData } from "~/types";

export async function LikeDislike(
  btnClicked: "thumbs_up" | "thumbs_down",
  currentStatus: "disliked" | "liked" | null,
  likeID: number | null,
  politicianID: number,
  userID: string,
  setPoliticianDetails: React.Dispatch<
    React.SetStateAction<PoliticianPageData | null>
  >
) {
  try {
    switch (currentStatus) {
      case "liked":
        if (btnClicked === "thumbs_up") {
          // Remove like
          const { error } = await supabase
            .from("likes")
            .delete()
            .eq("id", likeID);
          if (error) {
            alert("There was an error while removing the like");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes: prev.likes!.total_likes - 1,
                  total_dislikes: prev.likes!.total_dislikes,
                },
                user_has_liked: null, // Reset user_has_liked
              };
            });
          }
        } else {
          // Switch to dislike
          const { error } = await supabase
            .from("likes")
            .update({ is_like: false })
            .eq("id", likeID);
          if (error) {
            alert("There was an error while switching to dislike");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes: prev.likes!.total_likes - 1,
                  total_dislikes: prev.likes!.total_dislikes + 1,
                },
                user_has_liked: { id: likeID!, has_like: false },
              };
            });
          }
        }
        break;

      case "disliked":
        if (btnClicked === "thumbs_down") {
          // Remove dislike
          const { error } = await supabase
            .from("likes")
            .delete()
            .eq("id", likeID);
          if (error) {
            alert("There was an error while removing the dislike");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes: prev.likes!.total_likes,
                  total_dislikes: prev.likes!.total_dislikes - 1,
                },
                user_has_liked: null, // Reset user_has_liked
              };
            });
          }
        } else {
          // Switch to like
          const { error } = await supabase
            .from("likes")
            .update({ is_like: true })
            .eq("id", likeID);
          if (error) {
            alert("There was an error while switching to like");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes: prev.likes!.total_likes + 1,
                  total_dislikes: prev.likes!.total_dislikes - 1,
                },
                user_has_liked: { id: likeID!, has_like: true }, // Update to like
              };
            });
          }
        }
        break;

      case null:
        if (btnClicked === "thumbs_up") {
          // Add like
          const { error, data } = await supabase
            .from("likes")
            .insert({
              is_like: true,
              fk_politician_id: politicianID,
              fk_user_id: userID,
            })
            .select("id")
            .single();

          if (error) {
            alert("There was an error while adding the like");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes:
                    prev.likes === null ? 1 : prev.likes.total_likes + 1,
                  total_dislikes:
                    prev.likes === null ? 0 : prev.likes.total_dislikes,
                },
                user_has_liked: { id: data.id, has_like: true }, // New like
              };
            });
          }
        } else {
          // Add dislike
          const { error, data } = await supabase
            .from("likes")
            .insert({
              is_like: false,
              fk_politician_id: politicianID,
              fk_user_id: userID,
            })
            .select("id")
            .single();

          if (error) {
            alert("There was an error while adding the dislike");
          } else {
            setPoliticianDetails((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                likes: {
                  total_likes: prev.likes === null ? 0 : prev.likes.total_likes,
                  total_dislikes:
                    prev.likes === null ? 1 : prev.likes.total_dislikes + 1,
                },
                user_has_liked: { id: data.id, has_like: false }, // New dislike
              };
            });
          }
        }
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

export default function LikeDislikeBtns() {
  const { politicianDetails, setPoliticianDetails, userDetails } =
    useContext(AppContext);

  return (
    <>
      {politicianDetails !== null && (
        <Group gap="xs" mt="md">
          <ActionIcon
            variant="light"
            color={
              politicianDetails.user_has_liked !== null &&
              politicianDetails.user_has_liked.has_like === true
                ? "green"
                : "grey"
            }
            size="lg"
            radius="md"
            onClick={async () => {
              if (userDetails && politicianDetails) {
                await LikeDislike(
                  "thumbs_up",
                  politicianDetails.user_has_liked === null
                    ? null
                    : politicianDetails.user_has_liked.has_like
                    ? "liked"
                    : "disliked",
                  politicianDetails.user_has_liked === null
                    ? null
                    : politicianDetails.user_has_liked.id,
                  politicianDetails.id,
                  userDetails.id,
                  setPoliticianDetails
                );
              }
            }}
          >
            <ThumbsUp size={18} />
          </ActionIcon>

          <Text size="sm" c="dimmed">
            {politicianDetails?.likes?.total_likes ?? "0"}
          </Text>
          <ActionIcon
            variant="light"
            color={
              politicianDetails.user_has_liked !== null &&
              politicianDetails.user_has_liked.has_like === false
                ? "red"
                : "grey"
            }
            size="lg"
            radius="md"
            ml="xs"
            onClick={async () => {
              if (userDetails && politicianDetails) {
                await LikeDislike(
                  "thumbs_down",
                  politicianDetails.user_has_liked === null
                    ? null
                    : politicianDetails.user_has_liked.has_like
                    ? "liked"
                    : "disliked",
                  politicianDetails.user_has_liked === null
                    ? null
                    : politicianDetails.user_has_liked.id,
                  politicianDetails.id,
                  userDetails.id,
                  setPoliticianDetails
                );
              }
            }}
          >
            <ThumbsDown size={18} />
          </ActionIcon>

          <Text size="sm" c="dimmed">
            {politicianDetails?.likes?.total_dislikes ?? "0"}
          </Text>
        </Group>
      )}
    </>
  );
}
