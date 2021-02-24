import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import {
  Container, Card, CardTitle, Nav, NavItem, NavLink,
  Table, TabContent, TabPane, Row, Col, Button, Badge
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { selectors as ChatSelectors } from '../store/slices/chat'
import { ActivityButton } from '../components/common/ActivityButton';
import { RefreshButton } from '../components/common/RefreshButton'
import { selectors as UISelectors } from '../store/slices/ui'

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function TableData({ tabId, data }: any) {

  const dispatch = useDispatch();
  let history = useHistory();
  const users = useSelector(ProfileSelectors.getUsers)
  const { t, i18n } = useTranslation();

  return (
    <Row>
      <Col sm="12">
        <Table striped borderless responsive>
          <thead>
            <tr>
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
                  <td>
                    <Row className="d-flex" tag={Link} onClick={() => dispatch(SowActions.willSelectSow({ sow: element, history: history }))}>
                      <Col className="col-1">
                        {tabId == 1 && <Badge data-cy='unreadMessagesSowSeller' pill color={element.messagesToReadSeller == 0 ? "secondary" : "primary"}>{element.messagesToReadSeller}</Badge>}
                        {tabId == 2 && <Badge data-cy='unreadMessagesSowBuyer' pill color={element.messagesToReadBuyer == 0 ? "secondary" : "primary"}>{element.messagesToReadBuyer}</Badge>}
                        {tabId == 3 && <Badge data-cy='unreadMessagesSowArbitrator' pill color={element.messagesToReadArbitrator == 0 ? "secondary" : "primary"}>{element.messagesToReadArbitrator}</Badge>}
                      </Col>
                      <Col className="col-10">
                        {element.title}
                      </Col>
                    </Row>
                  </td>
                  {tabId != 1 && <td>{
                    validateEmail(element.seller) ?
                      element.seller
                      :
                      users[element.seller].given_name + ' ' + users[element.seller].family_name
                  }</td>}
                  {tabId != 2 && <td>{element.buyer ?
                    element.buyer == 'not_set' ?
                      '-'
                      :
                      validateEmail(element.buyer) ?
                        element.buyer
                        :
                        users[element.buyer].given_name + ' ' + users[element.buyer].family_name
                    : '-'
                  }</td>}
                  <td>{element.deadline ? new Date(element.deadline).toLocaleDateString() : '-'}</td>
                  <td>{element.price ? element.price + ' ' + element.currency : '-'}</td>
                  <td>{element.createdAt ? new Date(element.createdAt).toLocaleString() : '-'}</td>
                  <td data-cy='submittedSowStatus'>{element.status}</td>
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
  const isLoading = useSelector(UISelectors.isLoading)
  let history = useHistory();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('1');
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const sowsAsSeller = useSelector(SowSelectors.getListSowsSeller)
  const sowsAsBuyer = useSelector(SowSelectors.getListSowsBuyer)
  const sowsAsArbitrator = useSelector(SowSelectors.getListSowsArbitrator)
  const unreadMessages = useSelector(ChatSelectors.getUnreadMessages)

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  React.useEffect(() => {
    dispatch(SowActions.willConfirmArbitrators({ arbitrators: [], toggle: () => { } }))
    dispatch(SowActions.willGetSowsList())
  }, []);

  return (
    <>
      {!isLoading &&
        <Container>
          <Card className="mt-3 mt-lg-5 rounded" outline color="primary">
            <Row>
              <Col>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      active={activeTab === '1'}
                      onClick={() => { toggle('1'); }}
                    >
                      <Row className="mx-0">
                        <Col className="px-1">
                          Freelance
                        </Col>
                        <Col className="p-0">
                          {unreadMessages.asSeller != 0 &&
                            <Badge data-cy='unreadMessagesSeller' pill color={unreadMessages.asSeller == 0 ? "secondary" : "primary"}>{unreadMessages.asSeller}</Badge>
                          }
                        </Col>
                      </Row>
                    </NavLink>
                  </NavItem>
                  {sowsAsBuyer.length > 0 &&
                    <NavItem>
                      <NavLink
                        data-cy='customerTab'
                        active={activeTab === '2'}
                        onClick={() => { toggle('2'); }}
                      >
                        <Row className="mx-0">
                          <Col className="px-1">
                            Customer
                        </Col>
                          <Col className="p-0">
                            {unreadMessages.asBuyer != 0 &&
                              <Badge data-cy='unreadMessagesBuyer' pill color={unreadMessages.asBuyer == 0 ? "secondary" : "primary"}>{unreadMessages.asBuyer}</Badge>
                            }
                          </Col>
                        </Row>
                      </NavLink>
                    </NavItem>
                  }
                  {sowsAsArbitrator.length > 0 &&
                    <NavItem>
                      <NavLink
                        active={activeTab === '3'}
                        onClick={() => { toggle('3'); }}
                      >
                        <Row className="mx-0">
                          <Col className="px-1">
                            Arbitrator
                        </Col>
                          <Col className="p-0">
                            {unreadMessages.asBuyer != 0 &&
                              <Badge data-cy='unreadMessagesBuyer' pill color={unreadMessages.asBuyer == 0 ? "secondary" : "primary"}>{unreadMessages.asBuyer}</Badge>
                            }
                          </Col>
                        </Row>
                      </NavLink>
                    </NavItem>
                  }
                </Nav>
              </Col>
              <Col className="d-flex justify-content-end">
                {activeTab == '1' &&
                  <ActivityButton data-cy="createSow" type="submit" name="createSow" color="primary" className="ml-sm-2"
                    onClick={() => dispatch(SowActions.willCreateStatementOfWork({ history: history }))}
                  >{t('sow.newStatementOfWork')}</ActivityButton>
                }
                <RefreshButton data-cy='getSowsList' type="submit" name="getSowsList" color="primary" className="ml-sm-2"
                  onClick={() => {
                    console.log('in refreshSowsList')
                    dispatch(SowActions.willGetSowsList())
                  }}
                />
              </Col>
            </Row>
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
        </Container>
      }
    </>
  )
}