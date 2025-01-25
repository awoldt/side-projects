/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useContext, useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Select,
  Alert,
} from "@mantine/core";
import {
  type UserSubmission,
  z_new_registrant,
  z_user_metadata,
} from "~/types";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/clientDB";

export const loader = async () => {
  const baseURL = process.env.BASE_URL;

  return { baseURL };
};

async function CreateNewUser(
  userDetails: UserSubmission,
  redirectURL: string,
  setloading: React.Dispatch<React.SetStateAction<boolean>>,
  setSuccessfulSignUp: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  setloading(true);

  try {
    const validForm = z_new_registrant.safeParse(userDetails);
    if (!validForm.success) {
      alert("Invalid credentials. Could not create account");
      return;
    }

    const metaData = z_user_metadata.safeParse({
      first_name: validForm.data.first_name,
      last_name: validForm.data.last_name,
      fk_party_affiliation: validForm.data.fk_party_affiliation,
      private_profile: false, // defaults to public, user has to set to private
      public_profile_url: "",
    });
    if (!metaData.success) {
      alert("Invalid metadata for user. Could not create account");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: validForm.data.email,
      password: validForm.data.password,
      options: {
        data: metaData.data,
        emailRedirectTo: redirectURL + "/confirm",
      },
    });
    if (error) {
      alert("There was an error while creating account");
      return;
    }

    setSuccessfulSignUp(true);
  } catch (error: any) {
    setError(error.toString());
  } finally {
    setloading(false);
  }
}

async function SignIn(
  email: string,
  password: string,
  setloading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setloading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error !== null) {
      alert("There was an error while signing in");
      return;
    }

    window.location.assign("/account");
  } catch (error) {
    console.log(error);
  } finally {
    setloading(false);
  }
}

export default function AuthPage({
  loaderData,
}: {
  loaderData: { baseURL: string };
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [newUser, setNewUser] = useState<UserSubmission>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    fk_party_affiliation: 0,
  });

  const [loading, setloading] = useState(false);
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Create an account or sign in
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error !== null && (
          <Alert
            variant="light"
            color="red"
            withCloseButton
            title="Error"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {successfulSignUp && (
          <Alert
            variant="light"
            color="green"
            title="Account successfully created!"
          >
            Check your email for the confirmation link
          </Alert>
        )}
        {!successfulSignUp && (
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value as "login" | "register")}
          >
            <Tabs.List grow mb="md">
              <Tabs.Tab value="login">Login</Tabs.Tab>
              <Tabs.Tab value="register">Register</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (newUser.email !== "" && newUser.password !== "") {
                    await SignIn(
                      newUser.email,
                      newUser.password,
                      setloading
                    );
                  }
                }}
              >
                <TextInput
                  disabled={loading}
                  label="Email"
                  placeholder="you@example.com"
                  required
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, email: e.target.value };
                    });
                  }}
                />
                <PasswordInput
                  disabled={loading}
                  label="Password"
                  placeholder="Your password"
                  required
                  mt="md"
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, password: e.target.value };
                    });
                  }}
                />

                <Button fullWidth mt="xl" type="submit" disabled={loading}>
                  Sign in
                </Button>
              </form>
            </Tabs.Panel>

            <Tabs.Panel value="register">
              <form
                onSubmit={async (e) => {
                  if (newUser.email !== "" && newUser.password !== "") {
                    e.preventDefault();
                    await CreateNewUser(
                      newUser,
                      loaderData.baseURL,
                      setloading,
                      setSuccessfulSignUp,
                      setError
                    );
                  }
                }}
              >
                <TextInput
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, first_name: e.target.value };
                    });
                  }}
                  disabled={loading}
                  label="First Name"
                  placeholder="Your first name"
                  required
                  mt="md"
                />
                <TextInput
                  disabled={loading}
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, last_name: e.target.value };
                    });
                  }}
                  label="Last Name"
                  placeholder="Your last name"
                  required
                  mt="md"
                />
                <Select
                  value={String(newUser.fk_party_affiliation)}
                  disabled={loading}
                  onChange={(value) => {
                    setNewUser((prev) => {
                      return { ...prev, fk_party_affiliation: Number(value) };
                    });
                  }}
                  label="Political Party"
                  placeholder="Select your political party"
                  required
                  mt="md"
                  data={[
                    { value: "0", label: "Prefer not to say" },
                    { value: "2", label: "Democrat" },
                    { value: "1", label: "Republican" },
                    { value: "3", label: "Independent/Other" },
                  ]}
                />
                <TextInput
                  disabled={loading}
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, email: e.target.value };
                    });
                  }}
                  label="Email"
                  placeholder="you@example.com"
                  required
                  mt="md"
                  type="email"
                />
                <PasswordInput
                  disabled={loading}
                  onChange={(e) => {
                    setNewUser((prev) => {
                      return { ...prev, password: e.target.value };
                    });
                  }}
                  label="Password"
                  placeholder="Your password"
                  required
                  mt="md"
                />
                <PasswordInput
                  disabled={loading}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                  mt="md"
                />

                <Button fullWidth mt="xl" type="submit" disabled={loading}>
                  Register
                </Button>
              </form>
            </Tabs.Panel>
          </Tabs>
        )}
      </Paper>
    </Container>
  );
}
