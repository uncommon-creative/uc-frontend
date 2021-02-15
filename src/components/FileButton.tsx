import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Spinner, FormText, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileWord, faFileVideo, faFilePowerpoint, faFilePdf, faFileImage, faFileCode, faFileAudio, faFileArchive, faFileAlt, faFileCsv, faFile, faFileExcel, } from '@fortawesome/free-solid-svg-icons'

import { selectors as UISelectors } from '../store/slices/ui'

export const FileButton = ({ file, disabled, children, ...rest }: any) => {

  const isActivityRunning = useSelector(state => UISelectors.activityRunningSelector(state, file.key));
  var fileIcon = {} as any

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
              <Col className='d-flex justify-content-center'>
                {file.filename.length > 20 ?
                  file.filename.substring(0, 20) + '... ' + file.filename.substring(file.filename.length - 4, file.filename.length)
                  : file.filename}
              </Col>
            </Row >
          </FormText >
        ) : (
            <FormText color="muted">
              <Row>
                <Col>
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
                  </a>
                </Col>
              </Row>
            </FormText>
          )
      }
    </>
  )
}