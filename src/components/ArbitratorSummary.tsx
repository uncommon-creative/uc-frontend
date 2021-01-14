import { ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

export const ArbitratorSummary = ({ arbitrator }: any) => {
  return (
    <>
      <ListGroupItemHeading>{arbitrator.name}</ListGroupItemHeading>
    </>
  )
}