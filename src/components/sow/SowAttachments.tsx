import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Collapse, Jumbotron, CardSubtitle,
  Col, Row, Card, CardBody,
  ListGroup, ListGroupItem, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { selectors as ChatSelectors } from '../../store/slices/chat'
import { FileButton } from '../common/FileButton'
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const SowAttachments = () => {

  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const newAttachments = useSelector(SowSelectors.getNewAttachments)
  const messagesCommands = useSelector(ChatSelectors.getMessagesCommands)

  const [isOpenAgreement, setIsOpenAgreement] = React.useState(false);
  const toggleAgreement = () => setIsOpenAgreement(!isOpenAgreement);
  const [isOpenDeliverable, setIsOpenDeliverable] = React.useState(false);
  const toggleDeliverable = () => setIsOpenDeliverable(!isOpenDeliverable);
  const [isOpenSellersAttachments, setIsOpenSellersAttachments] = React.useState(false);
  const toggleSellersAttachments = () => setIsOpenSellersAttachments(!isOpenSellersAttachments);
  const [isOpenBuyersAttachments, setIsOpenBuyersAttachments] = React.useState(false);
  const toggleBuyersAttachments = () => setIsOpenBuyersAttachments(!isOpenBuyersAttachments);

  return (
    <>
      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Attachments</CardSubtitle>
      <Jumbotron>
        <ListGroup>
          <ListGroupItem onClick={toggleAgreement}>
            <Row>
              <Col className="col-1">
                <FontAwesomeIcon icon={isOpenAgreement ? faAngleDown : faAngleRight} size='1x' />
              </Col>
              <Col>
                <CardText>Agreement</CardText>
              </Col>
            </Row>
          </ListGroupItem>
          <Collapse isOpen={isOpenAgreement}>
            <Card className='d-flex justify-content-center col-auto' style={{ fontSize: 11 }} >
              {messagesCommands[SowCommands.SUBMIT] &&
                <LinkBlockExplorer title="Asset on Block Explorer" type="asset" id={JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId} />
              }
              {messagesCommands[SowCommands.ACCEPT_AND_PAY] &&
                <LinkBlockExplorer title="Opt-in on Block Explorer" type="tx" id={JSON.parse(messagesCommands[SowCommands.ACCEPT_AND_PAY].commandMessage.data).tx[0]} />
              }
            </Card>
            {newAttachments.map((attachment: any, index: any) => {
              return (
                attachment.owner === currentSow.sow && attachment.filename != configuration[stage].deliverable_key &&
                <ListGroupItem data-cy="attachmentsSow" key={index}>
                  <FileButton file={attachment} />
                </ListGroupItem>
              )
            })}
          </Collapse>
          <ListGroupItem onClick={toggleDeliverable}>
            <Row>
              <Col className="col-1">
                <FontAwesomeIcon icon={isOpenDeliverable ? faAngleDown : faAngleRight} size='1x' />
              </Col>
              <Col>
                <CardText>Deliverable</CardText>
              </Col>
            </Row>
          </ListGroupItem>
          <Collapse isOpen={isOpenDeliverable}>
            {newAttachments.some((file: any) => file.filename == configuration[stage].deliverable_key) ?
              newAttachments.map((attachment: any, index: any) => {
                return (attachment.filename == configuration[stage].deliverable_key &&
                  <ListGroupItem data-cy="attachmentsSeller" key={index} >
                    <FileButton file={attachment} />
                  </ListGroupItem>
                )
              })
              : <CardText className="text-muted text-center">No file found</CardText>
            }
          </Collapse>
          <ListGroupItem onClick={toggleSellersAttachments}>
            <Row>
              <Col className="col-1">
                <FontAwesomeIcon icon={isOpenSellersAttachments ? faAngleDown : faAngleRight} size='1x' />
              </Col>
              <Col>
                <CardText>Seller's Attachments</CardText>
              </Col>
            </Row>
          </ListGroupItem>
          <Collapse isOpen={isOpenSellersAttachments}>
            {newAttachments.some((file: any) => file.owner == currentSow.seller) ?
              newAttachments.map((attachment: any, index: any) => {
                return (attachment.owner === currentSow.seller &&
                  <ListGroupItem data-cy="attachmentsSeller" key={index} >
                    <FileButton file={attachment} />
                  </ListGroupItem>
                )
              })
              : <CardText className="text-muted text-center">No file found</CardText>
            }
          </Collapse>
          <ListGroupItem onClick={toggleBuyersAttachments}>
            <Row>
              <Col className="col-1">
                <FontAwesomeIcon icon={isOpenBuyersAttachments ? faAngleDown : faAngleRight} size='1x' />
              </Col>
              <Col>
                <CardText>Buyer's Attachments</CardText>
              </Col>
            </Row>
          </ListGroupItem>
          <Collapse isOpen={isOpenBuyersAttachments}>
            {newAttachments.some((file: any) => file.owner == currentSow.buyer) ?
              newAttachments.map((attachment: any, index: any) => {
                return (attachment.owner === currentSow.buyer &&
                  <ListGroupItem data-cy="attachmentsBuyer" key={index}>
                    <FileButton file={attachment} />
                  </ListGroupItem>
                )
              })
              : <CardText className="text-muted text-center">No file found</CardText>
            }
          </Collapse>
        </ListGroup>
      </Jumbotron>
    </>
  )
}