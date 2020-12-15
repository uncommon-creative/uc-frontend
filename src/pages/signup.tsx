import * as React from 'react';

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row, Spinner
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';

import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { ActivityButton } from '../components/ActivityButton'

const LoginSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  surname: Yup.string()
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
  const loginError = useSelector(AuthSelectors.getLoggedError);
  let history = useHistory();

  React.useEffect(() => {

    console.log('effect loginError: ', loginError);

    return () => { }

  }, [loginError])

  return (
    <Container>
      <Card className="mt-3 mt-lg-10">
        <CardBody>
          <CardTitle tag="h5" className="text-center">Signup Page</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert Email  e Password</CardSubtitle>
          <Formik
            initialValues={{
              email: '',
              emailConfirm: '',
              name: '',
              surname: '',
              password: '',
              passwordConfirm: ''
            }}
            validationSchema={LoginSchema}
            validateOnBlur={true}
            onSubmit={values => {
              console.log('in onsubmit with: ', values)
              dispatch(AuthActions.willSignupUser({ email: values.email, password: values.password, history: history }));
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <FormGroup>
                  <Label for="username">Name</Label>
                  <Input invalid={errors.name && touched.name ? true : false} type="text" name="name" id="name" placeholder="with a placeholder" tag={Field} />
                  {errors.name && touched.name ? (
                    <FormFeedback>{errors.name}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="username">Surname</Label>
                  <Input invalid={errors.surname && touched.surname ? true : false} type="text" name="surname" id="surname" placeholder="with a placeholder" tag={Field} />
                  {errors.surname && touched.surname ? (
                    <FormFeedback>{errors.surname}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="username">Email Address</Label>
                  <Input invalid={errors.email && touched.email ? true : false} type="text" name="email" id="email" placeholder="with a placeholder" tag={Field} />
                  {errors.email && touched.email ? (
                    <FormFeedback>{errors.email}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="username">Confirm Email Address</Label>
                  <Input invalid={errors.emailConfirm && touched.emailConfirm ? true : false} type="text" name="emailConfirm" id="emailConfirm" placeholder="with a placeholder" tag={Field} />
                  {errors.emailConfirm && touched.emailConfirm ? (
                    <FormFeedback>{errors.emailConfirm}</FormFeedback>
                  ) : null}
                </FormGroup>

                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="password placeholder" tag={Field} />
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
                <Row>
                  <Col>
                    <ActivityButton name="signup" color="primary" disabled block>Signup</ActivityButton>
                  </Col>
                </Row>
                <Row>
                  <Col><Button color="link" to="/login" block tag={Link}>Already registered?</Button></Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Container>
  )
}