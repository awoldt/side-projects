import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Disc3, Music2, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { useOutletContext } from "@remix-run/react";
import { AppContext } from "~/types";

export default function Index() {
  const context = useOutletContext<AppContext>();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    if (!showUI) {
      const timer = setTimeout(() => {
        setShowUI(true);
      }, 250);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showUI]);

  const faqs = [
    {
      question: "How many playlists can I create?",
      answer: "You can create up to 10 playlists with our service.",
    },
    {
      question: "Do I need a Spotify account?",
      answer: "Yes, a Spotify account is required to use our service.",
    },
    {
      question: "Who owns created playlists?",
      answer:
        "You retain full ownership of all playlists created with our tool.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        {showUI && (
          <div className="container mx-auto px-4 py-16">
            <motion.h1
              className="text-5xl font-bold text-center mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Random Playlist Generator
            </motion.h1>
            <motion.p
              className="max-w-xl mx-auto mb-5 mt-5 text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Connect your Spotify account with JamSpin and start creating
              playlists that add to your library with ease. These playlists will
              update in the background with no action on your part. Have a
              never-ending stream of new music to discover.
            </motion.p>
            <motion.div
              className="flex justify-center mb-16"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <a
                style={{ textDecoration: "none" }}
                href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${context.spotifyClientID}&scope=playlist-modify-private,playlist-modify-public&redirect_uri=${context.spotifyRedirectURI}`}
              >
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                  Sign in with Spotify
                </button>
              </a>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Disc3,
                  title: "Auto-Refreshed Playlists",
                  description: "Set your preferences and let the magic happen",
                },
                {
                  icon: Music2,
                  title: "Over 140 Genres",
                  description:
                    "From Rock to Jazz, Hip-Hop to Classical, we've got you covered",
                },
                {
                  icon: ThumbsUp,
                  title: "Easy to Use",
                  description: "Simple interface for a seamless experience",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-center items-center mb-4">
                    <feature.icon className="w-12 h-12 text-pink-300" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-gray-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">FAQs</h2>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="mb-4 bg-white bg-opacity-10 rounded-lg overflow-hidden backdrop-blur-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    className="w-full p-4 text-left flex justify-between items-center font-semibold"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {faq.question}
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="p-4 bg-opacity-5">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <footer className="mt-40 mb-10 text-center">
              <a href="/privacy" title="View JamSpin's Privacy Policy">
                <b>Privacy</b>
              </a>
              <p className="mt-5">
                JamSpin is not associated with Spotify. Any Spotify logos or
                trademarks displayed are the property of Spotify and their
                respective owners
              </p>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}
