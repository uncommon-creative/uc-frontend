import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Jumbotron, Container, Button, FormGroup, Input, Label, FormFeedback, Col, Row, CardTitle, CardSubtitle } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';

import { ActivityButton } from '../components/common/ActivityButton'
import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { selectors as UISelectors, actions as UIActions } from '../store/slices/ui'

const ConfirmSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

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

export const SignupConfirmPage = () => {

  let { code }: any = useParams();
  let username = localStorage.getItem('username')
  let emailConfirm = localStorage.getItem('emailConfirm')
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isLoading = useSelector(UISelectors.isLoading)
  let history = useHistory();

  React.useEffect(() => {
    console.log('SignupConfirmPage with code: ', code);
    console.log('SignupConfirmPage with username: ', username);
    console.log('SignupConfirmPage with emailConfirmLS: ', emailConfirm);

    code && username && emailConfirm == "SIGNUP_USER" &&
      dispatch(AuthActions.willConfirmUser({ username: username, code: code, history: history }));

    if (emailConfirm == "RESEND_SIGNUP_USER") {
      dispatch(AuthActions.willResendSignup({ email: username, history: history }))
      // dispatch(UIActions.stopLoading())
    }

    return () => { }
  }, [])

  return (
    <>
      {!isLoading &&
        <Container className="mt-3 mt-lg-10">
          {emailConfirm == "PASSWORD_RESET" ?
            <Jumbotron>
              <CardTitle tag="h5" className="text-center">Reset Password Page</CardTitle>
              {code ?
                <>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert Email and Password</CardSubtitle>
                  <Formik
                    initialValues={{
                      email: username ? username : '',
                      code: code,
                      password: '',
                      passwordConfirm: ''
                    }}
                    validationSchema={ForgotPasswordSchema}
                    validateOnBlur={true}
                    onSubmit={values => {
                      console.log('in onsubmit with: ', values)
                      dispatch(AuthActions.willForgotPasswordConfirm({ email: values.email, code: values.code, password: values.password, history: history }))
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
                        {!code && <FormGroup>
                          <Label for="code">Code</Label>
                          <Input invalid={errors.code && touched.code ? true : false} type="text" name="code" id="code" placeholder="code" tag={Field} />
                          {errors.code && touched.code ? (
                            <FormFeedback>{errors.code}</FormFeedback>
                          ) : null}
                        </FormGroup>}
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
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </>
                :
                <Container fluid className="text-center">
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Check Email for reset password</CardSubtitle>
                </Container>
              }
            </Jumbotron>
            : //emailConfirm == "SIGNUP_USER" ?
            <Jumbotron fluid>
              <CardTitle tag="h5" className="text-center">Confirm Signup Page</CardTitle>
              {!code &&
                <Container fluid className="text-center">
                  <CardSubtitle tag="h2" className="mb-2 text-center">Account Created</CardSubtitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Check Email for account confirmation</CardSubtitle>
                </Container>
              }
              {code && username &&
                <Container fluid className="text-center">
                  <CardSubtitle tag="h2" className="mb-2 text-center">Account Confirming</CardSubtitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">
                    You will be redirected to
                <Button color="link" to="/login" block tag={Link}>Login</Button>
                  </CardSubtitle>
                </Container>
              }
              {code && !username &&
                <Container fluid className="text-center">
                  <CardSubtitle tag="h2" className="mb-2 text-center">Account Confirming</CardSubtitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Insert your username/email to confirm</CardSubtitle>
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
                        <Row className="mt-2">
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
          }

        </Container>
      }
    </>
  )
}