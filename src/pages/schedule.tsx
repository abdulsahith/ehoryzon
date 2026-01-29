import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const scheduleData = [
  
  { name: "Pitch for Tomorrow - Open Innovations", date: "February 26" , venue: "Kongu Engineering College" },
  { name: "Pitch for Tomorrow - Mobility & Industry 4.0", date: "February 20" , venue: "Kongu Engineering College" },
  { name: "Pitch for Tomorrow - Deeptech", date: "February 21" , venue: "Kongu Engineering College" },
  { name: "Pitch for Tomorrow - Clean & Green Tech", date: "February 24" , venue: "Kongu Engineering College" },
   
  { name: "Pitch for Tomorrow - Agritech & Healthcare", date: "February 25" , venue: "Kongu Engineering College" },

  { name: "Mech Arena", date: "February 19" , venue: "Kongu Engineering College" },

  { name: "Webify", date: "February 19" , venue: "Kongu Engineering College" },

  { name: "Electrical Odyssey", date: "February 20" , venue: "Kongu Engineering College" },

  { name: "Game-a-thon", date: "February 20" , venue: "Kongu Engineering College" },

  { name: "Master Chef Mania", date: "February 21" , venue: "Kongu Engineering College" },

  { name: "Buildscape", date: "February 21" , venue: "Kongu Engineering College" },

  { name: "Stocks and Shares", date: "February 24" , venue: "Kongu Engineering College" },

  { name: "B-Plan", date: "February 24" , venue: "Kongu Engineering College" },

  { name: "DETx Forum", date: "February 23,24", venue: "Kongu Engineering College" },

  { name: "IPL Auction", date: "February 25" , venue: "Kongu Engineering College" },

  { name: "Product-Market Fit", date: "February 23", venue: "Kongu Engineering College" },

  { name: "Business Market Fit", date: "February 23", venue: "Kongu Engineering College" },

  { name: "Rising Capital & Finance", date: "February 23", venue: "Kongu Engineering College" },

  { name: "IPR & IP Management", date: "February 23", venue: "Kongu Engineering College" },

  { name: "Startup Legal & Ethical", date: "February 23", venue: "Kongu Engineering College" },

  { name: "திரை-Trivia (Short Film)", date: "February 19-26", venue: "Kongu Engineering College" },
  
];

export default function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to E-Horyzon
        </button>

        <h1 className="text-4xl md:text-6xl font-black mb-4">
          Event <span className="text-yellow-400">Schedule</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mb-12">
          Mark your calendars for the most awaited innovation festival. Find all event timings and venues below.
        </p>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-6 text-yellow-400 font-bold uppercase tracking-wider">Event Name</th>
                <th className="p-6 text-yellow-400 font-bold uppercase tracking-wider">Date & Day</th>
                <th className="p-6 text-yellow-400 font-bold uppercase tracking-wider">Venue</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((event, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-6 font-semibold">{event.name}</td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} className="text-yellow-400" />
                        {event.date}
                      </span>
                      <span className="text-sm text-white/50 ml-6">{event.day}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin size={14} className="text-yellow-400" />
                      {event.venue}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
