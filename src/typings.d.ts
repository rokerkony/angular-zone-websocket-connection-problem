/* SystemJS module definition */
declare var module: NodeModule;
import 'sendbird/SendBird';
interface NodeModule {
  id: string;
}

interface MyWindow extends Window {
  SendBird: SendBirdFactory;
}
