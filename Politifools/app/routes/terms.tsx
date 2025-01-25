import { Container, Stack, Title, Text } from "@mantine/core";

export function meta() {
  return [{ title: "Terms" }];
}

export default function TermsPage() {
  return (
    <Container size="md" py="xl">
      <Stack>
        {/* Introduction */}
        <Title order={1}>Terms of Service</Title>

        <Text>
          Welcome to PolitiFools! These Terms of Service outline the rules and
          guidelines for using our website. By accessing or using PolitiFools,
          you agree to comply with these terms. Failure to adhere to these
          guidelines may result in the suspension or termination of your
          account.
        </Text>

        {/* Commenting Guidelines */}
        <Title order={2}>Freedom to Comment</Title>
        <Text>
          PolitiFools is a platform where you can express your opinions about
          politicians and government officials. We believe in the importance of
          free speech and encourage open discussions and debates. You are free
          to:
        </Text>
        <ul>
          <li>Share your thoughts and opinions on politicians</li>
          <li>Criticize or praise political figures and policies</li>
        </ul>
        <Text>
          However, to maintain a respectful and inclusive environment, certain
          behaviors will not be tolerated.
        </Text>

        {/* Prohibited Content */}
        <Title order={2}>What Is Not Allowed</Title>
        <Text>
          While you are free to express your opinions, the following content is
          strictly prohibited:
        </Text>
        <ul>
          <li>
            <b>Hate Speech:</b> Comments that promote violence, hatred, or
            discrimination based on race, ethnicity, gender, religion, sexual
            orientation, or other protected characteristics.
          </li>
          <li>
            <b>Harassment:</b> Targeted harassment, bullying, or intimidation of
            any individual or group.
          </li>
          <li>
            <b>Threats of Violence:</b> Any content that contains threats to
            harm individuals, politicians, or organizations.
          </li>
          <li>
            <b>Illegal Content:</b> Sharing of illegal materials, or incitement
            to commit unlawful activities.
          </li>
        </ul>
        <Text>
          PolitiFools reserves the right to moderate or remove any content that
          violates these guidelines and to suspend accounts that engage in such
          behavior.
        </Text>

        {/* Our Commitment */}
        <Title order={2}>Our Commitment to You</Title>
        <Text>
          PolitiFools is dedicated to maintaining a space where users can engage
          in political discussions freely and responsibly. We are committed to:
        </Text>
        <ul>
          <li>Respecting your right to free expression.</li>
          <li>Ensuring a safe and inclusive platform for all users.</li>
          <li>Enforcing these terms fairly and transparently.</li>
        </ul>

        {/* Changes to These Terms */}
        <Title order={2}>Changes to These Terms</Title>
        <Text>We may update these Terms of Service from time to time.</Text>

        {/* Closing Note
        <Title order={2}>Contact Us</Title>
        <Text>
          If you have questions or concerns about these Terms of Service, please
          contact us at <b>support@politifools.com</b>.
        </Text> */}
      </Stack>
    </Container>
  );
}
