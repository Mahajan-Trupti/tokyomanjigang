import React, { useState, useEffect } from "react";
// We no longer need to import from react-bits, as we are creating a custom component.

// A custom component for a fade-in text animation
const FadeInText = ({ text }) => {
  const [showLetters, setShowLetters] = useState(false);

  useEffect(() => {
    // Show the letters after a small delay to enable the animation
    setTimeout(() => {
      setShowLetters(true);
    }, 100);
  }, []);

  return (
    <>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block transform transition-all duration-300 ease-in-out"
          style={{
            transitionDelay: `${index * 50}ms`,
            opacity: showLetters ? 1 : 0,
            transform: showLetters ? "scale(1)" : "scale(0.8)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
};

//creating variables for each member
const teamMembers = [
  {
    name: "Trupti Mahajan",
    image: "./trupti.jpg",
    branch: "IT",
    year: "2nd Year",
    bio: "i like cats",
  },
  {
    name: "Aditya Bhat",
    image: "./aditya.jpeg",
    branch: "ENTC",
    year: "2nd Year",
    bio: "siuuuuuuuuuuu",
  },
  {
    name: "Sarvesh Kalbhande",
    image: "./sarvesh.jpeg",
    branch: "ENTC",
    year: "2nd Year",
    bio: ":)",
  },
];

//the return function of aboutus.tsx
const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold tracking-widest text-white glow-text text-center mb-12">
          <FadeInText text="ABOUT THE CREATORS" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-center group transition-all duration-300 transform hover:scale-105"
              style={{ padding: "2rem", borderRadius: "1rem" }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-primary/50 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-white mb-1 glow-text-group-hover">
                {member.name}
              </h3>
              <p className="text-sm text-secondary mb-2 glow-text-group-hover">
                {member.branch}, {member.year}
              </p>
              <p className="text-base text-muted-foreground glow-text-group-hover">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
