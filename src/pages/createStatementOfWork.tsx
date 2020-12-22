import * as React from 'react';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container,
  FormText, FormGroup, Input, Label, FormFeedback,
  Col, Row, Jumbotron, InputGroup, InputGroupButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { ActivityButton } from '../components/ActivityButton'
import { SelectArbitrators } from '../components/SelectArbitrators'
import { actions as SOWActions } from '../store/slices/sow'

var DatePicker = require("reactstrap-date-picker");

const StatementOfWorkSchema = Yup.object().shape({
  customerEmail: Yup.string()
    .email()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(14, 'Too Short!')
    .max(140, 'Too Long!')
    .required('Required'),
  quantity: Yup.number()
    .min(0, 'Too Few!')
    .max(50, 'Too Many!'),
  priceALGO: Yup.number()
    .min(1, 'Too Few!')
    .max(50, 'Too Many!')
    .required('Required'),
  priceUSDC: Yup.number()
    .min(1, 'Too Few!')
    .max(50, 'Too Many!')
    .required('Required'),
  deadline: Yup.date()
    .min(new Date().toISOString())
    .required('Required'),
  tags: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  numberReviews: Yup.number()
    .min(1, 'Too Few!')
    .max(50, 'Too Many!')
    .required('Required'),
  termsOfService: Yup.boolean()
    .oneOf([true], "The Terms of Service must be accepted.")
    .required('Required'),
  codeOfConduct: Yup.boolean()
    .oneOf([true], "The Code of Conduct must be accepted.")
    .required('Required'),
});

