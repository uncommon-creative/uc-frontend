import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText, Badge,
  Row, Col, Card, CardText,
  FormText, FormGroup, Input, Label, FormFeedback,
} from 'reactstrap';
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

export const ChatSow = ({ currentSow }: any) => {

  console.log("in ChatSow sow: ", currentSow)

  const dispatch = useDispatch()
  const message = useSelector(ChatSelectors.getMessage)
  const user = useSelector(AuthSelectors.getUser)
  const messages = useSelector(ChatSelectors.getMessages)

  return (
    <>
      <Card>
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
                  className='chatMessage'
                  title={msg.from}
                  position={user.username == msg.from ? 'right' : 'left'}
                  type={msg.type == 'TEXT' && 'text'}
                  text={msg.textMessage && msg.textMessage.message}
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

      <Row>
        <Col className="col-10">
          <Input
            value={message}
            placeholder="Type here..."
            multiline={true}
            onChange={(event: any) => {
              dispatch(ChatActions.willWriteMessage(event.target.value))
            }}
          />
        </Col>
        <Col className="col-2">
          <ActivityButton type="submit" name="sendMessageChat" color="primary" block
            onClick={() => {
              console.log('in onsubmit with: ', message)
              dispatch(ChatActions.willSendTextChat({ values: { message: message }, sow: currentSow }));
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </ActivityButton>
        </Col>
      </Row>
    </>
  )
}