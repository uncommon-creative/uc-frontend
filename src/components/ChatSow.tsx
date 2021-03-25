import React from "react";
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
import { useTranslation } from 'react-i18next';

import { ActivityButton } from './common/ActivityButton'
import { SowAttachments } from '../components/SowAttachments'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { actions as SowActions, SowStatus, SowCommands } from "../store/slices/sow";

function updateScroll() {
  var element: any = document.getElementById("chatMessages");
  element.scrollTop = element.scrollHeight;
}

export const ChatSow = ({ currentSow }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const message = useSelector(ChatSelectors.getMessage)
  const user = useSelector(AuthSelectors.getUser)
  const users = useSelector(ProfileSelectors.getUsers)
  const messages = useSelector(ChatSelectors.getMessages)
  let inputRef: any = React.createRef();

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
                              <CardTitle className={msg.commandMessage.command == SowCommands.SYSTEM_SIGN ? "text-center text-primary font-weight-bold" : "text-primary font-weight-bold"}>
                                {msg.commandMessage.command}
                              </CardTitle>
                              {msg.commandMessage.data && JSON.parse(msg.commandMessage.data).tx &&
                                <CardSubtitle className="text-center text-muted text-break">
                                  {'transaction: ' + JSON.parse(msg.commandMessage.data).tx}
                                </CardSubtitle>
                              }
                              {msg.commandMessage.data && JSON.parse(msg.commandMessage.data).reviews_left &&
                                <CardSubtitle className="text-center text-muted text-break">
                                  {'#' + JSON.parse(msg.commandMessage.data).reviews_left + '\n' + JSON.parse(msg.commandMessage.data).message}
                                </CardSubtitle>
                              }
                              <CardText>
                                {t(`chat.SowCommands.${msg.commandMessage.command}_info`)}
                              </CardText>
                            </>



                            //     msg.commandMessage.command == SowCommands.REQUEST_REVIEW ?
                            //       msg.commandMessage.command + ' (#' + JSON.parse(msg.commandMessage.data).reviews_left + '): \n' + JSON.parse(msg.commandMessage.data).message
                            //       : msg.commandMessage.command == SowCommands.SYSTEM_SIGN ?
                            //         <>
                            //   <CardTitle className="text-center text-primary">
                            //     {msg.commandMessage.command}
                            //   </CardTitle>
                            //   <CardSubtitle className="text-center text-muted text-break">
                            //     {'transaction: ' + JSON.parse(msg.commandMessage.data).tx}
                            //   </CardSubtitle>
                            //   <CardText>
                            //     {t(`chat.SowCommands.${SowCommands.SYSTEM_SIGN}_info`)}
                            //   </CardText>
                            // </>
                            //         : msg.commandMessage.command



                            : msg.attachmentMessage.key.split('/').pop().length > 20 ?
                              msg.attachmentMessage.key.split('/').pop().substring(0, 16) + '... ' + msg.attachmentMessage.key.split('/').pop().substring(msg.attachmentMessage.key.split('/').pop().length - 4, msg.attachmentMessage.key.split('/').pop().length)
                              : msg.attachmentMessage.key.split('/').pop()


                          // msg.textMessage ? msg.textMessage.message
                          //   : msg.commandMessage ?
                          //     msg.commandMessage.data ?
                          //       msg.commandMessage.command + ' (#' + JSON.parse(msg.commandMessage.data).reviews_left + '): \n' + JSON.parse(msg.commandMessage.data).message
                          //       : msg.commandMessage.command
                          //     : msg.attachmentMessage.key.split('/').pop().length > 20 ?
                          //       msg.attachmentMessage.key.split('/').pop().substring(0, 16) + '... ' + msg.attachmentMessage.key.split('/').pop().substring(msg.attachmentMessage.key.split('/').pop().length - 4, msg.attachmentMessage.key.split('/').pop().length)
                          //       : msg.attachmentMessage.key.split('/').pop()
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
      </Row>
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
            <Label for="attachments">Attachments</Label>
            <SowAttachments currentSow={currentSow} />
          </Col>
        </Row>
      </Formik>
    </>
  )
}