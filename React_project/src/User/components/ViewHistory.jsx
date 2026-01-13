import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getServerRootUrl = () => {
    const envUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    return envUrl.endsWith("/api") ? envUrl.replace(/\/api$/, "") : envUrl;
};

const SERVER_ROOT = getServerRootUrl();

export default function ViewHistory() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("view_history") || "[]");
        setHistory(data);
    }, []);

    const handleItemClick = (item) => {
        const path = item.type === "restaurant" ? `/restaurants/${item.id}` : `/events/${item.id}`;
        navigate(path);
        window.scrollTo(0, 0);
    };

    const sectionStyle = {
        padding: "50px 0",
        textAlign: "center",
        backgroundImage: `url("/images/akaoni_background.png")`,
        backgroundRepeat: "repeat",
        fontFamily: '"Zen Maru Gothic", sans-serif',
        minHeight: "200px" 
    };

    const renderTitle = () => (
        <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "30px",
            paddingBottom: "10px",
            borderBottom: "3px dotted #f7f0f0ff",
            maxWidth: "95%"
        }}>
            <div style={{ textAlign: "left" }}>
                <h2 style={{ 
                    margin: 0, 
                    fontSize: "1.8rem", 
                    fontWeight: "900", 
                    color: "#f51010ff",   
                    textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 8px #fff"
                }}>
                    RECENTLY VIEWED
                </h2>
                <span style={{ 
                    fontSize: "0.8rem", 
                    fontWeight: "700", 
                    color: "#f7f0f0ff",
                    marginLeft: "15px", 
                    display: "block"
                }}>
                    閲覧履歴
                </span>
            </div>
        </div>
    );

    //履歴がない場合の表示
    if (history.length === 0) {
        return (
            <section style={sectionStyle}>
                {renderTitle()}
                <p style={{ 
                    color: "#f7f0f0ff", 
                    fontSize: "1rem", 
                    marginTop: "20px",
                    fontWeight: "500" 
                }}>
                    現在、閲覧履歴はありません。
                </p>
            </section>
        );
    }

    //履歴がある場合の表示
    return (
        <section style={sectionStyle}>
            {renderTitle()}

            <div style={{ 
                display: "flex", 
                overflowX: "auto", 
                gap: "20px", 
                padding: "10px 20px 20px",
                justifyContent: history.length < 4 ? "center" : "flex-start",
                scrollbarWidth: "none"
            }}>
                {history.map((item) => {
                    const imageUrl = item.image 
                        ? (item.image.startsWith('http') 
                            ? item.image.replace(/^http:\/\/[^/]+/, SERVER_ROOT) 
                            : `${SERVER_ROOT}${item.image.startsWith('/') ? '' : '/'}${item.image}`)
                        : "/images/no-image.png";

                    return (
                        <div 
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleItemClick(item)}
                            style={{ 
                                minWidth: "180px", 
                                cursor: "pointer",
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                padding: "10px",
                                borderRadius: "15px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                transition: "transform 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <img 
                                src={imageUrl} 
                                alt={item.name}
                                style={{ 
                                    width: "100%", 
                                    height: "110px", 
                                    objectFit: "cover", 
                                    borderRadius: "10px" 
                                }}
                                onError={(e) => e.target.src = "/images/no-image.png"}
                            />
                            <p style={{ 
                                marginTop: "10px", 
                                fontSize: "0.85rem", 
                                fontWeight: "bold",
                                color: "#120101ff",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>
                                {item.name}
                            </p>
                            <span style={{ 
                                fontSize: "0.7rem", 
                                display: "inline-block",
                                padding: "2px 10px",
                                borderRadius: "20px",
                                border: `1px solid ${item.type === "restaurant" ? "#f51010" : "#3d94f9"}`,
                                color: item.type === "restaurant" ? "#f51010" : "#3d94f9",
                                backgroundColor: "#fff",
                                marginTop: "5px"
                            }}>
                                {item.type === "restaurant" ? "飲食店" : "イベント"}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: "20px" }}>
                <button 
                    onClick={() => {
                        if(window.confirm("閲覧履歴をすべて削除しますか？")) {
                            localStorage.removeItem("view_history");
                            setHistory([]);
                        }
                    }}
                    style={{
                        backgroundColor: "transparent",
                        color: "#f7f0f0ff",
                        border: "1px solid #f7f0f0ff",
                        borderRadius: "25px",
                        padding: "5px 20px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    履歴を消去する
                </button>
            </div>
        </section>
    );
}