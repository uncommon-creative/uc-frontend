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
import { selectors as UISelectors } from '../store/slices/ui'
import { TableSows } from '../components/TableSows';
import { ActivityButton } from '../components/common/ActivityButton';
import { RefreshButton } from '../components/common/RefreshButton'
import { SaveMnemonicModal } from '../components/profile/SaveMnemonic'

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
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
                <RefreshButton data-cy='willGetSowsList' type="submit" name="willGetSowsList" color="primary" className="ml-sm-2"
                  onClick={() => {
                    console.log('in refreshSowsList')
                    dispatch(SowActions.willGetSowsList())
                  }}
                />
              </Col>
            </Row>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <TableSows tabId="1" data={sowsAsSeller} />
              </TabPane>
              <TabPane tabId="2">
                <TableSows tabId="2" data={sowsAsBuyer} />
              </TabPane>
              <TabPane tabId="3">
                <TableSows tabId="3" data={sowsAsArbitrator} />
              </TabPane>
            </TabContent>
          </Card>
        </Container>
      }

      <SaveMnemonicModal mnemonicSecretKeyProp='' />
    </>
  )
}