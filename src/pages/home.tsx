import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, CardTitle, Nav, NavItem, NavLink, Table, TabContent, TabPane, Row, Col, Button } from 'reactstrap';

import { actions as NotificationActions } from '../store/slices/notification'

const DATA = [
  {
    id: 123,
    title: "SOW 1",
    customer: "Pippo",
    freelance: "Pluto",
    deadline: "July 12, 2020",
    total: 0.09164,
    status: "PAID"
  },
  {
    id: 456,
    title: "SOW 2",
    customer: "Topolino",
    freelance: "Minnie",
    deadline: "July 19, 2021",
    total: 0.07663,
    status: "PAID"
  },
  {
    id: 789,
    title: "SOW 3",
    customer: "Paperino",
    freelance: "Paperina",
    deadline: "January 27, 2021",
    total: 0.08134,
    status: "SENT"
  },
  {
    id: 987,
    title: "SOW 4",
    customer: "Buzz Lightyear",
    freelance: "Woody",
    deadline: "January 1, 2021",
    total: 0.07421,
    status: "SENT"
  },
  {
    id: 654,
    title: "SOW 5",
    customer: "R2-D2",
    freelance: "C-3PO",
    deadline: "January 6, 2021",
    total: 0.02357,
    status: "PAID"
  },
  {
    id: 321,
    title: "SOW 6",
    customer: "Thanos",
    freelance: "Iron Man",
    deadline: "January 17, 2021",
    total: 0.05432,
    status: "SENT"
  },
]

function TableData({ tabId, data }: any) {
  return (
    <Row>
      <Col sm="12">
        <Table striped borderless responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              {tabId != 2 && <th>Customer</th>}
              {tabId != 1 && <th>Freelance</th>}
              <th>Deadline</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((element: any) => {
              return (
                <tr>
                  <th scope="row">{element.id}</th>
                  <td>{element.title}</td>
                  {tabId != 1 && <td>{element.customer}</td>}
                  {tabId != 2 && <td>{element.freelance}</td>}
                  <td>{element.deadline}</td>
                  <td>{element.total}</td>
                  <td>{element.status}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export const HomePage = () => {

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  return (
    <Container>
      <Card className="mt-3 mt-lg-5 rounded" outline color="primary">
        <div className="row">
          <div className="col-12 col-sm-9">
            <CardTitle tag="h2">Welcome User</CardTitle>
          </div>
          <div className="col-12 col-sm-3">
            {activeTab == '1' &&
              <Button color="primary" className="w-75 mt-sm-2 mx-auto"
                onClick={() => dispatch(NotificationActions.willShowNotification({ message: "Create State Of Work", type: "info" }))}
              >+ new SOW</Button>}
          </div>
        </div>
        <Nav tabs>
          <NavItem >
            <NavLink
              active={activeTab === '1'}
              // className={ activeTab === '1' && "active"}
              onClick={() => { toggle('1'); }}
            >
              Freelance
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === '2'}
              // className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Customer
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === '3'}
              // className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >
              Arbitrator
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <TableData tabId="1" data={DATA} />
          </TabPane>
          <TabPane tabId="2">
            <TableData tabId="2" data={DATA} />
          </TabPane>
          <TabPane tabId="3">
            <TableData tabId="3" data={DATA} />
          </TabPane>
        </TabContent>

      </Card>
    </Container >

  )
}