// File: RestaurantsPage.jsx
import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge, Form, InputGroup } from 'react-bootstrap';
import AppLayout from "../../../layouts/PartnerLayout";
import { useNavigate } from "react-router-dom";


export const initialRestaurants = [
  {
    id: 1,
    name: "The Rose Hall",
    address: {
      number: "123",
      street: "Nguyễn Văn Linh",
      ward: "Hải Châu",
      fullAddress: "123 Nguyễn Văn Linh, Hải Châu"
    },
    contactEmail: "restaurant@gmail.com",
    contactPhone: "0236453789",
    description: "Nằm tại trung tâm thành phố, nhà hàng tiệc cưới của chúng tôi là điểm đến lý tưởng cho những bữa tiệc cưới sang trọng và ấm cúng. Với không gian rộng rãi, hệ thống sảnh tiệc hiện đại có sức chứa từ 200 đến 1000 khách, nhà hàng mang đến trải nghiệm trọn vẹn từ khâu trang trí, thực đơn đến phong cách phục vụ chuyên nghiệp. Thực đơn đa dạng, kết hợp tinh tế giữa ẩm thực Á – Âu, được chế biến bởi đội ngũ đầu bếp giàu kinh nghiệm. Cùng với đó là hệ thống âm thanh, ánh sáng cao cấp và dịch vụ tổ chức trọn gói giúp cặp đôi dễ dàng hiện thực hóa đám cưới trong mơ.",
    status: "active",
    hallCount: 5,
    bookingCount: 45,
    thumbnailURL: "http://thietkehaidang.com//source/image/biet%20thu%203%20tang/anh%20lam%20-%20quat%20lam/z2358526452206_4b68e507c0c7580aaab7d10718c11b6d.jpg",
    imageURLs: [
      "https://diamondplace.vn/wp-content/uploads/2022/07/LONG1702-min.jpg",
      "https://huongpho.com.vn/wp-content/uploads/2018/03/RUBY.jpg",
      "https://admin.theadora.vn/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4MCwicHVyIjoiYmxvYl9pZCJ9fQ==--c1e648b98ef923e4de6bae39066c810e461f2d46/the-adora-dynasty%20(2).jpg"
    ],
    eventTypes: [
      { eventTypeID: 1, name: "Tiệc cưới", status: 1 },
      { eventTypeID: 2, name: "Sinh nhật", status: 1 },
      { eventTypeID: 3, name: "Hội nghị", status: 1 }
    ]
  },
  {
    id: 2,
    name: "Golden Lotus",
    address: {
      number: "456",
      street: "Nguyễn Tất Thành",
      ward: "Thanh Khê",
      fullAddress: "456 Nguyễn Tất Thành, Thanh Khê"
    },
    contactEmail: "restaurant@gmail.com",
    contactPhone: "0236453789",
    description: "Nằm tại trung tâm thành phố, nhà hàng tiệc cưới của chúng tôi là điểm đến lý tưởng cho những bữa tiệc cưới sang trọng và ấm cúng. Với không gian rộng rãi, hệ thống sảnh tiệc hiện đại có sức chứa từ 200 đến 1000 khách, nhà hàng mang đến trải nghiệm trọn vẹn từ khâu trang trí, thực đơn đến phong cách phục vụ chuyên nghiệp. Thực đơn đa dạng, kết hợp tinh tế giữa ẩm thực Á – Âu, được chế biến bởi đội ngũ đầu bếp giàu kinh nghiệm. Cùng với đó là hệ thống âm thanh, ánh sáng cao cấp và dịch vụ tổ chức trọn gói giúp cặp đôi dễ dàng hiện thực hóa đám cưới trong mơ.",
    status: "active",
    hallCount: 3,
    bookingCount: 38,
    thumbnailURL: "https://thechateau.com.vn/wp-content/uploads/2018/04/the-chateau2.jpg",
    imageURLs: [
      "https://diamondplace.vn/wp-content/uploads/2022/07/LONG1702-min.jpg",
      "https://huongpho.com.vn/wp-content/uploads/2018/03/RUBY.jpg",
      "https://admin.theadora.vn/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4MCwicHVyIjoiYmxvYl9pZCJ9fQ==--c1e648b98ef923e4de6bae39066c810e461f2d46/the-adora-dynasty%20(2).jpg"
    ],
    eventTypes: [
      { eventTypeID: 1, name: "Tiệc cưới", status: 1 },
      { eventTypeID: 2, name: "Sinh nhật", status: 1 },
      { eventTypeID: 3, name: "Hội nghị", status: 1 }
    ]
  },
  {
    id: 3,
    name: "Trung tâm Hội nghị & Tiệc cưới Minh Châu Việt",
    address: {
      number: "456",
      street: "Nguyễn Tri Phương",
      ward: "Hòa Cường",
      fullAddress: "456 Nguyễn Tri Phương, Hòa Cường"
    },
    contactEmail: "restaurant@gmail.com",
    contactPhone: "0236453789",
    description: "Nằm tại trung tâm thành phố, nhà hàng tiệc cưới của chúng tôi là điểm đến lý tưởng cho những bữa tiệc cưới sang trọng và ấm cúng. Với không gian rộng rãi, hệ thống sảnh tiệc hiện đại có sức chứa từ 200 đến 1000 khách, nhà hàng mang đến trải nghiệm trọn vẹn từ khâu trang trí, thực đơn đến phong cách phục vụ chuyên nghiệp. Thực đơn đa dạng, kết hợp tinh tế giữa ẩm thực Á – Âu, được chế biến bởi đội ngũ đầu bếp giàu kinh nghiệm. Cùng với đó là hệ thống âm thanh, ánh sáng cao cấp và dịch vụ tổ chức trọn gói giúp cặp đôi dễ dàng hiện thực hóa đám cưới trong mơ.",
    status: "active",
    hallCount: 3,
    bookingCount: 32,
    thumbnailURL: "https://scontent.fdad1-1.fna.fbcdn.net/v/t39.30808-6/301370490_452772673537526_29694057312895922_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGvHSVVi9kp2lTdGYIlC-Sry4I89XqlfeLLgjz1eqV94vEVN9o617K46PwbyqADNe_bKWSqvgX4mdSKSHRBTxWz&_nc_ohc=kO9MqHjkJnUQ7kNvwGqAzZG&_nc_oc=AdnrP8lxZSTpLg0-Macpfje-OxLAj1gJgR8qQ0tqFwNI1eK3we9lqpVRzb2_GugGRehhkapRZfPj1XrKqKE_5qme&_nc_zt=23&_nc_ht=scontent.fdad1-1.fna&_nc_gid=YJ5Ltp0wRV6c6K89l0LmbQ&oh=00_Afceqs0u_TnNoAIzV42dQgyfrEvt5eqekNTn4vXtWYJ2Gg&oe=68E95FD8",
    imageURLs: [
      "https://diamondplace.vn/wp-content/uploads/2022/07/LONG1702-min.jpg",
      "https://huongpho.com.vn/wp-content/uploads/2018/03/RUBY.jpg",
      "https://admin.theadora.vn/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4MCwicHVyIjoiYmxvYl9pZCJ9fQ==--c1e648b98ef923e4de6bae39066c810e461f2d46/the-adora-dynasty%20(2).jpg"
    ],
    eventTypes: [
      { eventTypeID: 1, name: "Tiệc cưới", status: 1 },
      { eventTypeID: 2, name: "Sinh nhật", status: 1 },
      { eventTypeID: 3, name: "Hội nghị", status: 1 }
    ]
  },
  {
    id: 4,
    name: "White Swan Wedding & Event",
    address: {
      number: "37",
      street: "Phạm Văn Đồng",
      ward: "An Hải",
      fullAddress: "37 Phạm Văn Đồng, An Hải"
    },
    contactEmail: "restaurant@gmail.com",
    contactPhone: "0236453789",
    description: "Nằm tại trung tâm thành phố, nhà hàng tiệc cưới của chúng tôi là điểm đến lý tưởng cho những bữa tiệc cưới sang trọng và ấm cúng. Với không gian rộng rãi, hệ thống sảnh tiệc hiện đại có sức chứa từ 200 đến 1000 khách, nhà hàng mang đến trải nghiệm trọn vẹn từ khâu trang trí, thực đơn đến phong cách phục vụ chuyên nghiệp. Thực đơn đa dạng, kết hợp tinh tế giữa ẩm thực Á – Âu, được chế biến bởi đội ngũ đầu bếp giàu kinh nghiệm. Cùng với đó là hệ thống âm thanh, ánh sáng cao cấp và dịch vụ tổ chức trọn gói giúp cặp đôi dễ dàng hiện thực hóa đám cưới trong mơ.",
    status: "active",
    hallCount: 3,
    bookingCount: 27,
    thumbnailURL: "https://static.ecosite.vn/9306/picture/2018/10/10/anh-2-1539145184.jpg",
    imageURLs: [
      "https://diamondplace.vn/wp-content/uploads/2022/07/LONG1702-min.jpg",
      "https://huongpho.com.vn/wp-content/uploads/2018/03/RUBY.jpg",
      "https://admin.theadora.vn/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4MCwicHVyIjoiYmxvYl9pZCJ9fQ==--c1e648b98ef923e4de6bae39066c810e461f2d46/the-adora-dynasty%20(2).jpg"
    ],
    eventTypes: [
      { eventTypeID: 1, name: "Tiệc cưới", status: 1 },
      { eventTypeID: 2, name: "Sinh nhật", status: 1 },
      { eventTypeID: 3, name: "Hội nghị", status: 1 }
    ]
  }
];
const RestaurantCard = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const confirmChange = window.confirm(
      `Bạn có chắc muốn ${props.r.status === "active" ? "ngừng hoạt động" : "kích hoạt lại"} nhà hàng "${props.r.name}" không?`
    );
    if (confirmChange) {
      props.onToggleStatus(props.r.id);
    }
  };
  return (
    <Card style={{ height: '100%' }}>
      <Card.Body>
        <Card.Title
          style={{ cursor: "pointer", color: "#0d6efd" }}
          onClick={() => navigate(`/partner/restaurants/detail/${props.r.id}`)}
        >{props.r.name}
        </Card.Title>
        <Card.Text>{props.r.address.fullAddress}</Card.Text>
        <div className="d-flex justify-content-between mb-3">
          <div>Số sảnh: <strong>{props.r.hallCount}</strong></div>
          <div>Lượt đặt: <strong>{props.r.bookingCount}</strong></div>
        </div>
        <Button
          variant={props.r.status === 'active' ? 'success' : 'danger'}
          className="text-white mb-3"
          onClick={handleClick}
        >
          {props.r.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Button>
      </Card.Body>
    </Card>
  );
}
const RestaurantsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const navigate = useNavigate();

  const handleAddRestaurant = () => {
    navigate("/partner/restaurants/new");
  };
  const handleToggleStatus = (id) => {
    setRestaurants(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      )
    );
  };
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="mb-4">
        <Row className="g-2 align-items-center">
          {/* Ô tìm kiếm */}
          <Col xs={12} md={4}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Tìm nhà hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Bộ lọc */}
          <Col xs={12} md={3}>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </Form.Select>
          </Col>

          {/* Nút thêm mới */}
          <Col xs={12} md="auto">
            <Button variant="primary" className="w-100 w-md-auto" onClick={handleAddRestaurant}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: "500",
                padding: "8px 16px",
              }}>
              <i className="fa fa-plus"></i>Thêm nhà hàng mới
            </Button>
          </Col>
        </Row>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredRestaurants.map(r => (
          <Col key={r.id}>
            <RestaurantCard r={r} onToggleStatus={handleToggleStatus} />
          </Col>
        ))}
      </Row>
    </AppLayout>
  );
};

export default RestaurantsPage;
