import * as React from 'react';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { ActivityButton } from '../components/ActivityButton'
import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { selectors as UISelectors, actions as UIActions } from '../store/slices/ui'

const SignupSchema = Yup.object().shape({
  givenName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  familyName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email()
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
  emailConfirm: Yup.string()
    .test('email-match', 'Emails must match', function (value) {
      return this.parent.email === value
    })
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export const SignupPage = () => {

  const dispatch = useDispatch();
  const isLoading = useSelector(UISelectors.isLoading)
  const loginError = useSelector(AuthSelectors.getLoggedError);
  let history = useHistory();

  React.useEffect(() => {
    console.log('effect loginError: ', loginError);
  }, [loginError])

  React.useEffect(() => {
    dispatch(UIActions.stopLoading())
  }, [])

  return (
    <>
      {!isLoading &&
        <Container>
          <Card className="mt-3 mt-lg-10">
            <CardBody>
              <CardTitle tag="h5" className="text-center">Signup Page</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert Email e Password</CardSubtitle>
              <Formik
                initialValues={{
                  email: '',
                  emailConfirm: '',
                  familyName: '',
                  givenName: '',
                  password: '',
                  passwordConfirm: ''
                }}
                validationSchema={SignupSchema}
                validateOnBlur={true}
                onSubmit={values => {
                  console.log('in onsubmit with: ', values)
                  dispatch(AuthActions.willSignupUser({ email: values.email, password: values.password, family_name: values.familyName, given_name: values.givenName, history: history }));
                }}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                    <FormGroup>
                      <Label for="givenName">Name</Label>
                      <Input invalid={errors.givenName && touched.givenName ? true : false} type="text" name="givenName" id="givenName" placeholder="name" tag={Field} />
                      {errors.givenName && touched.givenName ? (
                        <FormFeedback>{errors.givenName}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="familyName">Surname</Label>
                      <Input invalid={errors.familyName && touched.familyName ? true : false} type="text" name="familyName" id="familyName" placeholder="surname" tag={Field} />
                      {errors.familyName && touched.familyName ? (
                        <FormFeedback>{errors.familyName}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email Address</Label>
                      <Input invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="email" tag={Field} />
                      {errors.email && touched.email ? (
                        <FormFeedback>{errors.email}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="emailConfirm">Confirm Email Address</Label>
                      <Input invalid={errors.emailConfirm && touched.emailConfirm ? true : false} type="text" name="emailConfirm" id="emailConfirm" placeholder="email confirm" tag={Field} />
                      {errors.emailConfirm && touched.emailConfirm ? (
                        <FormFeedback>{errors.emailConfirm}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="password" tag={Field} />
                      {errors.password && touched.password ? (
                        <FormFeedback>{errors.password}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="passwordConfirm">Confirm Password</Label>
                      <Input invalid={errors.passwordConfirm && touched.passwordConfirm ? true : false} type="password" name="passwordConfirm" id="passwordConfirm" placeholder="password confirm" tag={Field} />
                      {errors.passwordConfirm && touched.passwordConfirm ? (
                        <FormFeedback>{errors.passwordConfirm}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <Row>
                      <Col>
                        <ActivityButton type="submit" name="signup" color="primary" block>Signup</ActivityButton>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col><Button color="primary" block to="/login" outline tag={Link}>Login</Button></Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Container>
      }
    </>
  )
}