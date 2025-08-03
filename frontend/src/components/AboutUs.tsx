import React from "react";

const teamMembers = [
  {
    name: "Trupti Mahajan",
    image: "./trupti.jpg",
    branch: "IT",
    year: "2nd Year",
    bio: "DUMMY TEXT DUMMY TEXT DUMMY TEXT",
  },
  {
    name: "Aditya Bhat",
    image: "./aditya.jpg",
    branch: "ENTC",
    year: "2nd Year",
    bio: "DUMMY TEXT DUMMY TEXT DUMMY TEXT",
  },
  {
    name: "Sarvesh Kalbhande",
    image: "./sarvesh.jpeg",
    branch: "ENTC",
    year: "2nd Year",
    bio: "DUMMY TEXT DUMMY TEXT DUMMY TEXT",
  },
];

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold tracking-widest text-white glow-text text-center mb-12">
          ABOUT THE TEAM
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-primary/50 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-secondary mb-2">
                {member.branch}, {member.year}
              </p>
              <p className="text-base text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
