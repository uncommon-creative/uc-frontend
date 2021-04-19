import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, CardSubtitle
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { selectors as TransactionSelectors } from '../../store/slices/transaction'
import { selectors as SowSelectors } from '../../store/slices/sow'

export const Payment = () => {

  const { t, i18n } = useTranslation();
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const payment = useSelector(TransactionSelectors.getPayment)
  const currentSow = useSelector(SowSelectors.getCurrentSow)

  return (
    <>
      <CardSubtitle tag="h5" className="my-1 text-muted text-center">{t('transaction.payment.summary')}</CardSubtitle>
      <CardSubtitle tag="h6" className="my-1 text-muted text-center">{t('transaction.payment.multisigAddress', { multisigAddress: multiSig.address })}</CardSubtitle>

      <Row>
        <Col className="col-7 d-flex justify-content-end">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.balancesAlgo')}</CardSubtitle>
        </Col>
        <Col className="col-auto">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.balancesAlgo, currency: "ALGO" })}</CardSubtitle>
        </Col>
      </Row>
      {payment.currency != "ALGO" &&
        <Row>
          <Col className="col-7 d-flex justify-content-end">
            <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.balancesAssetCurrency', { assetName: payment.currency })}</CardSubtitle>
          </Col>
          <Col className="col-auto">
            {payment.balancesAssetCurrency == -1 ?
              <CardSubtitle tag="h6" className="my-1">0 (opt-in on asset {currentSow.currency} required)</CardSubtitle>
              : <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.balancesAssetCurrency, currency: payment.currency })}</CardSubtitle>
            }
          </Col>
        </Row>
      }
      <Row>
        <Col className="col-7 d-flex justify-content-end">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.price')}</CardSubtitle>
        </Col>
        <Col className="col-auto">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.price, currency: payment.currency })}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col className="col-7 d-flex justify-content-end">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.feeAlgo')}</CardSubtitle>
        </Col>
        <Col className="col-auto">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.feeAlgo, currency: "ALGO" })}</CardSubtitle>
        </Col>
      </Row>
      {payment.currency != "ALGO" &&
        <Row>
          <Col className="col-7 d-flex justify-content-end">
            <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.feeAssetCurrency', { assetName: payment.currency })}</CardSubtitle>
          </Col>
          <Col className="col-auto">
            <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.feeAssetCurrency, currency: payment.currency })}</CardSubtitle>
          </Col>
        </Row>
      }
      <Row>
        <Col className="col-7 d-flex justify-content-end">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.toPayAlgo')}</CardSubtitle>
        </Col>
        <Col className="col-auto">
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.toPayAlgo, currency: "ALGO" })}</CardSubtitle>
        </Col>
      </Row>
      {payment.currency != "ALGO" &&
        <Row>
          <Col className="col-7 d-flex justify-content-end">
            <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.toPayAssetCurrency', { assetName: payment.currency })}</CardSubtitle>
          </Col>
          <Col className="col-auto">
            <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.currency', { value: payment.toPayAssetCurrency, currency: payment.currency })}</CardSubtitle>
          </Col>
        </Row>
      }
    </>
  )
}