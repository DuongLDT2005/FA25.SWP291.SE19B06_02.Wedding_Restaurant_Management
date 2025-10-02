import React from "react";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function CapacityRange({ halls }) {
    if (!halls || halls.length === 0) {
        return <p>Chưa có thông tin sức chứa</p>;
    }

    const minCapacity = Math.min(...halls.map(h => h.capacity));
    const maxCapacity = Math.max(...halls.map(h => h.capacity));

    return (
        <span className="d-inline-flex align-items-center">
            <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "#993344" }} className="me-1" />
            {minCapacity} - {maxCapacity} khách
        </span>
    );
}