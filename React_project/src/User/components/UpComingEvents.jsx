import React, { useEffect, useState, useCallback, useRef } from "react";
import EventCard from "./EventCard";
import { DateTime } from "./dateFormatter.js";

const getBaseApiUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const API_BASE = getBaseApiUrl();
const SERVER_ROOT = getServerRootUrl();

function UpComingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const fetchUpcomingEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/events/upcoming`, {
                headers: { "Accept": "application/json" }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("イベント取得エラー:", error);
            setError("イベントを取得できませんでした。");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUpcomingEvents();
    }, [fetchUpcomingEvents]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || events.length === 0 || isHovered) return;

        const autoScroll = setInterval(() => {
            if (scrollContainer) {
                const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                if (scrollContainer.scrollLeft >= maxScrollLeft - 1) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 1; 
                }
            }
        }, 30);

        return () => clearInterval(autoScroll);
    }, [events, isHovered]);

    return (
        <section 
            style={{ 
                margin: "0",              
                padding: "40px 0",   
                textAlign: "center", 
                backgroundImage: `url("/images/siroback.png")`, 
                backgroundSize: "auto",      
                backgroundRepeat: "repeat",  
                backgroundPosition: "center",
                color: "#555",
                fontFamily: '"Zen Maru Gothic", sans-serif'
            }}
        >
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                marginBottom: "30px",
                paddingBottom: "10px",
                borderBottom: "3px dotted #ccc"
            }}>
                <img 
                    src="/images/aoonitousin.png" 
                    alt="icon-blue" 
                    style={{ width: "60px", height: "auto", transform: "scaleX(-1)" }} 
                />

                <div style={{ textAlign: "left" }}>
                    <h2 style={{ 
                        margin: 0, 
                        fontSize: "2.2rem", 
                        fontWeight: "900",
                        color: "#F93D5D",   
                        letterSpacing: "1px",
                        lineHeight: "1.1",
                        border: "none",      
                        padding: 0
                    }}>
                        UPCOMING EVENTS
                    </h2>
                    <span style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "700", 
                        color: "#555",
                        marginLeft: "2px"
                    }}>
                        直近のイベント
                    </span>
                </div>

                <img 
                    src="/akaonitousin.png" 
                    alt="icon-red" 
                    style={{ width: "60px", height: "auto" }} 
                />
            </div>
            
            {loading ? (
                <div style={{ padding: "40px" }}>
                    <p>読み込み中...</p>
                </div>
            ) : events.length === 0 ? (
                <p style={{ padding: "20px", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "8px", display: "inline-block" }}>
                    現在、予定されているイベントはありません。
                </p>
            ) : (
                <div 
                    className="horizontal-scroll-container"
                    ref={scrollRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ 
                        display: "flex",
                        gap: "35px",
                        padding: "20px 40px 40px",
                        overflowX: "auto",
                        scrollbarWidth: "none"
                    }}
                >
                    {events.map((event) => {
                        const rawPath = event.topimage_path || event.image_path || event.image_url;
                        let fullImageUrl;
                        if (!rawPath) {
                            fullImageUrl = "/images/no-image.png";
                        } else if (rawPath.startsWith('http')) {
                            fullImageUrl = rawPath;
                        } else {
                            const cleanRoot = SERVER_ROOT.endsWith('/') ? SERVER_ROOT.slice(0, -1) : SERVER_ROOT;
                            const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
                            fullImageUrl = `${cleanRoot}${cleanPath}`;
                        }

                        return (
                            <div key={event.id} className="event-card-hover-wrapper">
                                <EventCard
                                    id={event.id}
                                    name={event.name}
                                    catchphrase={event.catchphrase}
                                    image={fullImageUrl}
                                    start_date={DateTime(event.start_date)}
                                    end_date={DateTime(event.end_date)}
                                    location={event.location}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .horizontal-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                
                .event-card-hover-wrapper {
                    flex: 0 0 auto;
                    width: 320px;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .event-card-hover-wrapper:hover {
                    transform: translateY(-12px);
                }
            `}</style>
        </section>
    );
}

export default UpComingEvents;