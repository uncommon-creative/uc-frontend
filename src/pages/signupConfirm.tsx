import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Jumbotron, Container, Button, FormGroup, Input, Label, FormFeedback, Col, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage, setNestedObjectValues } from 'formik';

import { ActivityButton } from '../components/ActivityButton'
import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'

const ConfirmSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export const SignupConfirmPage = () => {

  let { code }: any = useParams();
  let username = localStorage.getItem('username')
  const dispatch = useDispatch();
  let history = useHistory();

  React.useEffect(() => {
    console.log('SignupConfirmPage with code: ', code);
    console.log('SignupConfirmPage with username: ', username);

    code && username && dispatch(AuthActions.willConfirmUser({ username: username, code: code, history: history }));

    return () => { }
  }, [])

  return (
    <Container className="mt-3 mt-lg-10">
      <Jumbotron fluid>
        {!code &&
          <Container fluid className="text-center">
            <h2>Account Created</h2>
            <p className="lead">Check Email for account confirmation</p>
          </Container>
        }
        {code && username &&
          <Container fluid className="text-center">
            <h2>Account Confirmed</h2>
            <Button color="link" to="/login" block tag={Link}>Login</Button>
          </Container>
        }
        {code && !username &&
          <Container fluid className="text-center">
            <h2>Insert your username/email to confirm</h2>
            <Formik
              initialValues={{
                email: ''
              }}
              validationSchema={ConfirmSchema}
              validateOnBlur={true}
              onSubmit={values => {
                console.log('in onsubmit with: ', values)
                dispatch(AuthActions.willConfirmUser({ username: values.email, code: code, history: history }));
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <FormGroup>
                    <Input invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="Email Address" tag={Field} />
                    {errors.email && touched.email ? (
                      <FormFeedback>{errors.email}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <Row>
                    <Col>
                      <ActivityButton name="confirm" color="primary" disabled block>Confirm</ActivityButton>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Container>
        }

      </Jumbotron>
    </Container>
  )
}