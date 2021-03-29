import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Spinner, FormText, Row, Col, Tooltip, CardSubtitle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileWord, faFileVideo, faFilePowerpoint, faFilePdf, faFileImage, faFileCode, faFileAudio, faFileArchive, faFileAlt, faFileCsv, faFile, faFileExcel, } from '@fortawesome/free-solid-svg-icons'

import { configuration } from '../../config'
import { selectors as UISelectors } from '../../store/slices/ui'

const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"

export const FileButton = ({ file, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, file.key));
  var fileIcon = {} as any

  const [tooltipOpenMd5HashSpecsDoc, setTooltipOpenMd5HashSpecsDoc] = React.useState(false);
  const toggleMd5HashSpecsDoc = () => setTooltipOpenMd5HashSpecsDoc(!tooltipOpenMd5HashSpecsDoc);
  const [tooltipOpenMd5HashWorksAgreement, setTooltipOpenMd5HashWorksAgreement] = React.useState(false);
  const toggleMd5HashWorksAgreement = () => setTooltipOpenMd5HashWorksAgreement(!tooltipOpenMd5HashWorksAgreement);
  const [tooltipOpenBase64Md5HashWorksAgreement, setTooltipOpenBase64Md5HashWorksAgreement] = React.useState(false);
  const toggleBase64Md5HashWorksAgreement = () => setTooltipOpenBase64Md5HashWorksAgreement(!tooltipOpenBase64Md5HashWorksAgreement);

  switch (file.type) {
    case '.pdf':
      fileIcon = faFilePdf
      break;
    case '.txt':
    case '.rtf':
      fileIcon = faFileAlt
      break;
    case '.png':
    case '.jpg':
      fileIcon = faFileImage
      break;
    case '.html':
    case '.css':
    case '.ts':
    case '.tsx':
    case '.js':
    case '.json':
      fileIcon = faFileCode
      break;
    case '.mp4':
    case '.avi':
      fileIcon = faFileVideo
      break;
    case '.mp3':
      fileIcon = faFileAudio
      break;
    case '.zip':
    case '.rar':
      fileIcon = faFileArchive
      break;
    case '.csv':
      fileIcon = faFileCsv
      break;
    case '.doc':
    case '.docx':
      fileIcon = faFileWord
      break;
    case '.xls':
    case '.xlsx':
      fileIcon = faFileExcel
      break;
    case '.ppt':
    case '.pptx':
      fileIcon = faFilePowerpoint
      break;
    default:
      fileIcon = faFile
      break;
  }

  return (
    <>
      {
        isActivityRunning ? (
          <FormText color="muted">
            <Row>
              <Col className='d-flex justify-content-center'>
                <Spinner size="2x" color="primary" />
              </Col>
            </Row>
            <Row>
              <Col data-cy="attachment" className='d-flex justify-content-center'>
                {file.filename.length > 20 ?
                  file.filename.substring(0, 20) + '... ' + file.filename.substring(file.filename.length - 4, file.filename.length)
                  : file.filename}
              </Col>
            </Row >
          </FormText >
        ) : (
          <FormText color="muted">
            <a target="_blank" href={file.downloadUrl}>
              <Row>
                <Col className='d-flex justify-content-center'>
                  <FontAwesomeIcon icon={fileIcon} size='2x' />
                </Col>
              </Row>
              <Row>
                <Col data-cy="attachment" className='d-flex justify-content-center'>
                  {file.filename.length > 20 ?
                    file.filename.substring(0, 16) + '... ' + file.filename.substring(file.filename.length - 4, file.filename.length)
                    : file.filename}
                </Col>
              </Row>
              {file.owner == file.sow &&
                <>
                  {file.filename == configuration[stage].works_agreement_key &&
                    <Row className="d-flex justify-content-center">
                      <span id="FileMd5HashWorksAgreement" style={{ fontSize: 11 }}>
                        md5 hash: {file.etag.substring(0, 6) + '... '}
                      </span>
                      <Tooltip placement="bottom" isOpen={tooltipOpenMd5HashWorksAgreement} target="FileMd5HashWorksAgreement" toggle={toggleMd5HashWorksAgreement}>
                        {file.etag}
                      </Tooltip>
                      <span id="FileBase64Md5HashWorksAgreement" style={{ fontSize: 11 }}>
                        base64 md5: {Buffer.from(file.etag).toString("base64").substring(0, 6) + '... '}
                      </span>
                      <Tooltip placement="bottom" isOpen={tooltipOpenBase64Md5HashWorksAgreement} target="FileBase64Md5HashWorksAgreement" toggle={toggleBase64Md5HashWorksAgreement}>
                        {Buffer.from(file.etag).toString("base64")}
                      </Tooltip>
                    </Row>
                  }
                  {file.filename == configuration[stage].specs_document_key &&
                    <Row className="d-flex justify-content-center">
                      <span id="FileMd5HashSpecsDoc" style={{ fontSize: 11 }}>
                        md5 hash: {file.etag.substring(0, 6) + '... '}
                      </span>
                      <Tooltip placement="bottom" isOpen={tooltipOpenMd5HashSpecsDoc} target="FileMd5HashSpecsDoc" toggle={toggleMd5HashSpecsDoc}>
                        {file.etag}
                      </Tooltip>
                    </Row>
                  }
                </>
              }
            </a>
          </FormText>
        )
      }
    </>
  )
}