export const CreateStatementOfWorkPage = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [priceCurrency, setPriceCurrency] = React.useState("ALGO");
  const [deadlineValue, setDeadlineValue] = React.useState('');
  const [modal, setModal] = React.useState(false);

  const toggle = () => setModal(!modal);
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="text-center">Create Statement Of Work Page</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Create a new Statement of Work</CardSubtitle>
          <Formik
            initialValues={{
              customerEmail: '',
              title: '',
              description: '',
              quantity: '',
              priceALGO: '',
              priceUSDC: '',
              deadline: '',
              tags: '',
              numberReviews: '',
              termsOfService: false,
              codeOfConduct: false
            }}
            validationSchema={StatementOfWorkSchema}
            validateOnBlur={true}
            onSubmit={values => {
              console.log('in onsubmit with: ', values)
              dispatch(SOWActions.willCreateStatementOfWork({ termsOfService: values.termsOfService, history: history }));
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input invalid={errors.customerEmail && touched.customerEmail ? true : false} type="text" name="customerEmail" id="customerEmail" placeholder="customer email" tag={Field} />
                  {errors.customerEmail && touched.customerEmail ? (
                    <FormFeedback>{errors.customerEmail}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="givenName">Title</Label>
                  <Input invalid={errors.title && touched.title ? true : false} type="text" name="title" id="title" placeholder="title" tag={Field} />
                  {errors.title && touched.title ? (
                    <FormFeedback>{errors.title}</FormFeedback>
                  ) : null}
                </FormGroup>
                <Jumbotron>
                  <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Milestone 1</CardSubtitle>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input invalid={errors.description && touched.description ? true : false} type="text" name="description" id="description" placeholder="description" tag={Field} />
                    {errors.description && touched.description ? (
                      <FormFeedback>{errors.description}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <Row>
                    <Col className="col-md-6 col-12">
                      <FormGroup>
                        <Label for="quantity">Quantity</Label>
                        <Input invalid={errors.quantity && touched.quantity ? true : false} type="text" name="quantity" id="quantity" placeholder="quantity" tag={Field} />
                        {errors.quantity && touched.quantity ? (
                          <FormFeedback>{errors.quantity}</FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col className="col-md-6 col-12">
                      <FormGroup>
                        <Label for="priceALGO">Price</Label>
                        <InputGroup>
                          {priceCurrency == "ALGO" &&
                            <Input invalid={errors.priceALGO && touched.priceALGO ? true : false} type="text" name="priceALGO" id="priceALGO" placeholder="price ALGO" tag={Field} />
                          }
                          {priceCurrency == "USDC" &&
                            <Input invalid={errors.priceUSDC && touched.priceUSDC ? true : false} type="text" name="priceUSDC" id="priceUSDC" placeholder="price USDC" tag={Field} />
                          }
                          <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>
                            <DropdownToggle caret>
                              {priceCurrency}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem header>Select the currency</DropdownItem>
                              <DropdownItem disabled={priceCurrency == "ALGO"}
                                onClick={() => setPriceCurrency("ALGO")}
                              >
                                ALGO
                              </DropdownItem>
                              <DropdownItem disabled={priceCurrency == "USDC"}
                                onClick={() => setPriceCurrency("USDC")}
                              >
                                USDC
                              </DropdownItem>
                            </DropdownMenu>
                          </InputGroupButtonDropdown>
                          {priceCurrency == "ALGO" && errors.priceALGO && touched.priceALGO ? (
                            <FormFeedback>{errors.priceALGO}</FormFeedback>
                          ) : null}
                          {priceCurrency == "USDC" && errors.priceUSDC && touched.priceUSDC ? (
                            <FormFeedback>{errors.priceUSDC}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="deadline">Deadline</Label>
                    <DatePicker name="deadline" id="deadline"
                      invalid={errors.deadline && touched.deadline ? true : false}
                      weekStartsOn={1}
                      autoComplete={"off"}
                      showClearButton={false}
                      minDate={new Date().toISOString()}
                      value={deadlineValue}
                      onChange={(v: any, f: any) => {
                        setFieldValue("deadline", v)
                        setDeadlineValue(v)
                      }} />
                    {errors.deadline && touched.deadline ? (
                      <FormFeedback>{errors.deadline}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Label for="tags">Tags</Label>
                    <Input invalid={errors.tags && touched.tags ? true : false} type="text" name="tags" id="tags" placeholder="tags" tag={Field} />
                    {errors.tags && touched.tags ? (
                      <FormFeedback>{errors.tags}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <Row>
                    <Col className="col-md-6 col-12">
                      <FormGroup>
                        <Label for="numberReviews">Max number of reviews granted</Label>
                        <Input invalid={errors.numberReviews && touched.numberReviews ? true : false} type="text" name="numberReviews" id="numberReviews" placeholder="max number of reviews granted" tag={Field} />
                        {errors.numberReviews && touched.numberReviews ? (
                          <FormFeedback>{errors.numberReviews}</FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col className="col-md-6 col-12">
                      <FormGroup>
                        <Label for="attachments">Attachments</Label>
                        <Input type="file" name="attachments" id="attachments" />
                        <FormText color="muted">
                          Attachments
                        </FormText>
                      </FormGroup>
                    </Col>
                  </Row>
                </Jumbotron>

                <Button color="primary" onClick={toggle}>Select the arbitrators</Button>
                <SelectArbitrators modal={modal} toggle={toggle} />

                <FormGroup check>
                  <Label check>
                    <Input invalid={errors.termsOfService && touched.termsOfService ? true : false} name="termsOfService" id="termsOfService" type="checkbox"
                      onChange={(event) => setFieldValue("termsOfService", event.target.checked)}
                    />Terms of Service
                    {errors.termsOfService && touched.termsOfService ? (
                      <FormFeedback>{errors.termsOfService}</FormFeedback>
                    ) : null}
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input invalid={errors.codeOfConduct && touched.codeOfConduct ? true : false} name="codeOfConduct" id="codeOfConduct" type="checkbox"
                      onChange={(event) => setFieldValue("codeOfConduct", event.target.checked)}
                    />Code of Conduct
                    {errors.codeOfConduct && touched.codeOfConduct ? (
                      <FormFeedback>{errors.codeOfConduct}</FormFeedback>
                    ) : null}
                  </Label>
                </FormGroup>
                <Row>
                  <Col><ActivityButton type="submit" name="createSOW" color="primary" block>Create Statement Of Work</ActivityButton></Col>
                </Row>
                <Row className="mt-2">
                  <Col><Button color="primary" block to="/" outline tag={Link}>Cancel</Button></Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Container >
  )
}