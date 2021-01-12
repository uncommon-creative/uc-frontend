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
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { ActivityButton } from '../components/ActivityButton'
import { SelectArbitrators } from '../components/SelectArbitrators'
import { ArbitratorDetail } from '../components/ArbitratorDetail'
import { ArbitratorSummary } from '../components/ArbitratorSummary'
import { DescriptionEditor } from '../components/DescriptionEditor'
import { actions as SOWActions, selectors as SOWSelectors } from '../store/slices/sow'

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
  price: Yup.number()
    .min(1, 'Too Few!')
    .required('Required'),
  currency: Yup.string()
    .min(3, 'Too Short!')
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
  arbitrators: Yup.array()
    .of(Yup.object().shape({
      id: Yup.number()
        .required('Required'),
      name: Yup.string()
        .required('Required'),
      tags: Yup.string()
        .required('Required'),
      reputation: Yup.number()
        .required('Required'),
      linkedin: Yup.string()
        .required('Required')
    }))
    .length(3, 'Three arbitrators required!')
    .required('Required')
});

export const CreateStatementOfWorkPage = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [priceCurrency, setPriceCurrency] = React.useState("ALGO");
  const [deadlineValue, setDeadlineValue] = React.useState('');
  const confirmedArbitrators = useSelector(SOWSelectors.getArbitrators)

  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
  const toggleModal = () => setModalOpen(!modalOpen);

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
              price: '',
              currency: priceCurrency,
              deadline: '',
              tags: '',
              numberReviews: '',
              termsOfService: false,
              codeOfConduct: false,
              arbitrators: confirmedArbitrators
            }}
            validationSchema={StatementOfWorkSchema}
            validateOnBlur={true}
            onSubmit={values => {
              console.log('in onsubmit with: ', values)
              dispatch(SOWActions.willCreateStatementOfWork({ sow: values, history: history }));
            }}
          >
            {({ errors, touched, setFieldValue, values }) => {
              return (
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
                      <DescriptionEditor />
                      <Input hidden value={values.description} name={"description"} tag={Field} />
                      {errors.description && touched.description ? (
                        <FormFeedback className="d-block">{errors.description}</FormFeedback>
                      ) : null}
                    </FormGroup>
                    <Row>
                      <Col className="col-md-4 col-12">
                        <FormGroup>
                          <Label for="quantity">Quantity</Label>
                          <Input invalid={errors.quantity && touched.quantity ? true : false} type="text" name="quantity" id="quantity" placeholder="quantity" tag={Field} />
                          {errors.quantity && touched.quantity ? (
                            <FormFeedback>{errors.quantity}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col className="col-md-4 col-12">
                        <FormGroup>
                          <Label for="price">Price</Label>
                          <InputGroup>
                            <Input invalid={errors.price && touched.price ? true : false} type="text" name="price" id="price" placeholder="price" tag={Field} />
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
                            {errors.price && touched.price ? (
                              <FormFeedback>{errors.price}</FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col className="col-md-4 col-12">
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
                      </Col>
                    </Row>
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

                  <Jumbotron>
                    <FormGroup>
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Arbitrators</CardSubtitle>
                      <Row name="arbitrators" id="arbitrators">
                        {confirmedArbitrators.map((arbitrator: any, index: any) => {
                          var length = Object.keys(arbitrator).length
                          return (
                            <Col>
                              <Card>
                                <ArbitratorDetail arbitrator={arbitrator} />
                              </Card>
                            </Col>
                          )
                        }
                        )}
                      </Row>
                      <Row className="mt-2">
                        <Col className="col-6 offset-3">
                          <Button color="primary" block onClick={toggleModal}>Select the arbitrators</Button>
                        </Col>
                      </Row>
                      <SelectArbitrators modal={modalOpen} toggle={toggleModal} />
                      <Input invalid={errors.arbitrators && touched.arbitrators ? true : false} name="arbitrators" id="arbitrators" placeholder="arbitrators" tag={FieldArray}
                        render={(arrayHelpers: any) => {
                          const arbs = values.arbitrators;
                          return (
                            <>
                              {arbs && arbs.length > 0 ?
                                arbs.map((arb: any, index: any) => {
                                  return (
                                    <>
                                      <Input hidden value={arbs[index].id} name={`arbitrators.${index}.id`} tag={Field} />
                                      <Input hidden value={arbs[index].name} name={`arbitrators.${index}.name`} tag={Field} />
                                      <Input hidden value={arbs[index].tags} name={`arbitrators.${index}.tags`} tag={Field} />
                                      <Input hidden value={arbs[index].reputation} name={`arbitrators.${index}.reputation`} tag={Field} />
                                      <Input hidden value={arbs[index].linkedin} name={`arbitrators.${index}.linkedin`} tag={Field} />
                                    </>
                                  )
                                })
                                : null
                              }
                            </>
                          )
                        }}
                      />
                      {errors.arbitrators && touched.arbitrators ? (
                        <FormFeedback className="d-block">Three arbitrators required</FormFeedback>
                      ) : null}
                      {errors.arbitrators && console.log("errors: ", errors)}
                      {errors.arbitrators && console.log("touched: ", touched)}
                      {errors.arbitrators && console.log("values: ", values)}
                    </FormGroup>
                  </Jumbotron>

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
              )
            }}
          </Formik>
        </CardBody>
      </Card>
    </Container >
  )
}