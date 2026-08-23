import React, { useState } from "react";
import { MapPin, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
interface EventType {
  title: string;
  venue: string;
  time: string;
  description: string;
  formLink: string;
  speaker?: string;
}

type EventFormType = {
  [key: string]: EventType[];
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string;
}

// --- SHARED HELPERS ---

// Extracts ONLY the starting time for display purposes
const getDisplayTime = (timeStr: string) => {
  // 1. Hackathon: "Sep 01 (11:30 AM - Sep 02 12:30 PM)"
  if (timeStr.startsWith("Sep")) {
    const match = timeStr.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))/);
    if (match) return match[1];
  }
  // 2. Showcase: "From 11:00 AM onwards"
  if (timeStr.startsWith("From")) {
    const parts = timeStr.split(" ");
    return `${parts[1]} ${parts[2]}`;
  }
  // 3. Standard or single formats: "08:30 AM - 09:30 AM" or "11:30 AM"
  return timeStr.split("-")[0].trim();
};

// Converts string to minutes for accurate chronological sorting
const getTimeValue = (timeStr: string) => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (match) {
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const amPm = match[3];
    if (amPm === "PM" && hour !== 12) hour += 12;
    if (amPm === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  return 0;
};

// --- MODAL COMPONENT ---
const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, day }) => {
  if (!isOpen) return null;

  const eventForms: EventFormType = {
    "Day 1": [
      
      {
        title: "Deep Sprint Hackathon",
        venue: "Parthasarathy Auditorium",
        time: "11:30 AM",
        description: "A 25-hour deep-tech hackathon featuring tracks in Additive Manufacturing, Biomedical, Robotics, and more.",
        formLink: "https://docs.google.com/forms/d/e/1FAIpQLSeU7Pe9VXV0zCQnSODBmiaz2JhmV1q7RpzVwqyuOIGLrbYZZA/viewform",
      },
      {
        title: "Product showcase",
        venue: "Centre of Excellences",
        time: "11:00 AM",
        description: "Live showcase of innovative products, technologies and solutions.",
        formLink: "https://docs.google.com/forms/d/e/1FAIpQLSdu68elLaHc1VesbvnwBkXp6Zm6GG84Dt5-FgWJrxCtCKqA3Q/viewform",
      },
    ],
    "Day 3": [
      {
        title: "Demo Day",
        venue: "Bonfiglioli Conf hall",
        time: "10:00 AM ",
        description: "Where Startups Take the Stage – pitch to investors, incubators, industry experts, and mentors. Get visibility, feedback, and funding connections.",
        formLink: "https://docs.google.com/forms/d/e/1FAIpQLSfdLgVS_sbgX6q7MS3doSWCWV-vUGkF0rFh9nNv8totT1bICg/viewform",
      },
      {
        title: "Product show case",
        venue: "Centre of Excellences",
        time: "09:00 AM ",
        description: "Continuous showcase of innovative products, allowing startups and innovators to demonstrate their work.",
        formLink: "https://docs.google.com/forms/d/e/1FAIpQLSdu68elLaHc1VesbvnwBkXp6Zm6GG84Dt5-FgWJrxCtCKqA3Q/viewform",
      },
      {
        title: "DPIIT- Mentor Connect",
        venue: "Parthasarathy Auditorium",
        time: "10:00 AM",
        description: "Connect. Pitch. Grow. In association with StartupTN – network with DPIIT and industry mentors to accelerate your venture.",
        formLink: "https://docs.google.com/forms/d/1X1rGGuA4RbusVBl8eLkY0SEiC7wbeoh_UOYqoeEpMT4/viewform?edit_requested=true",
      },
      
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Register for {day} Events
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            {eventForms[day]?.map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  {event.title}
                </h4>
                <div className="text-gray-500 flex items-center mt-1 text-xs">
                  <Clock className="h-3 w-3 text-blue-600 mr-1" /> {getDisplayTime(event.time)}
                </div>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" /> {event.venue}
                </p>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {event.description}
                </p>
                <a
                  href={event.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register for {event.title}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN EVENTS COMPONENT ---
const Events = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const navigate = useNavigate();

  const days = [
    {
      date: "September 1, 2026",
      day: "Day 1",
      theme: "Igniting the Ecosystem",
      events: [
        { title: "Inauguration - Innovest", venue: "Parthasarathy Auditorium", time: "08:30 AM - 09:30 AM" },
        { title: "EDC Onboarding", venue: "Parthasarathy Auditorium", time: "09:30 AM - 09:45 AM" },
        { title: "Keynote Session 1 ", venue: "Kaveri Auditorium", time: "10:30 AM - 12:00 PM" },
        { title: "Panel discussion ", venue: "Kaveri Auditorium", time: "01:00 PM - 03:00 PM" },
        { title: "Deep Sprint Hackathon", venue: "Parthasarathy Auditorium", time: "Sep 01 (11:30 AM - Sep 02 12:30 PM)" },
        { title: "Product showcase", venue: "Centre of Excellences", time: "From 11:00 AM onwards" },
      ],
      },
    {
      date: "September 2, 2026",
      day: "Day 2",
      theme: "Building Deep ‑ Tech Solutions",
      events: [
        { title: "Keynote Session 2 ", venue: "Kaveri Auditorium", time: "09:00 AM - 10:00 AM" },
        { title: "Deep Sprint Hackathon (Round 2)", venue: "Parthasarathy Auditorium", time: "10:30 AM" },
        { title: "Deep Sprint Hackathon (Round 3)", venue: "Parthasarathy Auditorium", time: "12:30 PM" },
        { title: "Validictory", venue: "Parthasarathy Auditorium", time: "01:30 PM - 02:30 PM" },
      ],
      },
    {
      date: "September 3, 2026",
      day: "Day 3",
      theme: "Innovation & Investment Summit",
      events: [
        { title: "Product show case", venue: "Centre of Excellences", time: "09:00 AM - 03:00 PM" },
        { title: "Demo Day", venue: "Bonfiglioli Conf hall", time: "10:00 AM - 03:00 PM" },
        { title: "DPIT- Mentor Connect", venue: "Parthasarathy Auditorium", time: "10:00 AM - 01:00 PM" },
        { title: "Innovest Validictory & CITIL Innovation Grant", venue: "Parthasarathy Auditorium", time: "02:00 PM - 02:30 PM" },
      ],
      note: "From Ideas to Products. From Startups to Opportunities.",
    },
  ];

  const handleKnowMore = (day: string) => {
    if (day === "Day 2") {
      navigate("/innovesthack");
    } else if (day === "Day 1" || day === "Day 3") {
      setSelectedDay(day);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay("");
  };

  return (
    <section id="schedule" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Event Schedule
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three days packed with inspiring sessions, networking opportunities,
            and innovation showcases
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {days.map((day, dayIndex) => {
            // Sort events chronologically by start time
            const sortedEvents = [...day.events].sort(
              (a, b) => getTimeValue(a.time) - getTimeValue(b.time)
            );

            return (
              <div
                key={dayIndex}
                id={`day${dayIndex + 1}`}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
                  <h3 className="text-2xl font-bold mb-2">{day.day}</h3>
                  <p className="text-blue-100 mb-1">{day.date}</p>
                  <p className="text-orange-300 font-medium">{day.theme}</p>
                  <button
                    onClick={() => handleKnowMore(day.day)}
                    className={`absolute top-12 right-4 px-6 py-4 rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm ${
                      day.day === "Day 2"
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {day.day === "Day 2" ? "Know More" : "Register"}
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {sortedEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="border-l-4 border-yellow-400 pl-4 hover:bg-gray-50 transition-colors duration-300 p-2 rounded-r-lg transform hover:translate-x-2"
                    >
                      {/* 1. STARTING TIME ONLY */}
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Clock size={14} className="text-blue-600 mr-2" />
                        {getDisplayTime(event.time)}
                      </div>

                      {/* 2. Title */}
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h4>

                      {/* 3. Venue */}
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-2" />
                        {event.venue}
                      </div>
                    </div>
                  ))}
                  {day.note && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-200">
                      <span className="font-semibold">
                        {day.day === "Day 2" ? "Prizes & Tracks:" : "Details:"}
                      </span>{" "}
                      {day.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal isOpen={modalOpen} onClose={closeModal} day={selectedDay} />
    </section>
  );
};

export default Events;
