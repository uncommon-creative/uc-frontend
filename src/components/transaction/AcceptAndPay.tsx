import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Card, CardBody, CardTitle, Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
  FormGroup, Label, Input, Jumbotron, CardSubtitle, CardText
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faKey } from '@fortawesome/free-solid-svg-icons'
import qrcode from 'qrcode-generator';
import { API, graphqlOperation } from 'aws-amplify';
import { loader } from 'graphql.macro';

import { configuration } from '../../config'
import { actions as SowActions, selectors as SowSelectors, SowCommands } from '../../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../../store/slices/chat'
import { selectors as ArbitratorSelectors } from '../../store/slices/arbitrator'
import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'
import { actions as NotificationActions } from '../../store/slices/notification'
import { selectors as ProfileSelectors } from '../../store/slices/profile'
import { actions as UIActions } from '../../store/slices/ui'
import { ActivityButton } from '../common/ActivityButton';
import { Payment } from './Payment'
import { LinkBlockExplorer } from '../common/LinkBlockExplorer'
import AlgoSignerLogo from '../../images/AlgoSigner.png'

declare var AlgoSigner: any;
const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const AcceptAndPay = ({ modal, toggle }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentSow = useSelector(SowSelectors.getCurrentSow)
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const messagesCommands = useSelector(ChatSelectors.getMessagesCommands)
  const currentChosenArbitrator = useSelector(ArbitratorSelectors.getCurrentChosenArbitrator)
  const transactionPage = useSelector(TransactionSelectors.getTransactionPage)
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const transactionAcceptAndPay = useSelector(TransactionSelectors.getTransactionAcceptAndPay)
  const transactionError = useSelector(TransactionSelectors.getError)
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [mnemonicSecretKey, setMnemonicSecretKey] = React.useState('');
  const params = useSelector(TransactionSelectors.getParams)
  const payment = useSelector(TransactionSelectors.getPayment)
  const newAttachments = useSelector(SowSelectors.getNewAttachments);
  const algoSigner = useSelector(TransactionSelectors.getAlgoSigner)

  const typeNumber: TypeNumber = 4;
  const errorCorrectionLevel: ErrorCorrectionLevel = 'L';
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.make();
  const [qrImg, SetQrImg] = React.useState(qr.createDataURL(10, 1));

  const subscribeOnAmountChecked = () => {
    const subscription = loader('../../graphql/onAmountChecked.gql')
    console.log("in onAmountChecked id: ", currentSow.sow)

    const result: any = (API.graphql(graphqlOperation(subscription, { id: currentSow.sow })) as any)
      .subscribe({
        next: ({ provider, value }: any) => {
          console.log("onAmountChecked received subscribe with ", value);

          if (value.data.onAmountChecked.status === "AMOUNT_OK") {
            console.log("onAmountChecked value success: ", value)
            dispatch(TransactionActions.willSetSowArbitrator({ sow: currentSow.sow, arbitrator: currentChosenArbitrator }))
            dispatch(TransactionActions.didCompleteTransactionAcceptAndPay({ tx: value.data, sowCommand: SowCommands.ACCEPT_AND_PAY }))
          }
          else if (value.data.onAmountChecked.status === "AMOUNT_NOT_OK") {
            console.log("onAmountChecked value fail: ", value)
            dispatch(TransactionActions.didCompleteTransactionAcceptAndPayFail("Not enough balance on the wallet."))
            dispatch(NotificationActions.willShowNotification({ message: "Not enough balance on the wallet", type: "danger" }));
          }

          dispatch(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayQR'));
          dispatch(UIActions.stopActivityRunning('willCompleteTransactionAcceptAndPayAlgoSigner'));
          dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
        }
      });
  }

  React.useEffect(() => {
    if (multiSig.address) {
      qr.addData(multiSig.address);
      qr.make();
      SetQrImg(qr.createDataURL(10, 1))
    }
  }, [multiSig])

  const [isAlgoSignInstalled, setAlgo] = React.useState(false);
  React.useEffect(() => {
    if (transactionPage[SowCommands.ACCEPT_AND_PAY] == 2) {
      if (typeof AlgoSigner !== 'undefined') {
        setAlgo(true);
      }
    }
  }, [transactionPage]);

  React.useEffect(() => {
    modal && dispatch(TransactionActions.willGetParams({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentChosenArbitrator, sowCommand: SowCommands.ACCEPT_AND_PAY }))

    return () => {
      setAcceptedConditions(false)
      setMnemonicSecretKey('')
      dispatch(TransactionActions.goToTransactionPage({ transactionPage: 0, sowCommand: SowCommands.ACCEPT_AND_PAY }))
    }
  }, [modal])

  React.useEffect(() => {
    (transactionPage[SowCommands.ACCEPT_AND_PAY] == 3/*  || transactionPage[SowCommands.ACCEPT_AND_PAY] == 5 */) && subscribeOnAmountChecked()
  }, [transactionPage])

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl" backdrop={"static"} data-cy='acceptAndPayModal' scrollable={true}>
      {transactionPage[SowCommands.ACCEPT_AND_PAY] == 0 &&
        <>
          <ModalHeader toggle={toggle}>{t(`chat.SowCommands.${SowCommands.ACCEPT_AND_PAY}`)}</ModalHeader>
          <ModalBody className="text-center">
            <Spinner /* type='grow' */ color="primary" style={{ width: '3rem', height: '3rem' }} />
          </ModalBody>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_AND_PAY] == 1 &&
        <>
          <ModalHeader toggle={toggle}>Accept the conditions</ModalHeader>
          <ModalBody>
            <Jumbotron name="conditions" id="conditions">
              <CardText name="transactionConditions">{t('transaction.conditions')}</CardText>
            </Jumbotron>
            <FormGroup check>
              <Label check>
                <Input data-cy="acceptConditions" checked={acceptedConditions} name="acceptConditions" id="acceptConditions" type="checkbox"
                  onChange={(event) => setAcceptedConditions(event.target.checked)}
                />Accept conditions *
              </Label>
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='continueTransaction' disabled={!acceptedConditions} name="continueTransaction" color="primary" onClick={() => {
              dispatch(TransactionActions.willCreateMultiSigAddress({ seller: currentSow.seller, buyer: currentSow.buyer, arbitrator: currentChosenArbitrator, price: currentSow.price, sowCommand: SowCommands.ACCEPT_AND_PAY }))
            }}>Continue</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_AND_PAY] == 2 &&
        <>
          <ModalHeader toggle={toggle}>Choose the method to sign</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are signing the quote and committing to receive the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Furthermore, you are explicitly opt-in to receive the asset <a target="_blank" href={configuration[stage].AlgoExplorer_asset_link + JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}>{JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}</a>.</CardSubtitle>
            <Payment />

            <Row>
              {/* <Col>
                  <Card outline onClick={() => {
                    dispatch(TransactionActions.willCompleteTransactionAcceptAndPayQR({ multiSigAddress: multiSig.address, total: payment.total, sow: currentSow.sow }))
                  }}>
                    <CardBody className="text-center">
                      <CardSubtitle tag="h5" className="mb-2 text-muted text-center">QR</CardSubtitle>
                      <FontAwesomeIcon icon={faQrcode} size="5x" />
                    </CardBody>
                  </Card>
                </Col> */}
              <Col>
                <Card data-cy='acceptAndPay' onClick={() => {
                  dispatch(TransactionActions.goToTransactionPage({ transactionPage: 4, sowCommand: SowCommands.ACCEPT_AND_PAY }))
                }}>
                  <CardBody className="text-center">
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">Mnemonic</CardSubtitle>
                    <FontAwesomeIcon icon={faKey} size="5x" />
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card onClick={() => {
                  isAlgoSignInstalled ? dispatch(TransactionActions.willPrepareAlgoSigner({ sowCommand: SowCommands.ACCEPT_AND_PAY }))
                    : dispatch(NotificationActions.willShowNotification({ message: "Please install AlgoSigner", type: "info" }));
                }}>
                  <CardBody className={isAlgoSignInstalled ? "text-center" : "text-center text-muted"}>
                    <CardSubtitle tag="h5" className="mb-2 text-muted text-center">AlgoSigner</CardSubtitle>
                    {!isAlgoSignInstalled && <CardSubtitle tag="h6" className="mb-2 text-muted text-center">(not installed)</CardSubtitle>}
                    <img src={AlgoSignerLogo} height="80" alt="AlgoSigner Logo" />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </>
      }
      {/* {transactionPage[SowCommands.ACCEPT_AND_PAY] == 3 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with QR</ModalHeader>
          <ModalBody>
            <Payment />

            <div style={{ textAlign: 'center' }} id="qrCode">
              <img
                key={Date.now()}
                src={qrImg}
                id="accountQR"
                style={{
                  padding: '0.5em',
                  margin: '0.5em',
                  border: '1px solid #9095AF',
                  borderRadius: '10px'
                }}
                width="250"
                height="250"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.ACCEPT_AND_PAY }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayQR' name="willCompleteTransactionAcceptAndPayQR" color="primary" onClick={async () => {
              // dispatch(TransactionActions.willCompleteTransactionAcceptAndPayQR({ multiSigAddress: multiSig.address, total: payment.total, sow: currentSow.sow }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      } */}
      {transactionPage[SowCommands.ACCEPT_AND_PAY] == 4 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with mnemonic secret key</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are signing the quote and committing to receive the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Furthermore, you are explicitly opt-in to receive the asset <a target="_blank" href={configuration[stage].AlgoExplorer_asset_link + JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}>{JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}</a>.</CardSubtitle>
            <Payment />

            <FormGroup>
              <Label for="mnemonicSecretKey">Mnemonic Secret Key *</Label>
              <Input data-cy="mnemonicSecretKey" value={mnemonicSecretKey} type="textarea" name="mnemonicSecretKey" id="mnemonicSecretKey" placeholder="mnemonicSecretKey"
                onChange={(event: any) => {
                  setMnemonicSecretKey(event.target.value)
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.ACCEPT_AND_PAY }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPay' disabled={mnemonicSecretKey == ''} name="willCompleteTransactionAcceptAndPay" color="primary" onClick={async () => {
              dispatch(TransactionActions.willCompleteTransactionAcceptAndPayMnemonic({ mnemonicSecretKey: mnemonicSecretKey, multiSigAddress: multiSig.address, params: params, currentSow: currentSow, toPay: payment.toPay, arbitrator: currentChosenArbitrator, assetId: JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId }))
            }}>Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {transactionPage[SowCommands.ACCEPT_AND_PAY] == 5 &&
        <>
          <ModalHeader toggle={toggle}>Fund the wallet with AlgoSigner</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">You are signing the quote and committing to receive the service as described in the <a target="_blank" href={newAttachments.find((file: any) => file.filename === "works_agreement.pdf").downloadUrl}>works agreement</a>.</CardSubtitle>
            <CardSubtitle tag="h6" className="py-1 text-muted text-center">Furthermore, you are explicitly opt-in to receive the asset <a target="_blank" href={configuration[stage].AlgoExplorer_asset_link + JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}>{JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId}</a>.</CardSubtitle>
            <Payment />

            <ListGroupItem className='border border-primary bg-light'>
              {algoSigner.account.address + ': ' + t('transaction.payment.algo', { value: algoSigner.account.amount / 1000000 })}
            </ListGroupItem>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy='goToTransactionPage' name="goToTransactionPage" outline color="primary" onClick={() => {
              dispatch(TransactionActions.goToTransactionPage({ transactionPage: 2, sowCommand: SowCommands.ACCEPT_AND_PAY }))
            }}>Cancel</ActivityButton>
            <ActivityButton data-cy='willCompleteTransactionAcceptAndPayAlgoSigner' name="willCompleteTransactionAcceptAndPayAlgoSigner" color="primary"
              onClick={() => {
                dispatch(TransactionActions.willCompleteTransactionAcceptAndPayAlgoSigner({ multiSigAddress: multiSig.address, params: params, currentSow: currentSow, toPay: payment.toPay, arbitrator: currentChosenArbitrator, assetId: JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId, account: algoSigner.account }))
              }}
            >Complete the transaction</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage[SowCommands.ACCEPT_AND_PAY] == 6 &&
        <>
          <ModalHeader toggle={toggle}>Wallet funded</ModalHeader>
          <ModalBody>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionCompleted')}
              </CardText>
              <CardText>
                <LinkBlockExplorer title={'Asset: ' + JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId} type="asset" id={JSON.parse(messagesCommands[SowCommands.SUBMIT].commandMessage.data).assetId} />
                {transactionAcceptAndPay.tx &&
                  <>
                    <LinkBlockExplorer title={'Opt-in transaction: ' + transactionAcceptAndPay.tx[0].substring(0, 6) + '...'} type="tx" id={transactionAcceptAndPay.tx[0]} />
                    {transactionAcceptAndPay.tx[1] && <LinkBlockExplorer title={'Payment transaction: ' + transactionAcceptAndPay.tx[1].substring(0, 6) + '...'} type="tx" id={transactionAcceptAndPay.tx[1]} />}
                  </>
                }
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton data-cy="closeAcceptAndPay" name="closeTransaction" color="primary" onClick={() => {
              dispatch(SowActions.willGetSow({ sow: currentSow.sow }))
              toggle()
            }
            }
            >Close</ActivityButton>
          </ModalFooter>
        </>
      }
      {
        transactionPage[SowCommands.ACCEPT_AND_PAY] == 7 &&
        <>
          <ModalHeader toggle={toggle}>Transaction failed</ModalHeader>
          <ModalBody>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">{multiSig.address}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted text-center">Balances: {multiSig.amount / 1000000} ALGO</CardSubtitle>
            <Jumbotron>
              <CardText>
                {t('transaction.transactionFailed', { errorMessage: transactionError })}
              </CardText>
            </Jumbotron>
          </ModalBody>
          <ModalFooter>
            <ActivityButton name="closeTransaction" color="primary" onClick={toggle}>Close</ActivityButton>
          </ModalFooter>
        </>
      }
    </Modal >
  )
}