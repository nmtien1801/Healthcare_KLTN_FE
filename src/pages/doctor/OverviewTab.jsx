import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { Card, Button, Table, Row, Col, Image, Badge } from 'react-bootstrap';

const OverviewTab = () => {
  useEffect(() => {
    const revenueChartDom = document.getElementById('revenue-chart');
    if (revenueChartDom) {
      const revenueChart = echarts.init(revenueChartDom);
      revenueChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          axisTick: { alignWithLabel: true }
        },
        yAxis: { type: 'value' },
        series: [{
          name: 'Doanh thu',
          type: 'bar',
          barWidth: '60%',
          data: [5.2, 8.9, 7.0, 9.3, 12.5, 4.8, 2.1].map(v => v * 1000000),
          itemStyle: { color: '#3b82f6' }
        }]
      });
      window.addEventListener('resize', () => revenueChart.resize());
    }

    const healthChartDom = document.getElementById('health-chart');
    if (healthChartDom) {
      const healthChart = echarts.init(healthChartDom);
      healthChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Huyết áp', 'Nhịp tim', 'Đường huyết'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['19/06', '20/06', '21/06', '22/06', '23/06']
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'Huyết áp',
            type: 'line',
            data: [120, 132, 125, 128, 135],
            itemStyle: { color: '#ef4444' }
          },
          {
            name: 'Nhịp tim',
            type: 'line',
            data: [82, 85, 80, 78, 88],
            itemStyle: { color: '#8b5cf6' }
          },
          {
            name: 'Đường huyết',
            type: 'line',
            data: [5.8, 6.2, 5.9, 6.0, 6.5],
            itemStyle: { color: '#10b981' }
          }
        ]
      });
      window.addEventListener('resize', () => healthChart.resize());
    }

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tổng quan</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <i className="fas fa-user-plus text-primary fs-5"></i>
              </div>
              <div>
                <div className="text-muted small">Bệnh nhân mới</div>
                <div className="fs-4 fw-semibold">12</div>
                <div className="text-success small">+15% so với tuần trước</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                <i className="fas fa-calendar-check text-warning fs-5"></i>
              </div>
              <div>
                <div className="text-muted small">Cuộc hẹn hôm nay</div>
                <div className="fs-4 fw-semibold">8</div>
                <div className="text-success small">2 cuộc hẹn sắp tới</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                <i className="fas fa-money-bill-wave text-success fs-5"></i>
              </div>
              <div>
                <div className="text-muted small">Doanh thu tháng</div>
                <div className="fs-4 fw-semibold">48.500.000 đ</div>
                <div className="text-success small">+8% so với tháng trước</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Doanh thu theo ngày */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Doanh thu theo ngày</h5>
            <div>
              <Button size="sm" variant="outline-primary" className="me-2">Tuần này</Button>
              <Button size="sm" variant="outline-secondary" className="me-2">Tháng này</Button>
              <Button size="sm" variant="outline-secondary">Năm nay</Button>
            </div>
          </div>
          <div id="revenue-chart" style={{ height: '300px' }}></div>
        </Card.Body>
      </Card>

      {/* Bệnh nhân cần chú ý */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Bệnh nhân cần chú ý</h5>
            <Button variant="link" className="p-0">Xem tất cả</Button>
          </div>
          <div className="table-responsive">
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Chỉ số</th>
                  <th>Cảnh báo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image roundedCircle width={40} height={40} src="https://readdy.ai/api/search-image?query=elderly%20asian%20man..." alt="Bệnh nhân" />
                      <div className="ms-3">
                        <div>Trần Văn Bình</div>
                        <div className="text-muted small">68 tuổi</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>Huyết áp: <span className="text-danger fw-bold">160/95</span></div>
                    <div>Nhịp tim: 92 bpm</div>
                  </td>
                  <td>
                    <Badge bg="danger" pill>Huyết áp cao</Badge>
                  </td>
                  <td>
                    <Button variant="link" className="text-primary me-2 p-0">
                      <i className="fas fa-phone-alt"></i>
                    </Button>
                    <Button variant="link" className="text-primary p-0">
                      <i className="fas fa-comment-medical"></i>
                    </Button>
                  </td>
                </tr>
                {/* Thêm các bệnh nhân khác nếu cần */}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OverviewTab;
