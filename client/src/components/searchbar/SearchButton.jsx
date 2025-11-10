import React from "react";
import { Button } from "react-bootstrap";
import { Search } from "lucide-react";

export default function SearchButton() {
  return (
    <div className="text-center">
      <Button
        type="submit"
        variant="danger"
        className="px-4 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
        style={{ backgroundColor: "#E11D48" }}
      >
        <Search size={18} color="white" />
      </Button>
    </div>
  );
}