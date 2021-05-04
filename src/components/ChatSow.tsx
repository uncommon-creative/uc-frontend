import React from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row, Col, Card, Label,
  CardTitle, CardSubtitle, CardText
} from 'reactstrap';
import { Formik } from 'formik';
import 'react-chat-elements/dist/main.css';
import { MessageBox, MessageList, Input as InputChatElements, Button, Avatar } from 'react-chat-elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useTranslation, Trans } from 'react-i18next';

import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { actions as NotificationActions } from '../store/slices/notification'
import { actions as SowActions, selectors as SowSelectors, SowStatus, SowCommands } from '../store/slices/sow'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { actions as AssetCurrencyActions, selectors as AssetCurrencySelectors } from '../store/slices/assetCurrency'
import { ActivityButton } from './common/ActivityButton'
import { SowAttachmentsInput } from './SowAttachmentsInput'
import { LinkBlockExplorer } from './common/LinkBlockExplorer'
import { AcceptAndPay } from '../components/transaction/AcceptAndPay'
import { ClaimMilestoneMet } from '../components/transaction/ClaimMilestoneMet'
import { AcceptMilestone } from '../components/transaction/AcceptMilestone'
import { Reject } from '../components/transaction/Reject'
import { RequestReview } from '../components/transaction/RequestReview'


function updateScroll() {
  var element: any = document.getElementById("chatMessages");
  element.scrollTop = element.scrollHeight;
}

