import * as React from 'react';
import {
  Card, CardBody, CardText, CardTitle, CardSubtitle, Button,
  Container, Label, Spinner,
  Col, Row, Jumbotron,
  FormGroup, FormFeedback, FormText,
  InputGroup, Input, CustomInput,
  InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, Redirect } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { configuration } from '../config'
import { actions as ProfileActions, selectors as ProfileSelectors } from '../store/slices/profile'
import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { ActivityButton } from '../components/common/ActivityButton'
import { TagsInput } from '../components/TagsInput';
import Portrait from '../images/Portrait.png'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

const ProfileSchema = Yup.object().shape({
  bio: Yup.string()
    .min(3, 'Too Short!')
    .required('Required'),
  address: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  addressCity: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  addressState: Yup.string()
    .min(1, 'Too Short!')
    .required('Required'),
  addressZip: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  addressCountry: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  enabled: Yup.bool()
    .required('Required'),
  feePercentage: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .required('Required')
    }),
  feeFlat: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .required('Required')
    }),
  currency: Yup.string()
    .min(3, 'Too Short!')
    .required('Required'),
  tags: Yup.array()
    .when("enabled", {
      is: true,
      then: Yup.array()
        .min(1, 'At least one tag required!')
        .required('Required')
    }),
});

export const ProfilePage = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const loadingProfile = useSelector(ProfileSelectors.isLoadingProfile)
  const uploadingPortrait = useSelector(ProfileSelectors.isUploadingPortrait)
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const myArbitratorSettings = useSelector(ArbitratorSelectors.getMyArbitratorSettings)
  const user = useSelector(AuthSelectors.getUser)
  const [profileBio, setProfileBio] = React.useState(userAttributes.bio);
  const [profileAddress, setProfileAddress] = React.useState(userAttributes.address ? userAttributes.address.address : '');
  const [profileAddressCity, setProfileAddressCity] = React.useState(userAttributes.address ? userAttributes.address.city : '');
  const [profileAddressState, setProfileAddressState] = React.useState(userAttributes.address ? userAttributes.address.state : '');
  const [profileAddressZip, setProfileAddressZip] = React.useState(userAttributes.address ? userAttributes.address.zip : '');
  const [profileAddressCountry, setProfileAddressCountry] = React.useState(userAttributes.address ? userAttributes.address.country : '');
  const [dropdownCurrencyOpen, setDropdownCurrencyOpen] = React.useState(false);
  const [switchEnabled, setSwitchEnabled] = React.useState(myArbitratorSettings ? myArbitratorSettings.enabled : false);
  const [feeCurrency, setFeeCurrency] = React.useState("ALGO");

  const toggleDropDownCurrency = () => setDropdownCurrencyOpen(!dropdownCurrencyOpen);
  const toggleSwitchEnabled = (switchEnabled: any) => setSwitchEnabled(switchEnabled);
  const addDefaultSrc = (ev: any) => { ev.target.src = Portrait }

  return (
    <>
      {loadingProfile ?
        <Container style={{ position: "relative", top: 150, bottom: '50%', left: '50%', right: '50%', height: '100%', zIndex: 10 }}>
          <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
        </Container>
        :
        <Container>
          <Card>
            <Formik
              enableReinitialize={true}
              initialValues={{
                bio: profileBio ? profileBio : '',
                address: profileAddress ? profileAddress : '',
                addressCity: profileAddressCity ? profileAddressCity : '',
                addressState: profileAddressState ? profileAddressState : '',
                addressZip: profileAddressZip ? profileAddressZip : '',
                addressCountry: profileAddressCountry ? profileAddressCountry : '',
                enabled: myArbitratorSettings && myArbitratorSettings.hasOwnProperty('enabled') ? myArbitratorSettings.enabled : switchEnabled,
                feePercentage: myArbitratorSettings && myArbitratorSettings.fee ? myArbitratorSettings.fee.perc : '',
                feeFlat: myArbitratorSettings && myArbitratorSettings.fee ? myArbitratorSettings.fee.flat : '',
                currency: feeCurrency,
                tags: myArbitratorSettings && myArbitratorSettings.tags && myArbitratorSettings.tags.length ? myArbitratorSettings.tags.map((tag: any) => JSON.parse(tag)) : []
              }}
              validationSchema={ProfileSchema}
              validateOnBlur={true}
              onSubmit={values => {
                console.log('in onsubmit with: ', values)
                dispatch(ProfileActions.willSubmitProfile(values));
                // dispatch(ArbitratorActions.willSaveArbitratorSettings({ arbitratorSettings: values, history: history }));
              }}
            >
              {({ errors, touched, setFieldValue, values }) => {
                return (
                  <Form><CardBody>
                    {/* <CardTitle tag="h5" className="text-center">Profile</CardTitle> */}
                    <Row className="d-flex align-items-end">
                      <Col className="col-3 text-center">
                        <FormGroup>
                          <Label for="portrait">
                            {uploadingPortrait ?
                              <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
                              :
                              <img height="80" alt="Portrait" onError={addDefaultSrc}
                                src={`${configuration[stage].host}/resources/${user.username}/portrait?${Date.now()}`}
                              />
                            }
                          </Label>
                          <Input type="file" name="file" id="portrait" style={{ display: "none" }} accept="image/*"
                            onChange={(event: any) => {
                              console.log("event.target.files: ", event.target.files)
                              if (event.target.files.length) {
                                dispatch(ProfileActions.willUploadPortrait({ user: user.username, portrait: event.target.files[0] }))
                              }
                            }}
                          />
                          <CardText tag="h5">
                            {userAttributes.given_name + ' ' + userAttributes.family_name}
                          </CardText>
                        </FormGroup>
                      </Col>
                      <Col className="col-9">
                        <FormGroup>
                          <Label for="profileBio">Bio *</Label>
                          <Input className="h-100" data-cy="profileBio" value={profileBio} invalid={errors.bio && touched.bio ? true : false} type="textarea" name="profileBio" id="profileBio" placeholder="bio"
                            onChange={(event: any) => {
                              setProfileBio(event.target.value)
                              setFieldValue('bio', event.target.value)
                            }}
                          />
                          {errors.bio && touched.bio ? (
                            <FormFeedback>{errors.bio}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <FormGroup>
                              <Label for="profileAddress">Address *</Label>
                              <Input data-cy="profileAddress" value={profileAddress} invalid={errors.address && touched.address ? true : false} type="text" name="profileAddress" id="profileAddress" placeholder="address"
                                onChange={(event: any) => {
                                  setProfileAddress(event.target.value)
                                  setFieldValue('address', event.target.value)
                                }}
                              />
                              {errors.address && touched.address ? (
                                <FormFeedback>{errors.address}</FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-md-4 col-12">
                            <FormGroup>
                              <Label for="profileAddressCity">City *</Label>
                              <Input data-cy="profileAddressCity" value={profileAddressCity} invalid={errors.addressCity && touched.addressCity ? true : false} type="text" name="profileAddressCity" id="profileAddressCity" placeholder="city"
                                onChange={(event: any) => {
                                  setProfileAddressCity(event.target.value)
                                  setFieldValue('addressCity', event.target.value)
                                }}
                              />
                              {errors.addressCity && touched.addressCity ? (
                                <FormFeedback>{errors.addressCity}</FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col className="col-md-2 col-12">
                            <FormGroup>
                              <Label for="profileAddressZip">Zip code *</Label>
                              <Input data-cy="profileAddressZip" value={profileAddressZip} invalid={errors.addressZip && touched.addressZip ? true : false} type="text" name="profileAddressZip" id="profileAddressZip" placeholder="zip"
                                onChange={(event: any) => {
                                  setProfileAddressZip(event.target.value)
                                  setFieldValue('addressZip', event.target.value)
                                }}
                              />
                              {errors.addressZip && touched.addressZip ? (
                                <FormFeedback>{errors.addressZip}</FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col className="col-md-2 col-12">
                            <FormGroup>
                              <Label for="profileAddressState">State/province *</Label>
                              <Input data-cy="profileAddressState" value={profileAddressState} invalid={errors.addressState && touched.addressState ? true : false} type="text" name="profileAddressState" id="profileAddressState" placeholder="state"
                                onChange={(event: any) => {
                                  setProfileAddressState(event.target.value)
                                  setFieldValue('addressState', event.target.value)
                                }}
                              />
                              {errors.addressState && touched.addressState ? (
                                <FormFeedback>{errors.addressState}</FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col className="col-md-4 col-12">
                            <FormGroup>
                              <Label for="profileAddressCountry">Country *</Label>
                              <Input data-cy="profileAddressCountry" value={profileAddressCountry} invalid={errors.addressCountry && touched.addressCountry ? true : false} type="text" name="profileAddressCountry" id="profileAddressCountry" placeholder="country"
                                onChange={(event: any) => {
                                  setProfileAddressCountry(event.target.value)
                                  setFieldValue('addressCountry', event.target.value)
                                }}
                              />
                              {errors.addressCountry && touched.addressCountry ? (
                                <FormFeedback>{errors.addressCountry}</FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                    <Jumbotron>
                      <CardTitle tag="h6" className="text-center">Arbitrator Settings</CardTitle>
                      <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Change your arbitrator settings</CardSubtitle>

                      {values && console.log("values: ", values)}
                      <Row>
                        <Col className="col-md-2 col-12">
                          <FormGroup>
                            <Label for="enabled">Enabled</Label>
                            <CustomInput data-cy='arbitratorSettingsEnabled' type="switch" name="enabled" id="enabled" tag={Field}
                              checked={values.enabled}
                              onClick={(event: any) => {
                                toggleSwitchEnabled(event.target.checked)
                                setFieldValue('enabled', event.target.checked)
                              }}
                            />

                          </FormGroup>
                        </Col>
                        <Col className="col-md-7 col-12 ">
                          <FormGroup>
                            <Label for="feeFlat">Fee flat</Label>
                            <InputGroup>
                              <Input data-cy='arbitratorSettingsFeeFlat' disabled={!switchEnabled} invalid={errors.feeFlat && touched.feeFlat ? true : false} type="text" name="feeFlat" id="feeFlat" placeholder={"fee flat"} tag={Field} />

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
                              {errors.feeFlat && touched.feeFlat ? (
                                <FormFeedback>{errors.feeFlat}</FormFeedback>
                              ) : null}
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col className="col-md-3 col-12 ">
                          <FormGroup>
                            <Label for="feePercentage">Fee percentage</Label>
                            <InputGroup>
                              <Input data-cy='arbitratorSettingsFeePercentage' disabled={!switchEnabled} invalid={errors.feePercentage && touched.feePercentage ? true : false} type="text" name="feePercentage" id="feePercentage" placeholder={"fee percentage"} tag={Field} />
                              {errors.feePercentage && touched.feePercentage ? (
                                <FormFeedback>{errors.feePercentage}</FormFeedback>
                              ) : null}
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup data-cy='arbitratorSettingsTags'>
                        <Label for="tags">Tags</Label>
                        <TagsInput disabled={!switchEnabled} tags={myArbitratorSettings && myArbitratorSettings.tags ? myArbitratorSettings.tags : []} />
                        {errors.tags && touched.tags ? (
                          <FormFeedback className="d-block">{errors.tags}</FormFeedback>
                        ) : null}
                      </FormGroup>
                      {/* <Row>
                        <Col>
                          <ActivityButton data-cy='arbitratorSettingsSubmit' type="submit" name="saveArbitratorSettings" color="primary" block>Save arbitrator settings</ActivityButton>
                        </Col>
                      </Row> */}
                    </Jumbotron>
                    <ActivityButton data-cy='submitProfile' type="submit" name="submitProfile" color="primary" block>Submit profile</ActivityButton>
                  </Form>
                )
              }}
            </Formik>
          </Card>
        </Container>
      }
    </>
  )
}