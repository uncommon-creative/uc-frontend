import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row, Col, Card, Table, Badge
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useTable, useFlexLayout } from 'react-table';
import { Link, useHistory } from "react-router-dom";

import { selectors as ProfileSelectors } from '../store/slices/profile'
import { selectors as SowSelectors } from '../store/slices/sow'
import { actions as ChatActions, selectors as ChatSelectors } from '../store/slices/chat'
import { selectors as AuthSelectors } from '../store/slices/auth'
import { actions as SowActions } from "../store/slices/sow";

function validateEmail(email: any) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const getColumnWidth = (rows: any, accessor: any, headerText: any) => {
  const maxWidth = 239
  const magicSpacing = 10
  const cellLength = Math.max(
    ...rows.map(row => (`${row[accessor]}` || '').length),
    headerText.length,
  )
  return Math.max(maxWidth, cellLength * magicSpacing)
}

export const TableSows = ({ tabId, data }: any) => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let history = useHistory();
  const users = useSelector(ProfileSelectors.getUsers)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: (row: any) =>
          <Row className="d-flex" tag={Link} onClick={() => dispatch(SowActions.willSelectSow({ sow: row, history: history }))}>
            <Col className="col-1">
              {tabId == 1 && <Badge data-cy='unreadMessagesSowSeller' pill color={row.messagesToReadSeller == 0 ? "secondary" : "primary"}>{row.messagesToReadSeller}</Badge>}
              {tabId == 2 && <Badge data-cy='unreadMessagesSowBuyer' pill color={row.messagesToReadBuyer == 0 ? "secondary" : "primary"}>{row.messagesToReadBuyer}</Badge>}
              {tabId == 3 && <Badge data-cy='unreadMessagesSowArbitrator' pill color={row.messagesToReadArbitrator == 0 ? "secondary" : "primary"}>{row.messagesToReadArbitrator}</Badge>}
            </Col>
            <Col className={((tabId == 1 && row.messagesToReadSeller != 0) || (tabId == 2 && row.messagesToReadBuyer != 0) || (tabId == 3 && row.messagesToReadArbitrator != 0)) ? "col-10 font-weight-bold" : "col-10"}>
              {row.title}
            </Col>
          </Row>,
        width: getColumnWidth(data, 'accessor', 'Status'),
      },
      {
        Header: 'Customer',
        accessor: 'buyer',
        Cell: ({ value }: any) => (
          value ?
            value === 'not_set' ?
              '-'
              :
              validateEmail(value) ?
                value
                :
                users[value] ? users[value].given_name + ' ' + users[value].family_name : '-'
            : '-'
        )
      },
      {
        Header: 'Freelance',
        accessor: 'seller',
        Cell: ({ value }: any) => (
          value ?
            value === 'not_set' ?
              '-'
              :
              validateEmail(value) ?
                value
                :
                users[value] ? users[value].given_name + ' ' + users[value].family_name : '-'
            : '-'
        )
      },
      {
        Header: 'Deadline',
        accessor: 'deadline',
        Cell: ({ value }: any) => value ? new Date(value).toLocaleDateString() : '-'
      },
      {
        Header: 'Price',
        accessor: (row: any) => row.price ? row.price + ' ' + row.currency : '-'
      },
      {
        Header: 'Created at',
        accessor: 'createdAt',
        Cell: ({ value }: any) => value ? new Date(value).toLocaleDateString() : '-'
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: getColumnWidth(data, 'accessor', 'Status'),
      },
    ],
    [users]
  )
  const tableInstance = useTable({ columns, data: data }, useFlexLayout)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  React.useEffect(() => {

    return () => { }
  }, []);

  return (
    <Row>
      <Col sm="12">
        <Table striped borderless responsive>
          {/* apply the table props */}
          <table {...getTableProps()}>
            <thead>
              {// Loop over the header rows
                headerGroups.map((headerGroup: any) => (
                  // Apply the header row props
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {// Loop over the headers in each row
                      headerGroup.headers.map((column: any) => {
                        // console.log("column: ", column)
                        // Apply the header cell props
                        if ((tabId == 1 && column.Header != 'Freelance') || (tabId == 2 && column.Header != 'Customer') || (tabId == 3)) {
                          return (
                            <th {...column.getHeaderProps()}>
                              {// Render the header
                                column.render('Header')
                              }
                            </th>
                          )
                        }
                      })
                    }
                  </tr>
                ))}
            </thead>
            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>
              {// Loop over the table rows
                rows.map((row: any) => {
                  // Prepare the row for display
                  prepareRow(row)
                  return (
                    // Apply the row props
                    <tr {...row.getRowProps()}>
                      {// Loop over the rows cells
                        row.cells.map((cell: any) => {
                          // console.log("cell: ", cell)
                          // Apply the cell props
                          if ((tabId == 1 && cell.column.Header != 'Freelance') || (tabId == 2 && cell.column.Header != 'Customer') || (tabId == 3)) {
                            return (
                              <td {...cell.getCellProps()}>
                                {// Render the cell contents
                                  cell.render('Cell')
                                }
                              </td>
                            )
                          }
                        })
                      }
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </Table>
      </Col>
    </Row >
  )
}