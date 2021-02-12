import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText, Badge,
  Row, Col, Card, CardText, Container,
  FormText, FormGroup, Input, Label, FormFeedback,
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import 'react-chat-elements/dist/main.css';
import { MessageBox, MessageList, Input as InputChatElements, Button, Avatar } from 'react-chat-elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

import { ActivityButton } from '../components/ActivityButton'
import { SowAttachments } from '../components/SowAttachments'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { selectors as AuthSelectors } from '../store/slices/auth'

function updateScroll() {
  var element: any = document.getElementById("chatMessages");
  element.scrollTop = element.scrollHeight;
}

export const ChatSow = ({ currentSow }: any) => {

  console.log("in ChatSow sow: ", currentSow)

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
    }, 30000);

    return () => clearInterval(refreshChat)
  }, []);

  React.useEffect(() => {
    updateScroll()
  }, [messages]);

  return (
    <>
      <Row id='chatMessages' style={{ overflow: 'scroll', minHeight: '200px', maxHeight: '500px' }}>
        <Col className="col-12">
          <Card >
            {
              messages.map((msg: any, index: any) => {
                return (
                  <>
                    {/* <Avatar
                  src={'https://facebook.github.io/react/img/logo.svg'}
                  alt={msg.from == currentSow.seller ? 'S' : msg.from == currentSow.buyer ? 'B' : msg.from == currentSow.arbitrator && 'A'}
                  size="small"
                  type="circle flexible" /> */}

                    <MessageBox
                      data-cy='messageChat'
                      className='chatMessage'
                      title={users[msg.from].given_name + ' ' + users[msg.from].family_name}
                      position={user.username == msg.from ? 'right' : 'left'}
                      type={(msg.type == 'TEXT' || msg.type == 'COMMAND') ? 'text' : msg.type == 'ATTACHMENT' && 'file'}
                      text={msg.textMessage ? msg.textMessage.message
                        : msg.commandMessage ? msg.commandMessage.command
                          : msg.attachmentMessage.key.split('/').pop().length > 20 ?
                            msg.attachmentMessage.key.split('/').pop().substring(0, 16) + '... ' + msg.attachmentMessage.key.split('/').pop().substring(msg.attachmentMessage.key.split('/').pop().length - 4, msg.attachmentMessage.key.split('/').pop().length)
                            : msg.attachmentMessage.key.split('/').pop()
                      }
                      date={new Date(msg.createdAt)}
                      data={msg.type == 'ATTACHMENT' ? {
                        uri: msg.attachmentMessage.downloadUrl,
                        status: {
                          click: true,
                          loading: 0,
                        }
                      }
                        : {}}
                      onDownload={(event: any) => {
                        window.open(msg.attachmentMessage.downloadUrl);
                      }}
                    />
                  </>
                )
              }
              )
            }
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="col-12">
          <InputChatElements
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
            <SowAttachments currentSow={currentSow} />
          </Col>
        </Row>
      </Formik>
    </>
  )
}