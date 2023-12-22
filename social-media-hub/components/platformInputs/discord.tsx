import { useState, useRef } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { text_channel_data } from "../../interface/user";
import discord_me from "../../interface/discord/me";
export default function DiscordInput({
  usersTextChannels,
  me,
  discordAuthUrl,
}: {
  usersTextChannels: null | text_channel_data[];
  me: discord_me | null;
  discordAuthUrl: string;
}) {
  const [discordMessage, setDiscordMessage] = useState<string>("");
  const [currentTextChannelId, setCurrentTextChannelId] = useState<string>(
    usersTextChannels! ? usersTextChannels![0].id : ""
  ); //the current guild to send a message to
  const [showAllowChannelAccessLink, setShowChannelAccessLink] =
    useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const messageTextAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        backgroundColor: "#7289da",
        padding: "20px",
        borderRadius: "10px",
        border: "5px solid #465587",
      }}
    >
      <img src="/icons/discord.svg" alt="discord logo" />
      {me! && (
        <div style={{ float: "right", fontWeight: "bold" }}>
          {me.avatar! && (
            <img
              src={me.avatar!}
              alt={me.username + " discord profile image"}
              style={{
                marginRight: "10px",
                borderRadius: "35px",
                width: "50px",
              }}
            />
          )}

          <span>{me.username}</span>
        </div>
      )}
      <div style={{ padding: "15px" }}>
        {usersTextChannels === null && (
          <>
            <code>
              You currently do not have any text channels to post to from
              servers you own
            </code>
          </>
        )}
        {usersTextChannels! && (
          <>
            <p className="mb-1" style={{ color: "white" }}>
              Select what text channel you would like to post a message to
            </p>
            <Form.Select
              style={{ maxWidth: "200px" }}
              onChange={(e) => {
                setCurrentTextChannelId(e.target.value);
              }}
            >
              {usersTextChannels.map((x, index) => {
                return (
                  <option value={x.id} key={index}>
                    {x.server_name}
                  </option>
                );
              })}
            </Form.Select>
          </>
        )}
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
          }}
        >
          {showAllowChannelAccessLink && (
            <>
              <p>
                You must first allow access to the channel you are attempting to
                post to...
              </p>
              <a href="https://discord.com/api/oauth2/authorize?client_id=1039983449882239059&permissions=274878175232&scope=bot">
                Click here to authenticate
              </a>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control
              ref={messageTextAreaRef}
              placeholder="Type message here"
              as={"textarea"}
              onChange={(e) => {
                setDiscordMessage(e.target.value);
              }}
              required
              style={{ border: "1px solid black" }}
            />
          </Form.Group>

          {loading && <Spinner animation="grow" style={{ color: "#465587" }} />}
          {discordMessage !== "" && !loading && (
            <Button
              style={{ backgroundColor: "#465587", border: "none" }}
              type="submit"
              onClick={async () => {
                setLoading(true);
                if (currentTextChannelId === "") {
                  setLoading(false);
                  alert("you cannot send a message with no text channel id");
                } else {
                  const data = await axios.post("/api/discord/postMessage", {
                    message: discordMessage,
                    guild_id: currentTextChannelId,
                  });

                  if (data.data.status !== 200) {
                    setLoading(false);
                    setMessageAlert(data.data.msg);
                    setShowChannelAccessLink(true);
                  } else {
                    setLoading(false);
                    setMessageAlert(data.data.msg);
                    setDiscordMessage("");
                    messageTextAreaRef.current!.value = "";
                  }
                }
              }}
            >
              Send Message
            </Button>
          )}
          {messageAlert !== "" && discordMessage === "" && (
            <code style={{ color: "white" }}>{messageAlert}</code>
          )}
        </Form>

        <a href={discordAuthUrl} style={{ color: "white" }}>
          Don&apos;t see the server you want to post to?
        </a>
      </div>
    </div>
  );
}
