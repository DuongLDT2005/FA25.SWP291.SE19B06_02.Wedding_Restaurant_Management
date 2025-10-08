import React from "react";
import { Heart, Building, Cake } from "lucide-react";

const eventTypeIcons = {
    1: <Heart size={24} color="#e83e8c" />,      // Tiệc cưới
    2: <Building size={24} color="#0d6efd" />,   // Hội nghị
    3: <Cake size={24} color="#ffc107" />,       // Sinh nhật
};

const eventTypeNames = {
    1: "Tiệc cưới",
    2: "Hội nghị",
    3: "Sinh nhật",
};

const EventTypeList = ({ restaurant }) => {
    return (
        <div className="mb-5">
            <h4 className="section-title mb-3" style={{ color: "#993344" }}>Loại sự kiện</h4>
            <div className="d-flex flex-wrap gap-3">
                {Object.entries(eventTypeNames).map(([id, name]) => {
                    return (
                        <div
                            key={id}
                            className="card shadow-sm p-3 flex-fill"
                            style={{
                                minWidth: "200px",
                                borderRadius: "12px",
                                transition: "transform 0.2s",
                                border: "none"
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div>{eventTypeIcons[id]}</div>
                                <div>
                                    <h6 className="fw-bold mb-1">{name}</h6>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventTypeList;