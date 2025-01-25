import { Container, Stack, Title, Text } from "@mantine/core";

export function meta() {
  return [
    { title: "Privacy" },
  ];
}




export default function PrivacyPage() {
  return (
    <Container size="md" py="xl">
      <Stack>
        {/* Introduction */}
        <Title order={1}>Privacy Policy</Title>
        <Text>
          <i>This Privacy Policy was last updated on December 14th, 2024</i>
        </Text>
        <Text>
          At PolitiFools, your privacy is of utmost importance to us. We are
          committed to being transparent about how we collect, use, and protect
          your personal information. This Privacy Policy explains what
          information we collect, how we use it, and your rights regarding your
          data.
        </Text>
        <Text>
          By using our website, you agree to the terms outlined in this Privacy
          Policy.
        </Text>

        {/* Information We Collect */}
        <Title order={2}>Information We Collect</Title>
        <Text>
          We value your trust and strive to collect only the minimum amount of
          personal information necessary to provide you with our services. The{" "}
          <b>only personally identifiable information</b> (PII) we collect is as
          follows:
        </Text>
        <ul>
          <li>
            <b>First Name</b>
          </li>
          <li>
            <b>Last Name</b>
          </li>
          <li>
            <b>Email Address</b>
          </li>
        </ul>
        <Text>
          This information is collected during account creation and is used
          solely to personalize your experience and to contact you when
          necessary (e.g., account verification, notifications).
        </Text>

        {/* What We Do NOT Collect */}
        <Title order={2}>
          What We Do <b>NOT</b> Collect
        </Title>
        <Text>We respect your privacy and want to assure you that:</Text>
        <ul>
          <li>
            <strong>We do not track you.</strong> We do not use cookies,
            analytics, or any other tracking mechanisms to monitor your activity
            on our site.
          </li>
          <li>
            We do not collect information about your browsing habits or
            location.
          </li>
          <li>
            We do not collect any sensitive data, such as your financial
            information, social security number, or physical address.
          </li>
        </ul>
        <Text>Your interactions with our site are private and secure.</Text>

        {/* How We Use Your Information */}
        <Title order={2}>How We Use Your Information</Title>
        <Text>
          The limited information we collect (first name, last name, and email)
          is used only for the following purposes:
        </Text>
        <ul>
          <li>To create and manage your account.</li>
          <li>To provide access to our features and services.</li>
          <li>
            To send you account-related notifications, such as password resets
            or confirmation emails.
          </li>
        </ul>
        <Text>
          We will <b>never</b> sell, rent, or share your personal information
          with third parties for marketing purposes.
        </Text>

        {/* Changes to This Policy */}
        <Title order={2}>Changes to This Policy</Title>
        <Text>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for legal reasons. If we make significant changes,
          we will notify you via email or by posting a prominent notice on our
          site.
        </Text>
      </Stack>
    </Container>
  );
}