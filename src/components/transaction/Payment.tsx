import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, CardSubtitle
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { actions as TransactionActions, selectors as TransactionSelectors } from '../../store/slices/transaction'

export const Payment = ({ modal, toggle }: any) => {

  const { t, i18n } = useTranslation();
  const multiSig = useSelector(TransactionSelectors.getMultiSig)
  const payment = useSelector(TransactionSelectors.getPayment)

  return (
    <>
      <CardSubtitle tag="h5" className="my-1 text-muted text-center">{t('transaction.payment.summary')}</CardSubtitle>
      <CardSubtitle tag="h6" className="my-1 text-muted text-center">{t('transaction.payment.multisigAddress', { multisigAddress: multiSig.address })}</CardSubtitle>

      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.balances')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.balances / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.price')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.price / 1000000 })}</CardSubtitle>
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
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.total / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.toPay')}</CardSubtitle>
        </Col>
        <Col>
          <CardSubtitle tag="h6" className="my-1">{t('transaction.payment.algo', { value: payment.toPay / 1000000 })}</CardSubtitle>
        </Col>
      </Row>
    </>
  )
}