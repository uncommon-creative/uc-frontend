import * as React from 'react';
import {
  Card, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { ActivityButton } from '../components/common/ActivityButton'
import { selectors as UISelectors, actions as UIActions } from '../store/slices/ui'


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
  const isLoading = useSelector(UISelectors.isLoading)
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const loginError = useSelector(AuthSelectors.getLoggedError);
  let history = useHistory();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    // dispatch(UIActions.stopLoading())
  }, [])

  return (
    <>
      {!isLoading &&
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
                        <Input data-cy="email" invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="insert email" autoComplete="email" tag={Field} />
                        {errors.email && touched.email ? (
                          <FormFeedback>{errors.email}</FormFeedback>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">Password</Label>
                        <Input data-cy="password" invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="insert password" autoComplete="current-password" tag={Field} />
                        {errors.password && touched.password ? (
                          <FormFeedback>{errors.password}</FormFeedback>
                        ) : null}

                      </FormGroup>
                      <ActivityButton data-cy="login" type="submit" name="login" color="primary" block>Login</ActivityButton>
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
                      <Button color="link" block onClick={() => setForgotPassword(false)}>Back to Login</Button>
                      {/* <Col>
                      <Button color="primary" block to="/signup" outline tag={Link}>Signup</Button>
                    </Col> */}
                    </Form>
                  )}
                </Formik>
              </CardBody>
            }
          </Card>
        </Container>
      }
    </>
  )
}