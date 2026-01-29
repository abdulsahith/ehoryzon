import React, { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
}

const TRL_OPTIONS = [3, 4, 5, 6, 7, 8, 9];

// ✅ Replace these with your exact 5 themes
const THEME_OPTIONS = [
  { value: "Mobility & Industry 4.0", label: "Mobility & Industry 4.0" },
  { value: "Clean and green Tech (sustainability)", label: "Clean and green Tech (sustainability)" },
  { value: "AI and Deeptech", label: "AI and Deeptech" },
  { value: "Agritech and healthcare", label: "Agritech and healthcare" },
  { value: "Open innovation", label: "Open innovation" },
];

const emptyMember = (): TeamMember => ({
  name: "",
  email: "",
  phone: "",
  college: "",
  year: "",
});

export default function PitchRegister() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [trl, setTrl] = useState(3);
  const [theme, setTheme] = useState(THEME_OPTIONS[0].value);
  const [abstractFile, setAbstractFile] = useState<File | null>(null);

  // ✅ start with min 2
  const [members, setMembers] = useState<TeamMember[]>([emptyMember(), emptyMember()]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canAdd = members.length < 4;
  const canRemove = members.length > 2;

  // ✅ NEW: pitch description + coordinators (same style as other events)
  const pitchDescriptionLines = useMemo(
    () => [
      "The ultimate startup showcase and innovation challenge.",
      "Present your idea, product, or prototype to an expert panel and compete for the prize pool.",
      "Choose a theme, submit your abstract as PDF, and register as a team (2–4 members).",
    ],
    []
  );

  const coordinatorLeftName = "SaiSanjay M K";
  const coordinatorLeftPhone = "+91 9080938997";
  const coordinatorRightName = "Pragatheeswari ";
  const coordinatorRightPhone = "+91 6374040356";

  // ✅ success popup (no alert) - like other event register
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("Pitch registered successfully!");

  const abstractLabel = useMemo(() => {
    if (!abstractFile) return "Upload Abstract (PDF)";
    return abstractFile.name;
  }, [abstractFile]);

  const updateMember = (idx: number, key: keyof TeamMember, value: string) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const addMember = () => {
    if (!canAdd) return;
    setMembers((prev) => [...prev, emptyMember()]);
  };

  const removeMember = (idx: number) => {
    if (!canRemove) return;
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!teamName.trim()) return "Team name is required.";
    if (!abstractFile) return "Abstract PDF is required.";

    if (abstractFile) {
      const isPdf =
        abstractFile.type === "application/pdf" ||
        abstractFile.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) return "Abstract must be a PDF file.";
    }

    if (members.length < 2 || members.length > 4) return "Team must have 2 to 4 members.";

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) return `Member ${i + 1}: Name is required.`;
      if (!m.email.trim()) return `Member ${i + 1}: Email is required.`;
      if (!m.phone.trim()) return `Member ${i + 1}: Phone is required.`;
      if (!m.college.trim()) return `Member ${i + 1}: College name is required.`;
      if (!m.year.trim()) return `Member ${i + 1}: Year of studying is required.`;
    }

    return "";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSubmitting(true);

    try {
      // ✅ For Django: use multipart/form-data
      const formData = new FormData();
      formData.append("team_name", teamName);
      formData.append("trl_level", String(trl));
      formData.append("theme", theme);
      formData.append("abstract_pdf", abstractFile!);
      formData.append("members", JSON.stringify(members));

      // 🔁 Replace with your Django API
      const res = await fetch("https://sahith.xyz/pitch/register/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");

        let errorMessage = "Failed to submit registration.";

        if (contentType && contentType.includes("application/json")) {
          const payload = await res.json();
          errorMessage = JSON.stringify(payload);
        } else {
          errorMessage = await res.text();
        }

        throw new Error(errorMessage);
      }

      // ✅ show popup like other event register (no alert)
      setSuccessMsg("Pitch registered successfully!");
      setSuccessOpen(true);

      // auto navigate like other template
      setTimeout(() => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/");
      }, 1200);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-xl border-b border-yellow-600/20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-yellow-300 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="text-yellow-400 font-extrabold tracking-wide">
            Pitch Registration
          </div>

          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-3xl border border-yellow-600/25 bg-white/5 backdrop-blur-xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-yellow-400">
            Register for Pitch Competition
          </h1>

          {/* ✅ Event description + Coordinators like other events */}
          <div className="mt-4">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="text-white/80 space-y-1">
                {pitchDescriptionLines.slice(0, 3).map((ln, i) => (
                  <p key={i} className="leading-6">
                    {ln}
                  </p>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <a
                  href={`tel:${coordinatorLeftPhone}`}
                  className="flex-1 max-w-[47%] inline-flex flex-col items-center justify-center gap-1 rounded-full px-5 py-2 bg-white/10 backdrop-blur-md text-white/85 hover:bg-yellow-400 hover:text-black transition"
                >
                  <div className="text-sm font-medium text-white">{coordinatorLeftName}</div>
                  <div className="text-sm font-medium text-white">{coordinatorLeftPhone}</div>
                </a>

                <a
                  href={`tel:${coordinatorRightPhone}`}
                  className="flex-1 max-w-[47%] inline-flex flex-col items-center justify-center gap-1 rounded-full px-5 py-2 bg-white/10 backdrop-blur-md text-white/85 hover:bg-yellow-400 hover:text-black transition"
                >
                  <div className="text-sm font-medium text-white">{coordinatorRightName}</div>
                  <div className="text-sm font-medium text-white">{coordinatorRightPhone}</div>
                </a>
              </div>
            </div>
          </div>

          <p className="mt-3 text-white/70">
            Team size: <span className="text-white/90 font-semibold">2–4 members</span>. Upload abstract as PDF.
          </p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-10">
            {/* Team section */}
            <section className="space-y-5">
              <h2 className="text-xl font-extrabold text-white">Team & Project</h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-white/70">Team Name</label>
                  <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">TRL Level (Start from 3)</label>
                  <select
                    value={trl}
                    onChange={(e) => setTrl(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                  >
                    {TRL_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        TRL {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/70">Project Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                  >
                    {THEME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/70">Abstract PDF</label>

                  <label className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 cursor-pointer hover:border-yellow-500/50 transition">
                    <div className="flex items-center gap-3 text-white/85">
                      <Upload size={18} className="text-yellow-400" />
                      <span className="truncate">{abstractLabel}</span>
                    </div>
                    <span className="text-xs text-white/50">PDF only</span>

                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setAbstractFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* Members section */}
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold text-white">Team Members</h2>

                <button
                  type="button"
                  onClick={addMember}
                  disabled={!canAdd}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold transition
                    ${
                      canAdd
                        ? "bg-yellow-400 text-black hover:shadow-[0_0_18px_rgba(251,191,36,0.25)]"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }
                  `}
                >
                  <Plus size={18} /> Add Member
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-yellow-600/20 bg-black/30 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-white font-extrabold">
                        Member {idx + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        disabled={!canRemove}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition
                          ${
                            canRemove
                              ? "bg-white/10 text-white/80 hover:bg-white/15"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          }
                        `}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                      <input
                        value={m.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                        className="w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                        placeholder="Name"
                      />
                      <input
                        value={m.email}
                        onChange={(e) => updateMember(idx, "email", e.target.value)}
                        className="w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                        placeholder="Email"
                      />
                      <input
                        value={m.phone}
                        onChange={(e) => updateMember(idx, "phone", e.target.value)}
                        className="w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                        placeholder="Phone"
                      />
                      <input
                        value={m.college}
                        onChange={(e) => updateMember(idx, "college", e.target.value)}
                        className="w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                        placeholder="College Name"
                      />
                      <input
                        value={m.year}
                        onChange={(e) => updateMember(idx, "year", e.target.value)}
                        className="w-full rounded-2xl bg-black/40 border border-yellow-600/20 px-4 py-3 outline-none focus:border-yellow-500/60"
                        placeholder="Year of studying (e.g., 2nd year)"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-white/55">
                Minimum 2 members required. Maximum 4 members allowed.
              </p>
            </section>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 rounded-full px-6 py-4 font-black transition
                  ${
                    submitting
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-yellow-400 text-black hover:shadow-[0_0_26px_rgba(251,191,36,0.25)]"
                  }
                `}
              >
                {submitting ? "Submitting..." : "Submit Pitch Registration"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 rounded-full px-6 py-4 font-bold border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Success popup (no alert) */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-yellow-600/25 bg-black/90 p-6 shadow-xl">
            <div className="text-xl font-extrabold text-yellow-400">Thank you ✅</div>
            <div className="mt-2 text-white/80">{successMsg}</div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
                className="rounded-full px-5 py-2 bg-white/10 text-white hover:bg-white/15"
              >
                Stay
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessOpen(false);
                  if (window.history.length > 1) navigate(-1);
                  else navigate("/");
                }}
                className="rounded-full px-5 py-2 bg-yellow-400 text-black font-bold hover:bg-yellow-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
