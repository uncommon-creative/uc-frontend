import * as React from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { ActivityButton } from '../components/ActivityButton'


const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const ForgotPasswordRequestSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
});

export const LoginPage = () => {

  const dispatch = useDispatch();
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const loginError = useSelector(AuthSelectors.getLoggedError);
  let history = useHistory();
  console.log('loginError: ');

  React.useEffect(() => {

    console.log('effect loginError: ', loginError);

    return () => { }

  }, [loginError])

  return (
    <Container>
      <Card className="mt-3 mt-lg-10">
        {!forgotPassword ?
          <CardBody>
            <CardTitle tag="h5" className="text-center">Login Page</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert User and Password</CardSubtitle>
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={LoginSchema}
              validateOnBlur={true}
              onSubmit={values => {
                console.log('in onsubmit with: ', values)
                dispatch(AuthActions.willLoginUser({ email: values.email, password: values.password, history: history }));
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="with a placeholder" autoComplete="email" tag={Field} />
                    {errors.email && touched.email ? (
                      <FormFeedback>{errors.email}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="password placeholder" autoComplete="current-password" tag={Field} />
                    {errors.password && touched.password ? (
                      <FormFeedback>{errors.password}</FormFeedback>
                    ) : null}

                  </FormGroup>
                  <ActivityButton type="submit" name="login" color="primary" block>Login</ActivityButton>
                  <Button color="primary" block to="/signup" outline tag={Link}>Signup</Button>
                  <Button color="link" block onClick={() => setForgotPassword(true)}>Forgot Password?</Button>
                </Form>
              )}
            </Formik>
          </CardBody>
          :
          <CardBody>
            <CardTitle tag="h5" className="text-center">Forgot Password Page</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert Email</CardSubtitle>
            <Formik
              initialValues={{
                email: ''
              }}
              validationSchema={ForgotPasswordRequestSchema}
              validateOnBlur={true}
              onSubmit={values => {
                console.log('in onsubmit with: ', values)
                dispatch(AuthActions.willForgotPasswordRequest({ email: values.email, history: history }))
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="email" autoComplete="email" tag={Field} />
                    {errors.email && touched.email ? (
                      <FormFeedback>{errors.email}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <ActivityButton type="submit" name="requestNewPassword" color="primary" block>Request new password</ActivityButton>
                  <Row className="mt-2">
                    <Col>
                      <Button color="primary" block outline onClick={() => setForgotPassword(false)}>Login</Button>
                    </Col>
                    <Col>
                      <Button color="primary" block to="/signup" outline tag={Link}>Signup</Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </CardBody>
        }
      </Card>
    </Container>
  )
}