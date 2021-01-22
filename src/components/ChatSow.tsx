import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText, Badge,
  Row, Col, Card, CardText,
  FormText, FormGroup, Input, Label, FormFeedback,
} from 'reactstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { ActivityButton } from '../components/ActivityButton'
import { SowAttachments } from '../components/SowAttachments'

const MessageSchema = Yup.object().shape({
  message: Yup.string()
    .required('Required')
});

export const ChatSow = ({ currentSow }: any) => {

  console.log("in ChatSow sow: ", currentSow)
  return (
    <>
      <Card>
        <CardText name="sow">message one</CardText>
        <CardText name="sow">message two</CardText>
        <CardText name="sow">message three</CardText>
      </Card>
      <Formik
        initialValues={{
          message: ''
        }}
        validationSchema={MessageSchema}
        validateOnBlur={true}
        onSubmit={values => {
          console.log('in onsubmit with: ', values)
          // dispatch(SowActions.willSubmitStatementOfWork({ sow: values, history: history }));
        }}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <Form>
              <FormGroup>
                {/* <Label for="message">Message</Label> */}
                <Input invalid={errors.message && touched.message ? true : false} type="text" name="message" id="message" placeholder="message" tag={Field} />
                {errors.message && touched.message ? (
                  <FormFeedback>{errors.message}</FormFeedback>
                ) : null}
              </FormGroup>
              <Row>
                <Col><ActivityButton type="submit" name="sendMessage" color="primary" block>Send message</ActivityButton></Col>
              </Row>
              {/* <SowAttachments sow={currentSow.sow} /> */}
            </Form>
          )
        }}
      </Formik>
    </>
  )
}