import * as React from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { useTranslation, Trans } from 'react-i18next';

export const SowStatusBadge = ({ status }: any) => {

  const { t, i18n } = useTranslation();

  return (
    <>
      <Badge pill color={status}>
        {t(`sow.SowStatus.${status}`)}
      </Badge>
    </>
  )
}