export const ChatSow = ({ currentSow }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const message = useSelector(ChatSelectors.getMessage)
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const algorandAccount = useSelector(ProfileSelectors.getAlgorandAccount)
  const assetsCurrencies = useSelector(AssetCurrencySelectors.getAssetsCurrencies)
  const messages = useSelector(ChatSelectors.getMessages)
  let inputRef: any = React.createRef();

  const [modalOpenAcceptSow, setModalOpenAcceptSow] = React.useState(false);
  const [modalOpenClaimMilestoneMet, setModalOpenClaimMilestoneMet] = React.useState(false);
  const [modalOpenAcceptMilestone, setModalOpenAcceptMilestone] = React.useState(false);
  const [modalOpenReject, setModalOpenReject] = React.useState(false);
  const [modalOpenRequestReview, setModalOpenRequestReview] = React.useState(false);

  const toggleModalAcceptSow = () => setModalOpenAcceptSow(!modalOpenAcceptSow);
  const toggleModalClaimMilestoneMet = () => setModalOpenClaimMilestoneMet(!modalOpenClaimMilestoneMet);
  const toggleModalAcceptMilestone = () => setModalOpenAcceptMilestone(!modalOpenAcceptMilestone);
  const toggleModalReject = () => setModalOpenReject(!modalOpenReject);
  const toggleModalRequestReview = () => setModalOpenRequestReview(!modalOpenRequestReview);

  React.useEffect(() => {
    const refreshChat = setInterval(() => {
      dispatch(ChatActions.willRefreshSowChat({ messages: messages, sow: currentSow.sow }))
      dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
    }, 30000);

    return () => clearInterval(refreshChat)
  }, []);

  React.useEffect(() => {
    updateScroll()
  }, [messages]);

  return (
    <>
      <Row id='chatMessages' style={{ overflow: 'auto', minHeight: '200px', maxHeight: '500px' }}>
        <Col className="col-12 p-0">
          <Card>
            {
              messages.map((msg: any, index: any) => {
                return (
                  // <>
                  //   <Avatar
                  // src={'https://facebook.github.io/react/img/logo.svg'}
                  // alt={msg.from == currentSow.seller ? 'S' : msg.from == currentSow.buyer ? 'B' : msg.from == currentSow.arbitrator && 'A'}
                  // size="small"
                  // type="circle flexible" />

                  <MessageBox
                    key={index}
                    data-cy='messageChat'
                    className='chatMessage'
                    title={msg.from == "SYSADMIN" ? msg.from : users[msg.from].given_name + ' ' + users[msg.from].family_name}
                    position={user.username == msg.from ? 'right' : 'left'}
                    type={(msg.type == 'TEXT' || msg.type == 'COMMAND') ? 'text' : msg.type == 'ATTACHMENT' && 'file'}
                    text={
                      <>
                        {msg.textMessage ?
                          <CardText>
                            {msg.textMessage.message}
                          </CardText>
                          : msg.commandMessage ?
                            <>
                              <CardTitle data-cy="chatCommand" className={msg.commandMessage.command == SowCommands.SYSTEM_SIGN ? "text-center text-primary font-weight-bold" : "text-primary font-weight-bold"}>
                                {t(`chat.SowCommands.${msg.commandMessage.command}`)}
                              </CardTitle>
                              {msg.commandMessage.data && JSON.parse(msg.commandMessage.data).tx &&
                                <CardSubtitle className={msg.commandMessage.command == SowCommands.SYSTEM_SIGN ? "text-center" : ""}>
                                  {msg.commandMessage.command == SowCommands.ACCEPT_AND_PAY ?
                                    <>
                                      {JSON.parse(msg.commandMessage.data).tx.length == 5 &&
                                        <>
                                          <LinkBlockExplorer title={'Payment fee (ALGO) transaction: ' + JSON.parse(msg.commandMessage.data).tx[0].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[0]} />
                                          <LinkBlockExplorer title={`Opt-in multisig asset ${currentSow.currency} transaction: ` + JSON.parse(msg.commandMessage.data).tx[1].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[1]} />
                                          <LinkBlockExplorer title={'Opt-in deliverable asset transaction: ' + JSON.parse(msg.commandMessage.data).tx[2].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[2]} />
                                          <LinkBlockExplorer title={`Payment (${currentSow.currency}) transaction: ` + JSON.parse(msg.commandMessage.data).tx[3].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[3]} />
                                          <LinkBlockExplorer title={`Payment UC commission (${currentSow.currency}) transaction: ` + JSON.parse(msg.commandMessage.data).tx[4].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[4]} />
                                        </>
                                      }
                                      {JSON.parse(msg.commandMessage.data).tx.length == 4 &&
                                        <>
                                          <LinkBlockExplorer title={'Payment fee (ALGO) transaction: ' + JSON.parse(msg.commandMessage.data).tx[0].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[0]} />
                                          <LinkBlockExplorer title={'Opt-in deliverable asset transaction: ' + JSON.parse(msg.commandMessage.data).tx[1].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[1]} />
                                          <LinkBlockExplorer title={`Payment (${currentSow.currency}) transaction: ` + JSON.parse(msg.commandMessage.data).tx[2].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[2]} />
                                          <LinkBlockExplorer title={`Payment UC commission (${currentSow.currency}) transaction: ` + JSON.parse(msg.commandMessage.data).tx[3].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[3]} />
                                        </>
                                      }
                                      {JSON.parse(msg.commandMessage.data).tx.length == 3 &&
                                        <>
                                          <LinkBlockExplorer title={'Opt-in transaction: ' + JSON.parse(msg.commandMessage.data).tx[0].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[0]} />
                                          <LinkBlockExplorer title={'Payment transaction: ' + JSON.parse(msg.commandMessage.data).tx[1].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[1]} />
                                          <LinkBlockExplorer title={'Payment UC commission transaction: ' + JSON.parse(msg.commandMessage.data).tx[2].substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx[2]} />
                                        </>
                                      }
                                    </>
                                    :
                                    msg.commandMessage.command == SowCommands.ACCEPT_MILESTONE ?
                                      <>
                                        <LinkBlockExplorer title={`Multisig transaction: ${JSON.parse(msg.commandMessage.data).tx[0].substring(0, 6)}...`} type="tx" id={JSON.parse(msg.commandMessage.data).tx[0]} />
                                        <LinkBlockExplorer title={`Opt-in transaction: ${JSON.parse(msg.commandMessage.data).tx[1].substring(0, 6)}...`} type="tx" id={JSON.parse(msg.commandMessage.data).tx[1]} />
                                        <LinkBlockExplorer title={`Asset transfer transaction: ${JSON.parse(msg.commandMessage.data).tx[2].substring(0, 6)}...`} type="tx" id={JSON.parse(msg.commandMessage.data).tx[2]} />
                                      </>
                                      : <LinkBlockExplorer title={'Transaction: ' + JSON.parse(msg.commandMessage.data).tx.substring(0, 6) + '...'} type="tx" id={JSON.parse(msg.commandMessage.data).tx} />
                                  }
                                </CardSubtitle>
                              }
                              {msg.commandMessage.data && JSON.parse(msg.commandMessage.data).assetId &&
                                <CardSubtitle className={msg.commandMessage.command == SowCommands.SYSTEM_SIGN ? "text-center mt-1" : "mt-1"}>
                                  <LinkBlockExplorer title={'Notarization proof: ' + JSON.parse(msg.commandMessage.data).assetId} type="asset" id={JSON.parse(msg.commandMessage.data).assetId} />
                                </CardSubtitle>
                              }
                              {msg.commandMessage.data && JSON.parse(msg.commandMessage.data).reviews_left &&
                                <CardSubtitle className="text-center text-muted text-break">
                                  {'#' + JSON.parse(msg.commandMessage.data).reviews_left + '\n' + JSON.parse(msg.commandMessage.data).message}
                                </CardSubtitle>
                              }
                              {msg.commandMessage.command == SowCommands.SUBMIT ?
                                <CardText className="mt-3">
                                  <Trans i18nKey={SowCommands.SUBMIT}>
                                    {"The seller submitted the "}
                                    <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>Statement of Work</a>
                                    {" to be checked and accepted by the buyer."}
                                  </Trans>
                                </CardText>
                                : msg.commandMessage.command == SowCommands.CLAIM_MILESTONE_MET ?
                                  <CardText className="mt-3">
                                    <Trans i18nKey={SowCommands.CLAIM_MILESTONE_MET}>

                                      {newAttachments.some((file: any) => file.filename === "deliverable") ?
                                        <>
                                          {"The seller claimed the milestone as met attaching the "}
                                          <a target="_blank" href={newAttachments.find((file: any) => file.filename === "deliverable").downloadUrl}>deliverable</a>
                                        </>
                                        : <>
                                          {"The seller claimed the milestone as met attaching the "}
                                          {"deliverable"}
                                        </>

                                      }
                                      {".\nThe buyer has 7 days starting from today to take an action, otherwise the system will accept the milestone and complete the payment."}
                                    </Trans>
                                  </CardText>
                                  : <CardText className="mt-3">
                                    {t(`chat.SowCommands.${msg.commandMessage.command}_info`)}
                                  </CardText>
                              }
                              {currentSow.status == SowStatus.SUBMITTED && msg.commandMessage.command == SowCommands.SUBMIT && currentSow.buyer === user.username &&
                                <Row>
                                  <Col>
                                    <ActivityButton /* disabled={currentChosenArbitrator == ''} */ block color="primary" name={SowCommands.ACCEPT_AND_PAY}
                                      onClick={
                                        !userAttributes.address ?
                                          () => {
                                            history.push('/profile')
                                            dispatch(NotificationActions.willShowNotification({ message: "Please complete your profile before accept and pay.", type: "info" }));
                                          }
                                          : (currentSow.currency != "ALGO" && !algorandAccount.assets.some((accountAsset: any) => JSON.parse(accountAsset)["asset-id"] == assetsCurrencies.find((asset: any) => asset.assetName === currentSow.currency).assetIndex)) ?
                                            () => {
                                              dispatch(AssetCurrencyActions.willGoToAssetCurrencyPage({ address: userAttributes.public_key, history: history }));
                                              dispatch(AssetCurrencyActions.willSelectAssetCurrency({ asset: assetsCurrencies.find((asset: any) => asset.assetName === currentSow.currency).assetIndex }))
                                            }
                                            : toggleModalAcceptSow
                                      }
                                    >
                                      Accept and pay
                                    </ActivityButton>
                                  </Col>
                                  <Col>
                                    <ActivityButton block color="primary" name={SowCommands.REJECT}
                                      onClick={toggleModalReject}
                                    >Reject</ActivityButton>
                                  </Col>
                                </Row>
                              }
                              {(currentSow.status == SowStatus.ACCEPTED_PAID || currentSow.status == SowStatus.REVIEW_REQUIRED) && (msg.commandMessage.command == SowCommands.ACCEPT_AND_PAY || msg.commandMessage.command == SowCommands.REQUEST_REVIEW) && currentSow.seller === user.username &&
                                <Row>
                                  <Col>
                                    <ActivityButton block color="primary" name={SowCommands.CLAIM_MILESTONE_MET}
                                      onClick={toggleModalClaimMilestoneMet}
                                    >Claim milestone met</ActivityButton>
                                  </Col>
                                </Row>
                              }
                              {currentSow.status == SowStatus.MILESTONE_CLAIMED && msg.commandMessage.command == SowCommands.CLAIM_MILESTONE_MET && currentSow.buyer === user.username &&
                                <Row>
                                  <Col>
                                    <ActivityButton block color="primary" name={SowCommands.REQUEST_REVIEW}
                                      disabled={currentSow.numberReviews == 0}
                                      onClick={toggleModalRequestReview}
                                    >Ask review</ActivityButton>
                                  </Col>
                                  <Col>
                                    <ActivityButton block color="primary" name={SowCommands.REJECT}
                                      onClick={toggleModalReject}
                                    >Reject</ActivityButton>
                                  </Col>
                                  <Col>
                                    <ActivityButton block color="primary" name={SowCommands.ACCEPT_MILESTONE}
                                      onClick={toggleModalAcceptMilestone}
                                    >Accept</ActivityButton>
                                  </Col>
                                </Row>
                              }

                            </>
                            : msg.attachmentMessage.key.split('/').pop().length > 20 ?
                              msg.attachmentMessage.key.split('/').pop().substring(0, 16) + '... ' + msg.attachmentMessage.key.split('/').pop().substring(msg.attachmentMessage.key.split('/').pop().length - 4, msg.attachmentMessage.key.split('/').pop().length)
                              : msg.attachmentMessage.key.split('/').pop()
                        }
                      </>
                    }
                    notch={msg.commandMessage && msg.commandMessage.command == SowCommands.SYSTEM_SIGN ? false : true}
                    date={new Date(msg.createdAt)}
                    data={msg.type == 'ATTACHMENT' ?
                      {
                        uri: msg.attachmentMessage.downloadUrl,
                        status: {
                          click: true,
                          loading: 0,
                        }
                      }
                      : {}
                    }
                    onDownload={(event: any) => {
                      window.open(msg.attachmentMessage.downloadUrl);
                    }}
                  />
                  // </>
                )
              })
            }
          </Card>
        </Col>
      </Row >
      <Row>
        <Col className="col-12 px-0">
          <InputChatElements
            inputStyle={{ overflow: 'auto', maxHeight: '300px' }}
            className="border"
            value={message}
            placeholder="Type here..."
            multiline={true}
            onChange={(event: any) => {
              dispatch(ChatActions.willWriteMessage(event.target.value))
            }}
            inputRef={(ref: any) => inputRef = ref}
            rightButtons={
              <ActivityButton data-cy='sendMessage' type="submit" name="sendMessageChat" color="primary" block
                onClick={() => {
                  console.log('in onsubmit with: ', message)
                  message.trim() != "" && dispatch(ChatActions.willSendTextChat({ values: { message: message.trim() }, sow: currentSow }));
                  inputRef.value = ''
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </ActivityButton>
            }
          />
        </Col>
      </Row>
      <Formik
        initialValues={{}}
        onSubmit={() => { }}
      >
        <Row>
          <Col>
            <Label for="attachments">
              Attachments
              {/* <CardSubtitle className="fs-5 text-muted" style={{ fontSize: 12 }}>
                Don't upload the deliverable here, but only while claiming milestone.
              </CardSubtitle> */}
            </Label>
            <SowAttachmentsInput currentSow={currentSow} />
          </Col>
        </Row>
      </Formik>

      {(currentSow.status === SowStatus.SUBMITTED || currentSow.status === SowStatus.ACCEPTED_PAID) &&
        <AcceptAndPay modal={modalOpenAcceptSow} toggle={toggleModalAcceptSow} />
      }
      {(currentSow.status == SowStatus.ACCEPTED_PAID || currentSow.status == SowStatus.REVIEW_REQUIRED || currentSow.status == SowStatus.MILESTONE_CLAIMED) &&
        <ClaimMilestoneMet modal={modalOpenClaimMilestoneMet} toggle={toggleModalClaimMilestoneMet} />
      }
      {(currentSow.status === SowStatus.MILESTONE_CLAIMED || currentSow.status === SowStatus.PAYMENT_SENT) &&
        <AcceptMilestone modal={modalOpenAcceptMilestone} toggle={toggleModalAcceptMilestone} />
      }
      <Reject modal={modalOpenReject} toggle={toggleModalReject} />
      <RequestReview modal={modalOpenRequestReview} toggle={toggleModalRequestReview} />
    </>
  )
}