import { z } from "zod";

const TechModel = z.object({
  languages: z.array(z.string().trim()),
  databases: z.array(z.string().trim()),
  apis: z.array(z.string().trim()),
  clouds: z.array(z.string().trim()),
  frameworks: z.array(z.string().trim()),
});

// ALL TECH USER CAN SHOWCASE FOR THEIR STACKS
export const TechOffered = TechModel.parse({
  languages: [
    "JavaScript",
    "CSharp",
    "Go",
    "Java",
    "Swift",
    "Rust",
    "Python",
  ].sort(),
  databases: [
    "MongoDB",
    "Postgres",
    "Mysql",
    "Microsoft SQL Server",
    "sqLite",
    "Cassandra",
    "Redis",
  ].sort(),
  apis: [
    "Spotify",
    "Stripe",
    "Notion",
    "Slack",
    "SendGrid",
    "Reddit",
    "Twitch",
  ].sort(),
  clouds: [
    "Google Cloud Platform",
    "AWS",
    "DigitalOcean",
    "Azure",
    "Heroku",
    "Oracle",
    "Vercel",
  ].sort(),
  frameworks: [
    "Nextjs",
    "Larvel",
    "Django",
    "Ruby on Rails",
    "Express",
    "Angular",
    "Spring Boot",
    "Remix"
  ].sort(),
});
