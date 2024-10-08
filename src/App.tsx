import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import './App.css'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { useState } from 'react';

const greenApiEndpoint = 'https://api.green-api.com';

function App() {
  const [result, setResult] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [apiTokenInstance, setapiTokenInstance] = useState('');
  const [messageChatId, setMessageChatId] = useState('');
  const [message, setMessage] = useState('');
  const [fileChatId, setFileChatId] = useState('');
  const [urlFile, setFileUrl] = useState('');

  const httpMethodByApiMethod = {
    getSettings: 'GET',
    getStateInstance: 'GET',
    sendMessage: 'POST',
    sendFileByUrl: 'POST'
  }

  const sendRequest = async (
    e: React.MouseEvent<HTMLButtonElement>, 
    apiMethod: keyof typeof httpMethodByApiMethod, 
    params: { [key: string]: string } | null = null
  ) => {
    e.preventDefault();
    const form = (e.target as HTMLButtonElement).form;
    if (form?.checkValidity() === false) {
      return;
    }
    setResult('...');
    const method = httpMethodByApiMethod[apiMethod];
    if (!method) {
      throw new Error(`Method "${apiMethod}" is not supported`);
    }

    try {
      const response = await fetch(`${greenApiEndpoint}/waInstance${instanceId}/${apiMethod}/${apiTokenInstance}`, {
        method,
        body: params ? JSON.stringify(params) : undefined
      });
      setResult(await response.json());
    } catch (error: any) {
      setResult(error.message);
    }
  }

  const onInstanceIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstanceId(e.target?.value);
  }
  const onApiTokenInstanceChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setapiTokenInstance(e.target?.value);
  }
  const onMessageChatIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageChatId(e.target?.value);
  }
  const onMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target?.value);
  }
  const onFileChatIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileChatId(e.target?.value);
  }
  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUrl(e.target?.value);
  }

  const getSettings = async (e: React.MouseEvent<HTMLButtonElement>) => sendRequest(e, 'getSettings');

  const getStateInstance = async (e: React.MouseEvent<HTMLButtonElement>) => sendRequest(e, 'getStateInstance');

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => sendRequest(e, 'sendMessage', { chatId: messageChatId, message });

  const sendFileByUrl = async (e: React.MouseEvent<HTMLButtonElement>) => sendRequest(e, 'sendFileByUrl', { chatId: fileChatId, urlFile });


  return (
    <div  className='App'>
      <div className='App-logo'>
        <h1>Green API test</h1>
      </div>
      <Container>
        <Row>
          <Col>
            <Form className="d-grid gap-2">
              <FloatingLabel label="instanceId" className="mb-2">
                <Form.Control required placeholder="" onChange={onInstanceIdChanged}/>
              </FloatingLabel>
              <FloatingLabel label="apiTokenInstance" className="mb-2">
                <Form.Control required placeholder="" onChange={onApiTokenInstanceChanged}/>
              </FloatingLabel>
              <Button type="submit" className='mt-4' variant="outline-secondary" size="lg" onClick={getSettings} >getSettings</Button>
              <Button type="submit" className='mt-3' variant="outline-secondary" size="lg" onClick={getStateInstance} >getStateInstance</Button>

              <FloatingLabel label="chatId" className="mb-2 mt-3">
                <Form.Control placeholder="" onChange={onMessageChatIdChanged}/>
              </FloatingLabel>
              <FloatingLabel label="message" className="mb-2">
                <Form.Control className='' as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} onChange={onMessageChanged} />
              </FloatingLabel>
              <Button type="submit" variant="outline-secondary" size="lg" onClick={sendMessage} >sendMessage</Button>

              <FloatingLabel label="chatId" className="mb-2 mt-3">
                <Form.Control placeholder="" onChange={onFileChatIdChanged}/>
              </FloatingLabel>
              <FloatingLabel label="fileUrl" className="mb-2 mt-3">
                <Form.Control placeholder="" onChange={onFileChanged}/>
              </FloatingLabel>
              <Button type="submit" className='mt-3' variant="outline-secondary" size="lg" onClick={sendFileByUrl} >sendFileByUrl</Button>
            </Form>
          </Col>
          <Col className='Result'>
            <h2>Ответ:</h2>
            <Form.Control className='Value' as="textarea" rows={31} readOnly value={result}  />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
