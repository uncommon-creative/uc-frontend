import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from "react-router-dom";

import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { ActivityButton } from '../components/ActivityButton'

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  code: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  passwordConfirm: Yup.string()
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    })
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

export const ForgotPasswordPage = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const forgotPasswordRequested = useSelector(AuthSelectors.requestedForgotPassword);

  return (
    <Container>
      <Card className="mt-3 mt-lg-10">
        {forgotPasswordRequested ?
          <CardBody>
            <CardTitle tag="h5" className="text-center">Forgot Password Page</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert Email, Code and Password</CardSubtitle>
            <Formik
              initialValues={{
                email: '',
                code: '',
                password: '',
                passwordConfirm: ''
              }}
              validationSchema={ForgotPasswordSchema}
              validateOnBlur={true}
              onSubmit={values => {
                console.log('in onsubmit with: ', values)
                dispatch(AuthActions.willForgotPasswordRequest({ email: values.email, code: values.code, password: values.password, history: history }))
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
                  <FormGroup>
                    <Label for="code">Code</Label>
                    <Input invalid={errors.code && touched.code ? true : false} type="text" name="code" id="code" placeholder="code" tag={Field} />
                    {errors.code && touched.code ? (
                      <FormFeedback>{errors.code}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="password" autoComplete="current-password" tag={Field} />
                    {errors.password && touched.password ? (
                      <FormFeedback>{errors.password}</FormFeedback>
                    ) : null}

                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Confirm Password</Label>
                    <Input invalid={errors.passwordConfirm && touched.passwordConfirm ? true : false} type="password" name="passwordConfirm" id="passwordConfirm" placeholder="password confirm" tag={Field} />
                    {errors.passwordConfirm && touched.passwordConfirm ? (
                      <FormFeedback>{errors.passwordConfirm}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <ActivityButton type="submit" name="confirmNewPassword" color="primary" block>Confirm new password</ActivityButton>
                  <Row className="mt-2">
                    <Col>
                      <Button color="primary" block to="/login" outline tag={Link}>Login</Button>
                    </Col>
                    <Col>
                      <Button color="primary" block to="/signup" outline tag={Link}>Signup</Button>
                    </Col>
                  </Row>
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
                dispatch(AuthActions.willForgotPasswordRequest({ email: values.email }))
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
                      <Button color="primary" block to="/login" outline tag={Link}>Login</Button>
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