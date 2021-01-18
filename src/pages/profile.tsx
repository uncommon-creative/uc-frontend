import * as React from 'react';
import {
  Card, CardBody, CardText, CardTitle, CardSubtitle, Button,
  Container, Label,
  Col, Row, Jumbotron,
  FormGroup, FormFeedback,
  InputGroup, Input, CustomInput,
  InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { selectors as ProfileSelectors } from '../store/slices/profile'
import { ActivityButton } from '../components/ActivityButton'

const ArbitratorSettingsSchema = Yup.object().shape({
  enabled: Yup.bool()
    .required('Required'),
  fee: Yup.number()
    .min(1, 'Too Few!')
    .required('Required'),
  currency: Yup.string()
    .min(3, 'Too Short!')
    .required('Required'),
  tags: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
});

export const ProfilePage = () => {

  const dispatch = useDispatch();
  let history = useHistory();
  const myArbitratorSettings = useSelector(ArbitratorSelectors.getMyArbitratorSettings)
  const profile = useSelector(ProfileSelectors.getProfile)
  const [dropdownCurrencyOpen, setDropdownCurrencyOpen] = React.useState(false);
  const [dropdownFeeTypeOpen, setDropdownFeeTypeOpen] = React.useState(false);
  const [switchEnabled, setSwitchEnabled] = React.useState(false);
  const [feeCurrency, setFeeCurrency] = React.useState("ALGO");
  const [feeType, setFeeType] = React.useState("fixed");

  const toggleDropDownCurrency = () => setDropdownCurrencyOpen(!dropdownCurrencyOpen);
  const toggleDropDownFeeType = () => setDropdownFeeTypeOpen(!dropdownFeeTypeOpen);
  const toggleSwitchEnabled = (switchEnabled: any) => setSwitchEnabled(switchEnabled);

  React.useEffect(() => {
    dispatch(ArbitratorActions.willGetArbitrator())
  }, []);

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="text-center">Profile</CardTitle>
        </CardBody>

        <Jumbotron>
          <CardTitle tag="h6" className="text-center">Arbitrator Settings</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Change your arbitrator settings</CardSubtitle>

          <Formik
            enableReinitialize={true}
            initialValues={{
              enabled: switchEnabled,
              fee: myArbitratorSettings && myArbitratorSettings.fee ? myArbitratorSettings.fee.value : '',
              feeType: feeType,
              currency: feeCurrency,
              tags: myArbitratorSettings && myArbitratorSettings.tags ? myArbitratorSettings.tags.join(' ') : ''
            }}
            validationSchema={ArbitratorSettingsSchema}
            validateOnBlur={true}
            onSubmit={values => {
              console.log('in onsubmit with: ', values)
              dispatch(ArbitratorActions.willSaveArbitratorSettings({ arbitratorSettings: values, history: history }));
            }}
          >
            {({ errors, touched, setFieldValue, values }) => {
              return (
                <Form>
                  <Row>
                    <Col className="col-md-4 col-12 offset-2">
                      <FormGroup>
                        <Label for="enabled">Enabled</Label>
                        <CustomInput type="switch" name="enabled" id="enabled" tag={Field}
                          onClick={(event: any) => {
                            toggleSwitchEnabled(event.target.checked)
                            setFieldValue('enabled', event.target.checked)
                          }}
                        />

                      </FormGroup>
                    </Col>
                    <Col className="col-md-6 col-12 ">
                      <FormGroup>
                        <Label for="fee">Fee</Label>
                        <InputGroup>
                          <InputGroupButtonDropdown disabled={!switchEnabled} addonType="prepend" isOpen={dropdownFeeTypeOpen} toggle={toggleDropDownFeeType}>
                            <DropdownToggle caret>
                              {feeType}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem header>Select the fee type</DropdownItem>
                              <DropdownItem disabled={feeType == "fixed"}
                                onClick={() => {
                                  setFieldValue('feeType', "fixed")
                                  setFeeType("fixed")
                                }}
                              >
                                FIXED
                              </DropdownItem>
                              <DropdownItem disabled={feeType == "percentage"}
                                onClick={() => {
                                  setFieldValue('feeType', "percentage")
                                  setFeeType("percentage")
                                }}
                              >
                                PERCENTAGE
                              </DropdownItem>
                            </DropdownMenu>
                          </InputGroupButtonDropdown>

                          <Input disabled={!switchEnabled} invalid={errors.fee && touched.fee ? true : false} type="text" name="fee" id="fee" placeholder={"fee"} tag={Field} />

                          <InputGroupButtonDropdown disabled={!switchEnabled} addonType="append" isOpen={dropdownCurrencyOpen} toggle={toggleDropDownCurrency}>
                            <DropdownToggle caret>
                              {feeCurrency}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem header>Select the currency</DropdownItem>
                              <DropdownItem disabled={feeCurrency == "ALGO"}
                                onClick={() => {
                                  setFieldValue('currency', "ALGO")
                                  setFeeCurrency("ALGO")
                                }}
                              >
                                ALGO
                              </DropdownItem>
                              <DropdownItem disabled={feeCurrency == "USDC"}
                                onClick={() => {
                                  setFieldValue('currency', "USDC")
                                  setFeeCurrency("USDC")
                                }}
                              >
                                USDC
                              </DropdownItem>
                            </DropdownMenu>
                          </InputGroupButtonDropdown>
                          {errors.fee && touched.fee ? (
                            <FormFeedback>{errors.fee}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="tags">Tags</Label>
                    <Input disabled={!switchEnabled} invalid={errors.tags && touched.tags ? true : false} type="text" name="tags" id="tags" placeholder="tags" tag={Field} />
                    {errors.tags && touched.tags ? (
                      <FormFeedback>{errors.tags}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <Row>
                    <Col><ActivityButton type="submit" name="saveArbitratorSettings" color="primary" block>Save arbitrator settings</ActivityButton></Col>
                  </Row>
                </Form>
              )
            }}
          </Formik>
        </Jumbotron>
      </Card>
    </Container>
  )
}