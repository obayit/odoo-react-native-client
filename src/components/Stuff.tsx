// test any stuff here
import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';

const PaperModalExample = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{ marginTop: 30 }} onPress={showModal}>
        Show
      </Button>
    </PaperProvider>
  );
};

export default PaperModalExample;


let dat = {
  "url": "/web/dataset/call_kw/product.product/search_read",
  "method": "POST",
  "body": {
    "jsonrpc": "2.0",
    "method": "call",
    "params":
    {
      "args": {
        "model": "product.product",
        "method": "search_read",
        "kwargs": {},
        "context": {},
        "domain": []
      }
    }
  }
}
let mehjjj = {
  "url": "/web/dataset/call_kw/pos.order/search_read",
  "method": "POST",
  "body": {
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "pos.order",
      "method": "search_read",
      "kwargs": {},
      "context": {},
      "domain": []
    }
  }
}
let meh = {
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "ether.trans",
    "domain": [],
    "fields": ["is_clearbank",
      "wrong_details",
      "is_executor_rejected"],
    "limit": 80,
    "sort": "",
    "context": {
      "lang": "en_US",
      "tz": "Africa/Khartoum",
      "uid": 93,
      "search_default_today": 1,
      "params": { "action": 228 }
    }
  },
  "id": 362665130
}
