import { ArrowLeft } from "lucide-react";

const TEAM = [
  { name: "Leonardo Bressan",   role: "Sales",               photo: "/team/leonardo.jpg" },
  { name: "Laura Toffoli",      role: "Finance",             photo: "/team/laura.jpg" },
  { name: "Giuseppe Montagner", role: "Software Developer",  photo: "/team/giuseppe.jpg" },
  { name: "Gautier Serres",     role: "Software Developer",  photo: "/team/gautier.jpg" },
  { name: "Matthieu Reder",     role: "Engineer",            photo: "/team/matthieu.jpg" },
];

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("");
}

const AVATAR_COLORS = ["#0F766E", "#1D4ED8", "#7C3AED", "#B45309", "#BE123C"];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-6">
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to home
        </a>
        <div className="h-4 w-px bg-gray-200" />
        <span className="font-black text-gray-900">
          Whiter<span className="text-primary">.</span>ai
        </span>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4">Our Team</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          The people building Whiter.ai — turning meetings into clarity.
        </p>
      </div>

      {/* Team grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map(({ name, role, photo }) => (
            <div
              key={name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <img
                src={photo}
                alt={name}
                className="w-20 h-20 rounded-full object-cover mb-5 border-2 border-gray-100"
              />
              <h2 className="text-lg font-bold text-gray-900 mb-1">{name}</h2>
              <p className="text-sm text-primary font-medium">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
