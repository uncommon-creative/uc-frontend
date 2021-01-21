import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { Container, Card, CardTitle, Nav, NavItem, NavLink, Table, TabContent, TabPane, Row, Col, Button } from 'reactstrap';

import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { ActivityButton } from '../components/ActivityButton';

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function TableData({ tabId, data }: any) {

  const dispatch = useDispatch();
  let history = useHistory();

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
              <th>Created at</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((element: any) => {
              return (
                <tr key={element.sow}>
                  <th scope="row">
                    {/* <Link to="/users" onClick={() => dispatch(SowActions.willSelectSow({ sow: element, history: history }))}>{element.sow.substring(0, 5).toUpperCase()}</Link> */}
                    <Button color="link" onClick={() => dispatch(SowActions.willSelectSow({ sow: element, history: history }))}>{element.sow.substring(0, 5).toUpperCase()}</Button>
                  </th>
                  <td>{element.title ? element.title : '-'}</td>
                  {tabId != 1 && <td>{
                    validateEmail(element.seller) ?
                      element.seller
                      :
                      element.seller.substring(0, 5).toUpperCase()
                  }</td>}
                  {tabId != 2 && <td>{element.buyer ?
                    element.buyer == 'not_set' ?
                      '-'
                      :
                      validateEmail(element.buyer) ?
                        element.buyer
                        :
                        element.buyer.substring(0, 5).toUpperCase()
                    : '-'
                  }</td>}
                  <td>{element.deadline ? new Date(element.deadline).toLocaleDateString() : '-'}</td>
                  <td>{element.price ? element.price + ' ' + element.currency : '-'}</td>
                  <td>{element.createdAt ? new Date(element.createdAt).toLocaleString() : '-'}</td>
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
  let history = useHistory();
  const [activeTab, setActiveTab] = useState('1');
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const sowsAsSeller = useSelector(SowSelectors.getListSowsSeller)
  const sowsAsBuyer = useSelector(SowSelectors.getListSowsBuyer)
  const sowsAsArbitrator = useSelector(SowSelectors.getListSowsArbitrator)

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  React.useEffect(() => {
    dispatch(SowActions.willGetSowsListSeller())
    dispatch(SowActions.willGetSowsListBuyer())
    dispatch(SowActions.willGetSowsListArbitrator())
  }, []);

  return (
    <Container>
      <Card className="mt-3 mt-lg-5 rounded" outline color="primary">
        <div className="row">
          <div className="col-12 col-sm-8">
            <CardTitle tag="h2">Welcome {userAttributes.given_name}</CardTitle>
          </div>
          <div className="col-12 col-sm-4">
            {activeTab == '1' &&
              // <Button color="primary" className=" mt-sm-2 mx-auto" to="/create-statement-of-work" tag={Link}>new Statement Of Work</Button>
              <ActivityButton className="mt-sm-2 mx-auto" type="submit" name="createSow" color="primary"
                onClick={() => dispatch(SowActions.willCreateStatementOfWork({ history: history }))}
              >new Statement Of Work</ActivityButton>
            }
          </div>
        </div>
        <Nav tabs>
          <NavItem >
            <NavLink
              active={activeTab === '1'}
              onClick={() => { toggle('1'); }}
            >
              Freelance
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === '2'}
              onClick={() => { toggle('2'); }}
            >
              Customer
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === '3'}
              onClick={() => { toggle('3'); }}
            >
              Arbitrator
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <TableData tabId="1" data={sowsAsSeller} />
          </TabPane>
          <TabPane tabId="2">
            <TableData tabId="2" data={sowsAsBuyer} />
          </TabPane>
          <TabPane tabId="3">
            <TableData tabId="3" data={sowsAsArbitrator} />
          </TabPane>
        </TabContent>

      </Card>
    </Container >

  )
}