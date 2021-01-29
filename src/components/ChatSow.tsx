import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText, Badge,
  Row, Col, Card, CardText, Container,
  FormText, FormGroup, Input, Label, FormFeedback,
} from 'reactstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-chat-elements/dist/main.css';
import { MessageBox, MessageList, Input as InputChatElements, Button, Avatar } from 'react-chat-elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'


import { ActivityButton } from '../components/ActivityButton'
import { SowAttachments } from '../components/SowAttachments'
import { actions as SowActions, selectors as SowSelectors } from '../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { selectors as AuthSelectors } from '../store/slices/auth'

function updateScroll() {
  var element: any = document.getElementById("chatMessages");
  element.scrollTop = element.scrollHeight;
}

export const ChatSow = ({ currentSow }: any) => {

  console.log("in ChatSow sow: ", currentSow)

  const dispatch = useDispatch()
  const message = useSelector(ChatSelectors.getMessage)
  const user = useSelector(AuthSelectors.getUser)
  const messages = useSelector(ChatSelectors.getMessages)
  let inputRef: any = React.createRef();

  React.useEffect(() => {
    updateScroll()

    inputRef.value = ''
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
                      title={msg.from}
                      position={user.username == msg.from ? 'right' : 'left'}
                      type={(msg.type == 'TEXT' || msg.type == 'COMMAND' || msg.type == 'ATTACHMENT') && 'text'}
                      text={msg.textMessage ? msg.textMessage.message : msg.commandMessage ? msg.commandMessage.command : msg.attachmentMessage && msg.attachmentMessage.key}
                      date={new Date(msg.createdAt)}
                      data={{
                        status: {
                          click: false,
                          loading: 0,
                        }
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
              console.log("AAA event: ", event)
              dispatch(ChatActions.willWriteMessage(event.target.value))
            }}
            inputRef={(ref: any) => inputRef = ref}
            rightButtons={
              <ActivityButton data-cy='sendMessage' type="submit" name="sendMessageChat" color="primary" block
                onClick={() => {
                  console.log('in onsubmit with: ', message)
                  message.trim() != "" && dispatch(ChatActions.willSendTextChat({ values: { message: message.trim() }, sow: currentSow }));
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