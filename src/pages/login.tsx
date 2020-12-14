import * as React from 'react';

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button,
  Container, FormGroup, Input, Label, FormFeedback,
  Col, Row
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';

import { actions as AuthActions, selectors as AuthSelectors } from '../store/slices/auth'
import { useDispatch, useSelector } from 'react-redux';
import {
  Link
} from "react-router-dom";


const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export const LoginPage = () => {

  const dispatch = useDispatch();
  const loginError = useSelector(AuthSelectors.getLoggedError);
  console.log('loginError: ');

  React.useEffect(() => {

    console.log('effect loginError: ', loginError);

    return () => { }

  }, [loginError])

  return (
    <Container>
      <Card className="mt-3 mt-lg-10">
        <CardBody>
          <CardTitle tag="h5" className="text-center">Login Page</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Hint: Insert User e Password</CardSubtitle>
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={LoginSchema}
            validateOnBlur={true}
            onSubmit={values => {
              console.log('in onsubmit with: ', values)
              dispatch(AuthActions.wilLoginUser({ username: values.username, password: values.password }));
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input invalid={errors.username && touched.username ? true : false} type="text" name="username" id="username" placeholder="with a placeholder" tag={Field} />
                  {errors.username && touched.username ? (
                    <FormFeedback>{errors.username}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input invalid={errors.password && touched.password ? true : false} type="password" name="password" id="password" placeholder="password placeholder" tag={Field} />
                  {errors.password && touched.password ? (
                    <FormFeedback>{errors.password}</FormFeedback>
                  ) : null}

                </FormGroup>
                <Button type="submit" color="primary" block>Login</Button>
                <Button color="primary" block to="/signup" outline tag={Link}>Signup</Button>
                <Button color="link" block>Forgot Password?</Button>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Container>
  )
}