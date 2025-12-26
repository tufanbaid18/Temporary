import { useEffect, useMemo, useState } from "react";
import { usePrograms } from "../../hooks/programs/usePrograms";
import "./GatcProgram.css";
import { useNavigate } from "react-router";


export default function Program() {
    const { data: programs = [], isLoading } = usePrograms();
    const nav = useNavigate();
    const [activeEvent, setActiveEvent] = useState(null);
    const [activeDate, setActiveDate] = useState(null);
    const [fadeKey, setFadeKey] = useState(0);

    /* ================= EVENTS ================= */
    const events = useMemo(() => {
        return [...new Set(programs.map(p => p.event_name))];
    }, [programs]);

    /* ================= SET DEFAULT EVENT ================= */
    useEffect(() => {
        if (events.length && !activeEvent) {
            setActiveEvent(events[0]);
        }
    }, [events, activeEvent]);

    /* ================= DATES ================= */
    const dates = useMemo(() => {
        if (!activeEvent) return [];
        return [...new Set(
            programs
                .filter(p => p.event_name === activeEvent)
                .map(p => p.date)
        )].sort();
    }, [programs, activeEvent]);

    /* ================= SET DEFAULT DATE ================= */
    useEffect(() => {
        if (dates.length && !activeDate) {
            setActiveDate(dates[0]);
        }
    }, [dates, activeDate]);

    /* ================= FILTER PROGRAMS ================= */
    const filteredPrograms = useMemo(() => {
        return programs.filter(
            p => p.event_name === activeEvent && p.date === activeDate
        );
    }, [programs, activeEvent, activeDate]);

    /* ================= VENUES ================= */
    const venues = [...new Set(filteredPrograms.map(p => p.venue))];

    if (isLoading) {
        return <div className="text-center py-5">Loading program...</div>;
    }

    return (
        <section className="program-section">
            <div className="container">

                {/* ================= EVENT TABS ================= */}
                <div className="year-tabs">
                    {events.map(event => (
                        <button
                            key={event}
                            className={activeEvent === event ? "active" : ""}
                            onClick={() => {
                                setActiveEvent(event);
                                setActiveDate(null);
                                setFadeKey(prev => prev + 1);
                            }}
                        >
                            {event}
                        </button>
                    ))}
                </div>

                {/* ================= DATE TABS ================= */}
                {activeEvent && (
                    <div className="date-tabs">
                        {dates.map(date => (
                            <button
                                key={date}
                                className={activeDate === date ? "active" : ""}
                                onClick={() => {
                                    setActiveDate(date);
                                    setFadeKey(prev => prev + 1);
                                }}
                            >
                                {new Date(date).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short",
                                })}
                            </button>
                        ))}
                    </div>
                )}

                {/* ================= PROGRAM LIST ================= */}
                <div key={fadeKey}>
                    {venues.map(venue => (
                        <div key={venue} className="venue-section-block">
                            <h3 className="venue-title">Venue: {venue}</h3>

                            <div className="row g-4">
                                {filteredPrograms
                                    .filter(p => p.venue === venue)
                                    .map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="col-12 col-md-6 col-lg-4 fade-item"
                                            style={{ animationDelay: `${i * 0.08}s` }}
                                        >
                                            <div className="program-card modern">

                                                {/* TIME */}
                                                <div className="program-time-pill">
                                                    {p.start_time} – {p.end_time}
                                                </div>

                                                {/* CONTENT */}
                                                <h4 className="program-title">{p.topic}</h4>

                                                {/* SPEAKER */}

                                                <div
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => nav(`/speakers/${p.speaker}`)}
                                                >
                                                    <div className="program-speaker-row">
                                                        <img
                                                            src={p.speaker_image || "/avatar.png"}
                                                            alt={p.speaker_name}
                                                            className="speaker-avatar"
                                                        />

                                                        <div>
                                                            <div className="speaker-name">{p.speaker_name}</div>
                                                            <div className="speaker-role">Speaker</div>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* FOOTER */}
                                                <div className="program-footer">
                                                    <span className="venue-badge">{p.venue}</span>
                                                    <span className="program-date">
                                                        {new Date(p.date).toLocaleDateString()}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                    ))}
                            </div>
                        </div>
                    ))}

                    {!filteredPrograms.length && (
                        <div className="text-center py-4 text-muted">
                            No programs available yet.
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
