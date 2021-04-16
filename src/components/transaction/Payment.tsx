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
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.balances')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.balancesAlgo / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{"A2) Current balance of escrow account:"}</CardSubtitle>
        </Col>
        <Col>
          {payment.balancesAssetCurrency == -1 ?
            <CardSubtitle tag="h6" className="my-1">Opt-in on asset {currentSow.currency} required</CardSubtitle>
            : <CardSubtitle tag="h6" className="my-1">{payment.balancesAssetCurrency / 1000000} {currentSow.currency}</CardSubtitle>
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.price')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{payment.price / 1000000} {currentSow.currency}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.fee')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.fee / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.total')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.totalAlgo / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      {currentSow.currency != "ALGO" &&
        <Row>
          <Col>
            <CardSubtitle tag="h6" className="my-1">Total {currentSow.currency} (B+C):</CardSubtitle>
          </Col>
          <Col>
            <CardSubtitle tag="h6" className="my-1">{payment.totalAssetCurrency / 1000000 } {currentSow.currency}</CardSubtitle>
          </Col>
        </Row>
      }
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.total')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.toPayAlgo / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      {currentSow.currency != "ALGO" &&
        <Row>
          <Col>
            <CardSubtitle tag="h6" className="my-1">To pay {currentSow.currency} (B+C-A):</CardSubtitle>
          </Col>
          <Col>
            <CardSubtitle tag="h6" className="my-1">{payment.toPayAssetCurrency / 1000000 } {currentSow.currency}</CardSubtitle>
          </Col>
        </Row>
      }
    </>
  )
}