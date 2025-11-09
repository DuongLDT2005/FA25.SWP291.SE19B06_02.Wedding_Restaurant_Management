import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchWards } from "../../redux/slices/wardSlice"
import { MapPin } from "lucide-react"
import { Container, Row, Col, Card, Spinner } from "react-bootstrap"

const GRADIENTS = [
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-sky-500",
    "from-emerald-500 to-lime-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-600",
    "from-teal-500 to-cyan-500",
    "from-fuchsia-500 to-pink-600",
    "from-green-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
    "from-red-400 to-pink-400",
]

export default function WardCards() {
    const dispatch = useDispatch();
    const { list, status, error } = useSelector((state) => state.wards || []);

    useEffect(() => {
        if (status === "idle") dispatch(fetchWards())
    }, [status, dispatch])

    const handleClick = (slug) => {
        window.location.href = `/restaurants?location=${slug}`
    }

    if (status === "loading") {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
            </div>
        )
    }

    if (status === "failed") {
        return (
            <div className="text-center text-danger py-5">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <section className="py-5">
            <Container>
                <div className="d-flex align-items-center gap-2 mb-4">
                    <MapPin size={24} className="text-danger" />
                    <h2 className="fw-bold text-danger mb-0">Tìm kiếm theo địa điểm</h2>
                </div>

                <Row className="g-4">
                    {list && list.map((ward) => {
                        const color = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
                        return (
                            <Col key={ward.slug} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    onClick={() => handleClick(ward.slug)}
                                    className="border-0 text-white text-center rounded-4 overflow-hidden shadow hover-shadow-lg transition"
                                    style={{ cursor: "pointer" }}
                                >
                                    <div
                                        className={`bg-gradient-to-r ${color} h-48 d-flex flex-column justify-content-center align-items-center transition-transform duration-300 hover:scale-105`}
                                    >
                                        <h5 className="fw-bold mb-1">{ward.name}</h5>
                                        <p className="mb-0 small">{ward.count} nhà hàng</p>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </section>
    )
}